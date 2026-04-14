import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect as expectWDIO, browser, $ } from '@wdio/globals'

import LoginPage from '../pageobjects/login.page.js';
import InventoryPage from '../pageobjects/inventory.page.js';
import CartPage from '../pageobjects/cart.page.js';
import CheckoutPage from '../pageobjects/checkout.page.js';

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

When('I open the cart', async () => {
    const cartLink = await $('.shopping_cart_link');
    await cartLink.waitForClickable();
    await cartLink.click();
});

When('I proceed to checkout and fill details with {string} {string} {string}', async (firstName: string, lastName: string, postalCode: string) => {
    // On cart page there's a checkout button with id #checkout
    const checkoutBtn = await $('#checkout');
    await checkoutBtn.waitForClickable();
    await checkoutBtn.click();
    await CheckoutPage.fillCheckoutInfo(firstName, lastName, postalCode);
});

When('I finish the order', async () => {
    await CheckoutPage.finishOrder();
});

When('I logout', async () => {
    const menuBtn = await $('#react-burger-menu-btn');
    await menuBtn.waitForClickable();
    await menuBtn.click();
    const logoutLink = await $('#logout_sidebar_link');
    await logoutLink.waitForClickable();
    await logoutLink.click();
});

Then('I should be on the login page', async () => {
    // Check that login button exists and URL is the base login page
    const loginBtn = await $('#login-button');
    await expectWDIO(loginBtn).toBeExisting();
    const url = await browser.getUrl();
    if (!url.includes('saucedemo.com') || url.includes('/inventory.html')) {
        throw new Error(`Expected to be on login page, current url: ${url}`);
    }
});

// helper: check message in several places
async function checkFlashMessage(normalized: string) {
    const titleSel = await $('.title');
    const containerSel = await $('#inventory_container');
    const loginErrorSel = await LoginPage.errorMessage;
    const bodySel = await $('body');

    await browser.waitUntil(async () => {
        try {
            if (await titleSel.isExisting()) return true;
            if (await containerSel.isExisting()) return true;
            if (await loginErrorSel.isExisting()) return true;
            const bodyText = await bodySel.getText();
            if (bodyText && bodyText.includes(normalized)) return true;
            return false;
        } catch (e) {
            return false;
        }
    }, { timeout: 5000, timeoutMsg: `Timed out waiting for page elements or body to contain '${normalized}'` });

    if (await loginErrorSel.isExisting()) {
        const errText = await loginErrorSel.getText();
        if (errText.includes(normalized)) return;
        throw new Error(`Expected login error to contain '${normalized}' but got '${errText}'`);
    }

    if (await titleSel.isExisting()) {
        const text = await titleSel.getText();
        if (text.includes(normalized)) return;
    }

    if (await containerSel.isExisting()) {
        const text = await containerSel.getText();
        if (text.includes(normalized)) return;
    }

    const bodyTextFinal = await bodySel.getText();
    if (bodyTextFinal && bodyTextFinal.includes(normalized)) return;

    throw new Error(`Could not find message '${normalized}' in login error, title, inventory container or page body.`);
}

// keep existing {string} step and call helper
Then('I should see a flash message saying {string}', async (message: string) => {
    const normalized = message.trim();
    await checkFlashMessage(normalized);
});

// support unquoted text (Scenario Outline replacement may produce unquoted tokens)
Then(/^I should see a flash message saying (.*)$/, async (raw: string) => {
    const normalized = raw.replace(/^['"\s]+|['"\s]+$/g, '');
    await checkFlashMessage(normalized);
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

Then('I should see the confirmation message {string}', async (expectedMessage: string) => {
    const actual = await CheckoutPage.getConfirmationText();
    if (!actual.includes(expectedMessage)) {
        throw new Error(`Expected confirmation message to include '${expectedMessage}' but got '${actual}'`);
    }
});
