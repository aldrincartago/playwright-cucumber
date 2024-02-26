const {chromium} = require('@playwright/test');
const {Before, After, setWorldConstructor, setDefaultTimeout} = require('@cucumber/cucumber');
const ArtefactManager = require('./ArtefactManager');
const path = require('path');

setDefaultTimeout(30 * 1000); // Setze Timeout für jeden Schritt

class BrowserSetup {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.artefactManager = new ArtefactManager();
    }

    async launchBrowser() {
        this.browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        this.context = await this.browser.newContext({ recordVideo: { dir: this.artefactManager.videosDir } });
        this.page = await this.context.newPage();
    }

    async startTracing() {
        await this.context.tracing.start({screenshots: true, snapshots: true, sources: true});
    }

    async cleanupAfterTest() {
        await this.page?.close();
        await this.context?.close();
        await this.browser?.close();
    }
}

setWorldConstructor(BrowserSetup);

Before(async function ({ pickle }) {
    await this.launchBrowser();
    await this.startTracing();
    // Registriere das Video am Anfang des Tests
    this.artefactManager.registerVideo(this.page, pickle.name);
});

After(async function({ result, pickle }) {
    // Behandle das Video am Ende des Tests basierend auf dem Ergebnis
    await this.artefactManager.handleVideoForFailedTest(result.status, pickle.name);

    if (result.status !== 'PASSED') {
        await this.artefactManager.saveScreenshot(this.page, pickle.name);
        await this.artefactManager.saveTrace(this.context, pickle.name);
    }
    await this.cleanupAfterTest();
});
