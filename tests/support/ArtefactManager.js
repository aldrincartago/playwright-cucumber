const fs = require('fs-extra');
const path = require('path');

class ArtefactManager {
    constructor() {
        this.basePath = path.join(__dirname, '..', 'test-artefacts');
        this.screenshotsDirectory = path.join(this.basePath, 'screenshots');
        this.tracesDirectory = path.join(this.basePath, 'traces');
        this.videosDirectory = path.join(this.basePath, 'videos');
        this.pendingVideos = new Map();

        fs.ensureDirSync(this.screenshotsDirectory);
        fs.ensureDirSync(this.tracesDirectory);
        fs.ensureDirSync(this.videosDirectory);
    }

    generateFilePath(dir, scenarioName, extension) {
        const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = Date.now();
        return path.join(dir, `${safeName}-${timestamp}${extension}`);
    }

    async saveScreenshot(page, scenarioName) {
        const screenshotPath = this.generateFilePath(this.screenshotsDirectory, scenarioName, '.png');
        await page.screenshot({path: screenshotPath});
    }

    async saveTrace(context, scenarioName) {
        const tracePath = this.generateFilePath(this.tracesDirectory, scenarioName, '.zip');
        await context.tracing.stop({path: tracePath});
    }

    async registerVideo(page, scenarioName) {
        const video = page.video();
        if (video) {
            video.path().then(videoPath => { this.pendingVideos.set(scenarioName, videoPath) });
        }
    }

    async handleVideoForFailedTest(result, scenarioName) {
        const videoPath = this.pendingVideos.get(scenarioName);
        if (!videoPath) {
            return
        }

        if (result !== 'PASSED') {
            const destPath = this.generateFilePath(this.videosDirectory, scenarioName, '.webm');
            await fs.move(videoPath, destPath).catch(async e => { console.error(`Error moving video: ${e}`) });
        } else {
            //delete video if test successful
            await fs.unlink(videoPath).catch(e => console.error(`Error deleting video: ${e}`));
        }
        this.pendingVideos.delete(scenarioName);
    }

    async handleTestArtifacts(result, scenarioName, page, context) {
        if (result.status !== 'PASSED') {
            await this.saveScreenshot(page, scenarioName);
            await this.saveTrace(context, scenarioName);
            await this.handleVideoForFailedTest(result.status, scenarioName);
        } else {
            await this.cleanupSuccessTestVideo(scenarioName);
        }
    }

    async cleanupSuccessTestVideo(scenarioName) {
        const videoPath = this.pendingVideos.get(scenarioName);
        if (!videoPath) {
            return;
        }
        await fs.unlink(videoPath).catch(e => console.error(`Error deleting video: ${e}`));
        this.pendingVideos.delete(scenarioName);
    }
}

module.exports = ArtefactManager;
