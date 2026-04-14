import { $ } from '@wdio/globals'
import Page from './page.js';

class CheckoutPage extends Page {
    public get checkoutButton() {
        return $('#checkout');
    }

    public get firstName() {
        return $('#first-name');
    }

    public get lastName() {
        return $('#last-name');
    }

    public get postalCode() {
        return $('#postal-code');
    }

    public get continueButton() {
        return $('#continue');
    }

    public get finishButton() {
        return $('#finish');
    }

    public get completeHeader() {
        return $('.complete-header');
    }

    public async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
        await this.firstName.setValue(firstName);
        await this.lastName.setValue(lastName);
        await this.postalCode.setValue(postalCode);
        await this.continueButton.click();
    }

    public async finishOrder() {
        await this.finishButton.click();
    }

    public async getConfirmationText(): Promise<string> {
        const exists = await this.completeHeader.isExisting();
        if (!exists) return '';
        return this.completeHeader.getText();
    }
}

export default new CheckoutPage();

