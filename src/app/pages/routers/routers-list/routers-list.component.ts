import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { UserApiService } from '../../../@core/mock/user-api.service';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NbDialogService, NbComponentStatus, NbToastrConfig, NbGlobalPosition, NbGlobalPhysicalPosition, NbToastrService, NbWindowService } from '@nebular/theme';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HeadersServerDataSource } from '../../../helpers/headers-server-datasource';
import { NbTokenService } from '../../../auth/services/token/token.service';
import { RoutersService } from '../../../@core/mock/routers.service';
import { Routers } from '../../../@core/data/routers-data';
import { RoutersSettingsComponent } from './routers-settings/routers-settings.component';
import { RoutersSettingsDialogComponent } from './routers-settings-dialog/routers-settings-dialog.component';


interface IPaging {
  page: number;
  perPage: number;
}

@Component({
  selector: 'ngx-routers-list',
  templateUrl: './routers-list.component.html',
  styleUrls: ['./routers-list.component.scss']
})
export class RoutersListComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() companyId: string;
  @ViewChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef, static: true }) disabledEscTemplate: TemplateRef<HTMLElement>;

  routers: Routers[] = [];

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
        columnTitle: this.translate.instant('module.routers.columns.actions'),
        add: true,
        edit: false,
        delete: true,
        position: 'right',
        custom: [
          {
            name: 'show',
            title: '<i class="nb-search"></i>',
          },
          {
            name: 'settings',
            title: '<i class="nb-gear"></i>',
            // title: '<img src="../../../../assets/images/clock-outline.svg" class="clock-action">',
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
        name: {
          title: this.translate.instant('module.routers.columns.name'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.name,
        },
        ipAddress: {
          title: this.translate.instant('module.routers.columns.ipAddress'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.ipAddress,
        },
        identity: {
          title: this.translate.instant('module.routers.columns.identity'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.identity,
        },
        login: {
          title: this.translate.instant('module.routers.columns.login'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.login,
        },
      },
    };
  }

  constructor(
    private routersService: RoutersService,
    private router: Router,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private tokenService: NbTokenService,
    private http: HttpClient,
    private windowService: NbWindowService
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
      endPoint: this.routersService.getBaseEndpoint(),
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
    this.routersService.getRouters().then((getRouters) => {
      getRouters.subscribe((routers) => {
        this.routers = routers;
        this.source.load(routers)
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddAction() {
    console.log('add User');
    this.router.navigate(['pages/routers/new/']);
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
        this.routersService.deleteRouter($event.data.uuid).then((deleteRouter) => {
          deleteRouter.subscribe((res) => {
            this.source.remove($event.data);
            // this.source.refresh();

            this.makeToast('success', this.translate.instant('messages.deleteRecordMessageTitle', { value: this.translate.instant('module.routers.singularNameModule') }), this.translate.instant('messages.deleteRecordMessage'));
          }, (err) => {
            this.makeToast('danger', this.translate.instant('messages.deleteRecordMessageTitle', { value: this.translate.instant('module.routers.singularNameModule') }), this.translate.instant('messages.deleteRecordErrorMessage'));
          });
        })
      }

    });
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'show':
        this.router.navigate(['pages/routers/show/' + event.data.uuid]);
        break;

      case 'settings':
        let context: any = {
          routerId: event.data.id,
          actionModal: 'settings',
        }
        this.openRutersSettingsForm(event);
        // this.openRoutersSettingsDialogForm(RoutersSettingsDialogComponent, context, event);

        break;
      default:
        break;
    }
  }

  openRutersSettingsForm(event) {
    this.windowService.open(RoutersSettingsComponent, {
      title: `Window`,
      hasBackdrop: false,
      closeOnEsc: false,
    });
  }

  openRoutersSettingsDialogForm(component, context, event = null) {
    console.log('event', event);

    this.windowService.open(
      this.disabledEscTemplate,
      {
        title: 'Window without backdrop',
        hasBackdrop: false,
        closeOnEsc: false,
      },
    );
    // this.dialogService.open(component, {

    //   closeOnBackdropClick: false,
    //   closeOnEsc: false,
    //   dialogClass: 'model-full',
    //   hasScroll: false,
    //   context: context
    // })
    //   .onClose.subscribe((data) => {
    //     // if(data && context.actionModal === "new"){
    //     //   console.log('data', data);

    //     //   this.source.add(data);
    //     //   this.source.refresh();
    //     //   // Agregar a la table el objeto recibido
    //     // }else if(data && context.actionModal === "show"){
    //     //   console.log('editttttt', data);
    //     //   console.log('eventEdited', event);
    //     //   this.source.update(event.data, data );
    //     //   console.log('event',event);
    //     // }
    //   });
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
