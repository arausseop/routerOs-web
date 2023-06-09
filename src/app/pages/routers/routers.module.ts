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
  NbWindowModule,

} from '@nebular/theme';

import { FormsModule as ngFormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '../forms/forms.module';
import { TablesRoutingModule } from '../tables/tables-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TranslateModule } from '@ngx-translate/core';

import { RoutersRoutingModule } from './routers-routing.module';
import { RoutersComponent } from './routers.component';
import { RoutersListComponent } from './routers-list/routers-list.component';
import { RoutersNewComponent } from './routers-new/routers-new.component';
import { RoutersShowComponent } from './routers-show/routers-show.component';
import { RoutersEditComponent } from './routers-edit/routers-edit.component';
import { RoutersSettingsComponent } from './routers-list/routers-settings/routers-settings.component';
import { RoutersSettingsDialogComponent } from './routers-list/routers-settings-dialog/routers-settings-dialog.component';


@NgModule({
  declarations: [
    RoutersComponent,
    RoutersListComponent,
    RoutersNewComponent,
    RoutersShowComponent,
    RoutersEditComponent,
    RoutersSettingsDialogComponent,
    RoutersSettingsComponent
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
    RoutersRoutingModule,
    NbDialogModule,
    TranslateModule,
    NbToggleModule,
    NbCheckboxModule,
    NbActionsModule,
    NbProgressBarModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbWindowModule.forChild(),
  ],
  entryComponents: [
    RoutersSettingsComponent

  ],
})
export class RoutersModule { }
