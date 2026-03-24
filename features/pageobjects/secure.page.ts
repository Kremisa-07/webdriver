import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inventoryContainer () {
        return $('#flash');
    }

    public get burgerMenu () {
        return $('#react-burger-menu-btn');
    }

    public get logoutLink () {
        return $('#logout_sidebar_link');
    }

    public get flashAlert () {
        return $('.inventory_list');
    }
}

export default new SecurePage();
