import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';

import { Subject } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { UserApiService } from '../../../@core/mock/user-api.service';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NbDialogService, NbComponentStatus, NbToastrConfig, NbGlobalPosition, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HeadersServerDataSource } from '../../../helpers/headers-server-datasource';
import { NbTokenService } from '../../../auth/services/token/token.service';

interface IPaging {
  page: number;
  perPage: number;
}

@Component({
  selector: 'ngx-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() companyId: string;

  users: any = [];

  source: HeadersServerDataSource;
  headers: HttpHeaders;
  accessToken: string;
  // source: LocalDataSource = new LocalDataSource();

  config: NbToastrConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = false;

  status: NbComponentStatus = 'primary';
  title = '';
  content = '';

  settings: any;

  initTableSettings() {
    this.settings = {
      mode: 'external',
      noDataMessage: this.translate.instant('messages.smartTableNoData'),
      pager: {
        display: true,
        perPage: 10,
      },
      actions: {
        columnTitle: this.translate.instant('module.users.columns.actions'),
        add: true,
        edit: false,
        delete: true,
        position: 'right',
        custom: [
          {
            name: 'show',
            title: '<i class="nb-search"></i>',
          }
        ],
      },
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        fullName: {
          title: this.translate.instant('module.users.columns.name'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.firstName,
        },
        email: {
          title: this.translate.instant('module.users.columns.email'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.email,
        },
        phone: {
          title: this.translate.instant('module.users.columns.phone'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.phone ? row.phone : this.translate.instant('module.users.columns.noDataMessage'),
        },
        groups: {
          title: this.translate.instant('module.users.columns.group'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.groups,
        },
        // company: {
        //   title: this.translate.instant('module.users.columns.company'),
        //   type: 'string',
        //   valuePrepareFunction: (cell, row) =>  row.company ? row.company : this.translate.instant('module.users.columns.noDataMessage'),
        // },
      },
    };
  }

  constructor(
    private userApiService: UserApiService,
    private router: Router,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private tokenService: NbTokenService,
    private http: HttpClient,
  ) {

    this.tokenService.get().subscribe((res: any) => {
      this.accessToken = res.token.access_token;
    });

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });

    this.source = new HeadersServerDataSource(this.http, this.headers, {
      dataKey: 'data.items',
      endPoint: this.userApiService.getBaseEndpoint(),
      pagerPageKey: 'page', // this should be page number param name in endpoint (request not response) for example 'page'
      pagerLimitKey: 'limit', // this should page size param name in endpoint (request not response)
      filterFieldKey: '#field#',
      totalKey: 'data.totalCount',
    });

    this.initTableSettings();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
      // every time the languages will change, we reload the settings
      this.initTableSettings();
    });
  }

  ngOnInit() {
    this.userApiService.getUsers().then((getUsers) => {
      getUsers.subscribe((users) => {
        this.users = users;
        this.source.load(users)
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddAction() {
    console.log('add User');
    this.router.navigate(['pages/users/new/']);
  }

  onDeleteAction($event, dialog: TemplateRef<any>) {
    console.log($event);
    this.dialogService.open(
      dialog,
      {
        context: this.translate.instant('messages.deleteModalText'),
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    ).onClose.subscribe((res) => {
      if (res) {
        this.userApiService.deleteUser($event.data.uuid).then((deleteUser) => {
          deleteUser.subscribe((res) => {
            this.source.remove($event.data);
            // this.source.refresh();

            this.makeToast('success', this.translate.instant('messages.deleteRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.deleteRecordMessage'));
          }, (err) => {
            this.makeToast('danger', this.translate.instant('messages.deleteRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.deleteRecordErrorMessage'));
          });
        })
      }

    });
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'show':
        this.router.navigate(['pages/users/show/' + event.data.uuid]);
        break;

      default:
        break;
    }
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `${title}` : '';

    this.toastrService.show(
      body,
      titleContent,
      config,
    );
  }

  makeToast(status: NbComponentStatus, title: string, content: string) {
    this.status = status;
    this.title = title;
    this.content = content;
    this.showToast(this.status, this.title, this.content);
  }

}
