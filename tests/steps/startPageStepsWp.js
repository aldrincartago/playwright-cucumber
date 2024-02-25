const { Given, When} = require('@cucumber/cucumber');

const acceptCookiesButton = '.c24-cookie-consent-notice-buttons .c24-cookie-consent-button:nth-child(2)';
const searchField = 'input[name=\'q\']';
const baseUrl = 'https://www.check24.de/'

Given('I open Check24 page wp', async function () {
    await this.page.goto(baseUrl, { waitUntil: 'networkidle' });
    await this.page.locator(acceptCookiesButton).click();

});

When('I search for {string} wp', async function (product) {
    await this.page.locator(searchField).fill(product);
    await this.page.locator(searchField).press('Enter');
});
