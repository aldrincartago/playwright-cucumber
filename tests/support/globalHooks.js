// globalHooks.js
const { chromium } = require('@playwright/test');
const { Before, After, setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
    async launchBrowser() {
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
        await this.page.setDefaultTimeout(60000);
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

setWorldConstructor(CustomWorld);

Before(async function() {
    await this.launchBrowser();
});

After(async function() {
    await this.closeBrowser();
});
