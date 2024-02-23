const { expect} = require("@playwright/test");

class ProductPage {
    constructor(page) {
        this.page = page;
        this.header = '.search-header';
    }

    async verifyIsVisible() {
        await expect(this.page.locator(this.header)).toBeVisible();
    }
}

module.exports = ProductPage;
