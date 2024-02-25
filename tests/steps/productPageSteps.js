const { Then} = require('@cucumber/cucumber');
const ProductPage = require('../pageobjects/ProductPage');

Then('I am on product result page', async function () {
    const productPage = new ProductPage(this.page);
    await productPage.verifyIsVisible();
});
