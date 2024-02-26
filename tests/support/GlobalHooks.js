const {chromium} = require('@playwright/test');
const {Before, After, setWorldConstructor, setDefaultTimeout} = require('@cucumber/cucumber');
const ArtefactManager = require('./ArtefactManager');

setDefaultTimeout(30 * 1000); // time out for every steps

class BrowserSetup {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.artefactManager = new ArtefactManager();
    }

    async launchBrowser() {
        this.browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        this.context = await this.browser.newContext({ recordVideo: { dir: this.artefactManager.videosDirectory } });
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
    await this.artefactManager.registerVideo(this.page, pickle.name);
});

After(async function({ result, pickle }) {
    await this.artefactManager.handleTestArtifacts(result, pickle.name, this.page, this.context);
    await this.cleanupAfterTest();
});
