const { Then} = require('@cucumber/cucumber');
const { expect} = require("@playwright/test");
const ProductPage = require('../pageobjects/ProductPage');

Then('I am on product result page', async function () {
    const productPage = new ProductPage(this.page);
    await productPage.verifyIsVisible();
});
