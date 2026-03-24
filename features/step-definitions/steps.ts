import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals'

import LoginPage from '../pageobjects/login.page.js';
import InventoryPage from '../pageobjects/inventory.page.ts';

const pages = {
    login: LoginPage
}

Given(/^I am on the (\w+) page$/, async (page: string) => {
    await (pages as any)[page].open()
});

When(/^I login with (\w+) and (.+)$/, async (username: string, password: string) => {
    await LoginPage.login(username, password)
});

Then(/^I should see a flash message saying (.*)$/, async (message) => {
    await expect(InventoryPage.inventoryContainer).toBeExisting();
    await expect(InventoryPage.inventoryContainer).toHaveText(expect.stringContaining(message));
});