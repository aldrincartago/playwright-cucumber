class StartPage {
    constructor(page) {
        this.page = page;
        this.acceptCookiesButton = '.c24-cookie-consent-notice-buttons .c24-cookie-consent-button:nth-child(2)';
        this.searchField = 'input[name=\'q\']';
    }

    async open() {
        await this.page.goto("https://www.check24.de/", { waitUntil: 'networkidle' });
        await this.page.locator(this.acceptCookiesButton).click();
    }

    async searchFor(product) {
        await this.page.locator(this.searchField).fill(product);
        await this.page.locator(this.searchField).press('Enter');
    }
}
module.exports = StartPage;
