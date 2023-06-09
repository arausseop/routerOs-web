import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';


import { UsersModule } from './users/users.module';



import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,


    UsersModule,


    TranslateModule,

    // NbAuthModule,
  ],
  declarations: [
    PagesComponent,
  ]
  // ,exports: [
  //   CountriesNewComponent
  // ]
})
export class PagesModule {
}
