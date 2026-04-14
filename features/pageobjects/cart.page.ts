import { $ } from '@wdio/globals'
import Page from './page.js';

class CartPage extends Page {
    public get cartBadge () {
        return $('.shopping_cart_badge');
    }

    public async getBadgeCount (): Promise<number> {
        const exists = await this.cartBadge.isExisting();
        if (!exists) return 0;
        const text = await this.cartBadge.getText();
        return parseInt(text, 10);
    }
}

export default new CartPage();

