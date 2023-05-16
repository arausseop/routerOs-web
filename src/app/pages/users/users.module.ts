import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeModule } from '../../@theme/theme.module';

import {
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbTreeGridModule,
  NbIconModule,
  NbInputModule,
  NbActionsModule,
  NbButtonModule,
  NbListModule,
  NbSelectModule,
  NbRadioModule,
  NbUserModule,
  NbTabsetModule,
  NbProgressBarModule,
  NbDialogModule,
  NbFormFieldModule,
  NbStepperModule,
  NbSpinnerModule,
  NbRouteTabsetModule,
  NbAccordionModule,
  NbAutocompleteModule,
  NbToggleModule,
} from '@nebular/theme';

import { NgxEchartsModule } from 'ngx-echarts';

import { ChartModule } from 'angular2-chartjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { FormsRoutingModule } from '../forms/forms-routing.module';
import { FormsModule as ngFormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '../forms/forms.module';
import { TablesRoutingModule } from '../tables/tables-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersShowComponent } from './users-show/users-show.component';
import { UsersNewComponent } from './users-new/users-new.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersComponent } from './users.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserCompaniesComponent } from './users-show/user-companies/user-companies.component';


@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    UsersShowComponent,
    UsersNewComponent,
    UsersEditComponent,
    UserCompaniesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbDatepickerModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbSelectModule,
    NbAutocompleteModule,
    NbRadioModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    TablesRoutingModule,
    Ng2SmartTableModule,
    UsersRoutingModule,
    NbDialogModule,
    TranslateModule,
    NbToggleModule
  ]
})
export class UsersModule { }
