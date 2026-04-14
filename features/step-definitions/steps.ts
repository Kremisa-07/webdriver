import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect as expectWDIO } from '@wdio/globals'

import LoginPage from '../pageobjects/login.page.js';
import InventoryPage from '../pageobjects/inventory.page.js';
import CartPage from '../pageobjects/cart.page.js';

Given('I open the login page', async () => {
    await LoginPage.open();
});

When('I login with {string} and {string}', async (username: string, password: string) => {
    await LoginPage.login(username, password);
});

Given(/^I am on the (\w+) page$/, async (page: string) => {
    const pages: any = { login: LoginPage };
    await pages[page].open();
});

When(/^I login with (\w+) and (.+)$/, async (username: string, password: string) => {
    await LoginPage.login(username, password)
});

When('I add the first product to the cart', async () => {
    // use CSS selector for the first product's add button
    const btn = await $('.inventory_item button.btn_inventory');
    await btn.waitForClickable();
    await btn.click();
});

Then(/^I should see a flash message saying (.*)$/, async (message) => {
    const container = await InventoryPage.inventoryContainer;
    await expectWDIO(container).toBeExisting();
    const text = await container.getText();
    if (!text.includes(message)) {
        throw new Error(`Expected inventory container to contain '${message}' but got '${text}'`);
    }
});

Then('I should be on the inventory page', async () => {
    const url = await browser.getUrl();
    if (!url.includes('/inventory.html')) {
        throw new Error(`Expected to be on inventory page, current url: ${url}`);
    }
    await expectWDIO(await InventoryPage.inventoryContainer).toBeDisplayed();
});

Then('the cart badge should show {string}', async (count: string) => {
    const actual = await CartPage.getBadgeCount();
    const expected = parseInt(count, 10);
    if (actual !== expected) {
        throw new Error(`Expected cart badge ${expected} but found ${actual}`);
    }
});
