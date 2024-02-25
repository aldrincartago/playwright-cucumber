const { Given, When} = require('@cucumber/cucumber');
const StartPage = require('../pageobjects/StartPage');

Given('I open Check24 page', async function () {
    const startPage = new StartPage(this.page);
    await startPage.open();
});

When('I search for {string}', async function (product) {
    const startPage = new StartPage(this.page);
    await startPage.searchFor(product);
});
