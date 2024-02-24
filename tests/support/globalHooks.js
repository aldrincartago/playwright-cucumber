const { chromium } = require('@playwright/test');
const { Before, After, setWorldConstructor } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

class BrowserSetup {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.videoPaths = []; // Speichern Sie die Video-Pfade
    }

    async launchBrowser() {
        this.browser = await chromium.launch({ headless: true });
        this.context = await this.browser.newContext({
            recordVideo: { dir: path.join(__dirname, '..', 'videos') }
        });
        // Erfassen Sie den Pfad jedes aufgenommenen Videos
        this.context.on('page', async page => {
            const video = page.video();
            if (video) {
                const videoPath = await video.path();
                this.videoPaths.push(videoPath);
            }
        });
        this.page = await this.context.newPage();
        await this.page.setDefaultTimeout(60000);
    }

    async startTracing() {
        await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    }

    async deleteVideosAndTracesIfTestPassed(testResult) {
        if (testResult === 'PASSED') {
            this.videoPaths.forEach(videoPath => {
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath); // Löschen des Videos
                }
            });
            this.videoPaths = []; // Zurücksetzen der Video-Pfade
            // Kein Tracing speichern
            await this.context.tracing.stop();
        } else {
            // Speichern Sie Tracing und Videos bei Fehlschlag
            const tracesDir = path.join(__dirname, '..', 'traces');
            if (!fs.existsSync(tracesDir)) {
                fs.mkdirSync(tracesDir, { recursive: true });
            }
            await this.context.tracing.stop({ path: path.join(tracesDir, 'trace.zip') });
        }
    }

    async cleanupAfterTest() {
        if (this.page) await this.page.close();
        if (this.context) await this.context.close();
        if (this.browser) await this.browser.close();
    }
}

setWorldConstructor(BrowserSetup);

Before(async function() {
    await this.launchBrowser();
    await this.startTracing();
});

After(async function(scenario) {
    await this.deleteVideosAndTracesIfTestPassed(scenario.result.status);
    await this.cleanupAfterTest();
});
