// startPageSteps.js
const {Given, When} = require('@cucumber/cucumber');

const acceptCookiesButton = '.c24-cookie-consent-notice-buttons .c24-cookie-consent-button:nth-child(2)';
const searchField = 'input[name=\'q\']';

Given('I open Check24 page', async function () {
    await this.page.goto("https://www.check24.de/", {waitUntil: 'networkidle'});
    await this.page.locator(acceptCookiesButton).click();
});

When('I search for {string}', async function (product) {
    await this.page.locator(searchField).type(product);
    await this.page.locator(searchField).press('Enter');
});