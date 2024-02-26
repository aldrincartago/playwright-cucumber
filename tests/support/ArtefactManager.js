const fs = require('fs-extra');
const path = require('path');

class ArtefactManager {
    constructor() {
        this.basePath = path.join(__dirname, '..', 'test-artefacts');
        this.screenshotsDir = path.join(this.basePath, 'screenshots');
        this.tracesDir = path.join(this.basePath, 'traces');
        this.videosDir = path.join(this.basePath, 'videos');
        this.pendingVideos = new Map();

        fs.ensureDirSync(this.screenshotsDir);
        fs.ensureDirSync(this.tracesDir);
        fs.ensureDirSync(this.videosDir);
    }
    async saveScreenshot(page, scenarioName) {
        const screenshotPath = path.join(this.screenshotsDir, `${scenarioName.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.png`);
        await page.screenshot({path: screenshotPath});
    }

    async saveTrace(context, scenarioName) {
        const tracePath = path.join(this.tracesDir, `trace-${scenarioName.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.zip`);
        await context.tracing.stop({path: tracePath});
    }

    async registerVideo(page, scenarioName) {
        const video = page.video();
        if (video) {
            video.path().then(videoPath => {
                this.pendingVideos.set(scenarioName, videoPath);
            });
        }
    }


    async handleVideoForFailedTest(result, scenarioName) {
        const videoPath = this.pendingVideos.get(scenarioName);
        if (videoPath) {
            if (result !== 'PASSED') {
                // Verschiebe das Video in den korrekten Unterordner
                const destPath = path.join(this.videosDir, `${scenarioName.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.webm`);
                await fs.move(videoPath, destPath).catch(e => console.error(`Fehler beim Verschieben des Videos: ${e}`));
            } else {
                // Lösche das Video, wenn der Test bestanden hat
                await fs.unlink(videoPath).catch(e => console.error(`Fehler beim Löschen des Videos: ${e}`));
            }
            this.pendingVideos.delete(scenarioName);
        }
    }
}

module.exports = ArtefactManager;
