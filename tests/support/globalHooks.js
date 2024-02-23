const { chromium } = require('@playwright/test');
const { Before, After, setWorldConstructor } = require('@cucumber/cucumber');

class BrowserSetup {
    async launchBrowser() {
        this.browser = await chromium.launch({ headless: true });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        await this.page.setDefaultTimeout(60000);
    }

    async cleanupAfterTest() {
        if (this.page) {
            await this.page.close();
        }
        if (this.context) {
            await this.context.close();
        }
        if (this.browser) {
            await this.browser.close();
        }
    }
}

setWorldConstructor(BrowserSetup);

Before(async function() {
    await this.launchBrowser();
});

After(async function() {
    await this.cleanupAfterTest();
});
