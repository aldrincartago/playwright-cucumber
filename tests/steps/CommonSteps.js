const { Given, When } = require('@cucumber/cucumber');
const { expect } = require("@playwright/test");

const acceptCookiesButton = '.c24-cookie-consent-notice-buttons .c24-cookie-consent-button:nth-child(2)';
const searchField = 'input[name=\'q\']';

Given('I open the {string} webpage', async function (url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await expect(this.page.getByText(' Home')).toBeVisible();
});

When('I signup as a new user', async function () {
    await this.page.getByText(' Signup / Login').click();
    await expect(this.page.getByText(' New User Signup!')).toBeVisible();
});