import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, catchError, filter, switchMap } from 'rxjs/operators';
import { of, Subject, Subscription, timer } from 'rxjs';
import { NbAuthService } from '../../../auth/services/auth.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../@core/mock/notification.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  testUser: {};
  notifications: any;

  public userMenu = [];

  langs = [
    {
      value: 'es',
      name: 'Español',
    },
    {
      value: 'en',
      name: 'English',
    },
  ];

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'routeros',
      name: 'routeros',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';
  currentLang = 'es';
  subscription: Subscription;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authService: NbAuthService,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.translate.use(event.lang);
    //   this.translateMenu();
    // });
  }

  private translateMenu(): void {
    this.userMenu.forEach((menuItem: any) => {
      this.translateMenuTitle(menuItem);
    });
  }

  ngOnInit() {
    this.userMenu = [
      { title: 'profile', key: 'profile', link: '/auth/logout' },
      { title: 'logout', key: 'logout', link: '/auth/logout' }
    ];
    this.translateMenu();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => { //Live reload
      this.translateMenu();
    });

    this.currentTheme = this.themeService.currentTheme;
    this.authService.onTokenChange()
      .subscribe((token: any) => {

        if (token.isValid()) {
          this.testUser = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
          console.log('token.getPayload().user', token.getPayload().user);
          this.user = token.getPayload().user
        }

      });

    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    //! If you activate the notifications you must uncomment the unsubscription that is below
    // this.subscription = timer(0, 60000)
    //   .pipe(
    //     switchMap(() => {
    //       return this.notificationService.getCheckApiNotificationObservableData()
    //         .pipe(catchError(err => {
    //           console.error(err);
    //           return of(undefined);
    //         }));
    //     }),
    //     filter(data => data !== undefined)
    //   )
    //   .subscribe(data => {
    //     this.notifications = data;
    //     console.log(this.notifications);
    //   });
  }

  ngOnDestroy() {
    //! This is de unsubscriber notificaction
    // this.subscription.unsubscribe();
    this.destroy$.next();

    this.destroy$.complete();

  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  changeLang(langName: string) {
    this.translate.use(langName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  /**
     * Translates one root menu item and every nested children
     * @param menuItem
     * @param prefix
     */
  private translateMenuTitle(menuItem: any, prefix: string = ''): void {
    let key = '';
    try {
      key = (prefix !== '')
        ? HeaderComponent.getMenuItemKey(menuItem, prefix)
        : HeaderComponent.getMenuItemKey(menuItem);
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
      menuItem.children.forEach((childMenuItem: any) => {
        //We remove the nested key and then use it as prefix for every child
        this.translateMenuTitle(childMenuItem, HeaderComponent.trimLastSelector(key));
      });
    }
  }

  /**
   * Resolves the translation key for a menu item. The prefix must be supplied for every child menu item
   * @param menuItem
   * @param prefix
   * @returns {string}
   */
  private static getMenuItemKey(menuItem: any, prefix: string = 'module.header.menu.user'): string {
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
