import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersNewComponent } from './users-new/users-new.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersShowComponent } from './users-show/users-show.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'list',
        component: UsersListComponent,
      },
      {
        path: 'new',
        component: UsersNewComponent,
      },
      {
        path: 'show/:id',
        component: UsersShowComponent,
      },
      {
        path: 'edit/:id',
        component: UsersEditComponent,
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
export class UsersRoutingModule { }
