import { Component, OnInit, OnDestroy, TemplateRef, Input, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';


import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbComponentStatus, NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';

import { HeadersServerDataSource } from '../../../../../../helpers/headers-server-datasource';
import { NbTokenService } from '../../../../../../auth/services/token/token.service';
import { RoutersService } from '../../../../../../@core/mock/routers.service';
import { RoutersSettingsService } from '../../../../../../@core/mock/routers-settings.service';


interface IPaging {
  page: number;
  perPage: number;
}

@Component({
  selector: 'ngx-pools-list',
  templateUrl: './pools-list.component.html',
  styleUrls: ['./pools-list.component.scss']
})

export class PoolsListComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() holdingUuid: string;
  @Input() routerUuid: string;

  @Output() outputEvent = new EventEmitter<any>();

  source: any;
  headers: HttpHeaders;
  accessToken: string;

  config: NbToastrConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = false;

  sourceConnection: LocalDataSource = new LocalDataSource();
  status: NbComponentStatus = 'primary';
  title = '';
  content = '';
  companyBranches: any = [];

  dateNow = '';

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
        columnTitle: this.translate.instant('module.companies.columns.actions'),
        add: true,
        edit: false,
        delete: true,
        position: 'right',
        custom: [
          {
            name: 'show',
            title: '<i class="nb-search"></i>',
          },
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
          title: this.translate.instant('module.routersSettings.columns.name'),
          type: 'string',
          // valuePrepareFunction: (cell, row) => row.contactEmail ? `${row.company.contactName} ${row.company.contactLastName}` : 'No Asignado',
          valuePrepareFunction: (cell, row) => row.name,
        },
        rangeFrom: {
          title: this.translate.instant('module.routersSettings.columns.range.from'),
          type: 'string',
          // valuePrepareFunction: (cell, row) => row.contactEmail ? `${row.company.contactName} ${row.company.contactLastName}` : 'No Asignado',
          valuePrepareFunction: (cell, row) => (row.ranges.split('-'))[0],
        },
        rangeTo: {
          title: this.translate.instant('module.routersSettings.columns.range.to'),
          type: 'string',
          // valuePrepareFunction: (cell, row) => row.contactEmail ? `${row.company.contactName} ${row.company.contactLastName}` : 'No Asignado',
          valuePrepareFunction: (cell, row) => (row.ranges.split('-'))[1],
        }

      },
    };
  }

  customerCompaniesNewType: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private riuterService: RoutersService,
    private routerSettingService: RoutersSettingsService,
    private tokenService: NbTokenService,
  ) {

    this.tokenService.get().subscribe((res: any) => {
      this.accessToken = res.token.access_token;
    });

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });

    this.initTableSettings();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
      // every time the languages will change, we reload the settings
      this.initTableSettings();
    });

    // this.source = new LocalDataSource();
    // this.source.empty();

  }

  ngOnInit() {
    this.confExternalTableSourceRequest(this.routerUuid);
    // this.customerCompaniesNewType = this.formBuilder.group({
    //   logo: [''],
    //   base64File: [''],
    //   name: ['', [Validators.required, Validators.minLength(5)]],
    //   active: [false],
    //   contactPerson: ['', Validators.required],
    //   contactEmail: ['', [Validators.required, Validators.email]],
    //   contactPhone: [''],
    //   expiredAt: [''],
    //   customer: [''],
    // });
  }

  confExternalTableSourceRequest(routerUuid: string = null) {


    if (!routerUuid) {
      this.source = new HeadersServerDataSource(this.http, this.headers, {
        dataKey: 'data.items',
        endPoint: this.routerSettingService.getBaseEndpoint() + '/ip/pool',
        pagerPageKey: 'page', // this should be page number param name in endpoint (request not response) for example 'page'
        pagerLimitKey: 'limit', // this should page size param name in endpoint (request not response)
        filterFieldKey: '#field#',
        totalKey: 'data.totalCount',
      });

    } else {
      this.source = new HeadersServerDataSource(this.http, this.headers, {
        dataKey: 'data.items',
        endPoint: this.routerSettingService.getBaseEndpoint() + '/ip/pools',
        pagerPageKey: 'page', // this should be page number param name in endpoint (request not response) for example 'page'
        pagerLimitKey: 'limit', // this should page size param name in endpoint (request not response)
        filterFieldKey: '#field#',
        totalKey: 'data.totalCount',
      }, {
        routerUuid: routerUuid ?? ''
      });
    }

    this.outputEvent.emit(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCustomAction(event): void {
    console.log('object', event);

    switch (event.action) {
      case 'show':
        this.router.navigate(['pages/companies/show/' + event.data.uuid]);
        // this.onCustomCompaniesAction(event);
        break;
      case 'edit':
        break;
      case 'fields':
        break;
      default:
        break;
    }
  }

  onAddAction(): void {

    // const params = {
    //   id: null,
    //   customerCompanies: this.customerCompaniesNewType,
    //   action: 'new',
    //   customer: this.currentDbCustomer
    // };
    // this.openCustomerCompaniesModal(CompaniessNewComponent, params, null);
    this.router.navigate(['pages/companies/new']);
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
        this.routerSettingService.deleteRouterSetting('ip/pool', $event.data.uuid, { routerUuid: this.routerUuid }).then((deleteCompanyDocument) => {
          deleteCompanyDocument.subscribe((res) => {
            this.source.remove($event.data);

            this.makeToast('success', this.translate.instant('messages.deleteRecordMessageTitle', { value: this.translate.instant('module.companies.singularNameModule') }), this.translate.instant('messages.deleteRecordMessage'));
          }, (err) => {
            this.makeToast('danger', this.translate.instant('messages.deleteRecordMessageTitle', { value: this.translate.instant('module.companies.singularNameModule') }), this.translate.instant('messages.deleteRecordErrorMessage'));
          });
        })
      }

    });
  }

  saveForm(dialog) {
    // console.log('this.customerCompaniesNewType.value', this.customerCompaniesNewType.value);
    // const data = this.customerCompaniesNewType.value
    // // this.user.groups = [this.userEditType.get('groups').value];
    // // let data = _.pick(this.customerCompaniesNewType.value,['email','username','firstName','lastName','company', 'phone', 'groups']);
    // // data.groups = this.user.groups
    // // data.username = this.userEditType.get('email').value;
    // console.log('data', data);
    // data.customer = this.customerId;
    // this.companyDocumentService.newCompanyDocument(data, { customerUuid: this.customerId }).then((newCompanyDocument) => {
    //   newCompanyDocument.subscribe((companyDocument) => {
    //     this.source.add(companyDocument);
    //     this.source.refresh();

    //     dialog.close();
    //     this.makeToast('success', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.editedRecordMessage'));

    //   }, (err) => {
    //     this.makeToast('danger', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.editedRecordErrorMessage'));
    //   });
    // });

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

  inputDateChange($event) {
    this.dateNow = moment($event).format()
  }

  cancel(dialog) {
    console.log(dialog);
    dialog.TemplateRef.close();
    // dialog.dismiss();
    // this.ref.close(null);
  }
}