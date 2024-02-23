const {Then} = require('@cucumber/cucumber');
const {expect} = require("@playwright/test");

const header = '.search-header';

Then('I am on product result page', async function () {
    await expect(this.page.locator(header)).toBeVisible();
});
