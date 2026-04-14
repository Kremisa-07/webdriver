import { $ } from '@wdio/globals'
import Page from './page.js';

class InventoryPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inventoryContainer () {
        return $('#inventory_container');
    }

    public get title() {
        return $('.title');
    }
}

export default new InventoryPage();