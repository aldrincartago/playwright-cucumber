const { chromium } = require('@playwright/test');
const { Before, After, setWorldConstructor } = require('@cucumber/cucumber');

class BrowserSetup {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async launchBrowser() {
        this.browser = await chromium.launch({ headless: true });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        await this.page.setDefaultTimeout(60000);
    }

    async closeBrowser() {
        // ensures that the context is closed after each test
        if (this.context) {
            await this.context.close();
        }
        // closes the browser explicitly to terminate all background processes
        if (this.browser) {
            await this.browser.close();
        }
    }

    async clearCookiesAndStorage() {
        // deletes cookies
        if (this.context) {
            await this.context.clearCookies();
            await this.page.evaluate(() => {
                localStorage.clear();
                sessionStorage.clear();
            });
        }
    }
}

setWorldConstructor(BrowserSetup);

Before(async function() {
    await this.launchBrowser();
});

After(async function() {
    await this.clearCookiesAndStorage();
    await this.closeBrowser();
});
