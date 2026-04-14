import { $, browser } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputUsername () {
        return $('#user-name');
    }

    public get inputPassword () {
        return $('#password');
    }

    public get btnSubmit () {
        return $('#login-button');
    }

    public get errorMessage () {
        return $('.error-message-container');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();

        // wait until either the inventory container appears (successful login)
        // or an error message appears (failed login). This avoids hanging if
        // the page doesn't remove the error container as expected.
        await browser.waitUntil(async () => {
            const inventoryExists = await $('#inventory_container').isExisting();
            const errorExists = await this.errorMessage.isExisting();
            return inventoryExists || errorExists;
        }, { timeout: 5000, timeoutMsg: 'Timed out waiting for login result (inventory or error)'});
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open();
    }
}

export default new LoginPage();
