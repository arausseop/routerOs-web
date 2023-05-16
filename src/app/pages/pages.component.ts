import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MenuItem } from './menu-item';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  public menu = [];

    constructor(private translate: TranslateService) {}

    ngOnInit() {
        this.menu = MENU_ITEMS;
        this.translateMenu();
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => { //Live reload
            this.translateMenu();
        });
    }

    private translateMenu(): void {
        this.menu.forEach((menuItem: MenuItem) => {
            this.translateMenuTitle(menuItem);
        });
    }

    /**
     * Translates one root menu item and every nested children
     * @param menuItem
     * @param prefix
     */
    private translateMenuTitle(menuItem: MenuItem, prefix: string = ''): void {
        let key = '';
        try {
            key = (prefix !== '')
                ? PagesComponent.getMenuItemKey(menuItem, prefix)
                : PagesComponent.getMenuItemKey(menuItem);
        }
        catch (e) {
            //Key not found, don't change the menu item
            return;
        }

        this.translate.get(key).subscribe((translation: string) => {
            menuItem.title = translation;
        });
        if (menuItem.children != null) {
            //apply same on every child
            menuItem.children.forEach((childMenuItem: MenuItem) => {
                //We remove the nested key and then use it as prefix for every child
                this.translateMenuTitle(childMenuItem, PagesComponent.trimLastSelector(key));
            });
        }
    }

    /**
     * Resolves the translation key for a menu item. The prefix must be supplied for every child menu item
     * @param menuItem
     * @param prefix
     * @returns {string}
     */
    private static getMenuItemKey(menuItem: MenuItem, prefix: string = 'module.sidebar.menu'): string {
        if (menuItem.key == null) {
            throw new Error('Key not found');
        }

        const key = menuItem.key.toLowerCase();
        if (menuItem.children != null) {
            return prefix + '.' + key + '.' + key; //Translation is nested
        }
        return prefix + '.' + key;
    }

    /**
     * Used to remove the nested key for translations
     * @param key
     * @returns {string}
     */
    private static trimLastSelector(key: string): string {
        const keyParts = key.split('.');
        keyParts.pop();
        return keyParts.join('.');
    }
}
