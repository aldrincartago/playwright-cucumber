const { chromium } = require('@playwright/test');
const { Before,After,setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
const fs = require('fs-extra');
const path = require('path');

setDefaultTimeout(30 * 1000);

class BrowserSetup {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.recordedTestVideos = [];
    }

    async launchBrowser() {
        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        this.context = await this.browser.newContext({ recordVideo: { dir: path.join(__dirname, '..', 'videos') } });

        this.context.on('page', async page => {
            page.video()?.path().then(recordedTestVideo => this.recordedTestVideos.push(recordedTestVideo));
        });

        this.page = await this.context.newPage();
    }

    async startTracing() {
        await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    }

    async recordFailureArtifacts(testResult) {
        const tracesDir = path.join(__dirname, '..', 'traces');
        fs.ensureDirSync(tracesDir); // ensures directory exists

        if (testResult === 'PASSED') {
            this.recordedTestVideos.forEach(fs.unlinkSync);
        } else {
            await this.context.tracing.stop({ path: path.join(tracesDir, `trace-${Date.now()}.zip`) });
        }

        this.recordedTestVideos = [];
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

After(async function({ result }) {
    await this.recordFailureArtifacts(result.status);
    await this.cleanupAfterTest();
});
