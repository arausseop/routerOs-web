import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutersComponent } from './routers.component';
import { RoutersListComponent } from './routers-list/routers-list.component';
import { RoutersNewComponent } from './routers-new/routers-new.component';
import { RoutersShowComponent } from './routers-show/routers-show.component';
import { RoutersEditComponent } from './routers-edit/routers-edit.component';

const routes: Routes = [
  {
    path: '',
    component: RoutersComponent,
    children: [
      {
        path: 'list',
        component: RoutersListComponent,
      },
      {
        path: 'new',
        component: RoutersNewComponent,
      },
      {
        path: 'show/:id',
        component: RoutersShowComponent,
      },
      {
        path: 'edit/:id',
        component: RoutersEditComponent,
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'prefix',
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutersRoutingModule { }
