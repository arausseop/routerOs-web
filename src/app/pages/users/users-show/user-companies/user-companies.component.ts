import { Component, OnInit, OnDestroy, TemplateRef, Input } from '@angular/core';

import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { UserCompanyData, UserCompany } from '../../../../@core/data/user-company-data';
import { UserCompanyService } from '../../../../@core/mock/user-company.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbComponentStatus, NbToastrService, NbDialogService } from '@nebular/theme';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HeadersServerDataSource } from '../../../../helpers/headers-server-datasource';
import { NbTokenService } from '../../../../auth/services/token/token.service';

interface IPaging {
  page: number;
  perPage: number;
}

@Component({
  selector: 'ngx-user-companies',
  templateUrl: './user-companies.component.html',
  styleUrls: ['./user-companies.component.scss']
})
export class UserCompaniesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  source: HeadersServerDataSource;
  headers: HttpHeaders;
  accessToken: string;
  // source: LocalDataSource = new LocalDataSource();

  @Input() userId: string;

  config: NbToastrConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = false;

  status: NbComponentStatus = 'primary';
  title = '';
  content = '';
  companies: any = [];

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
        columnTitle: this.translate.instant('module.fields.columns.actions'),
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
        companyName: {
          title: this.translate.instant('module.companies.columns.name'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.company.name,
        },
        cuit: {
          title: this.translate.instant('module.companies.columns.cuit'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.company.cuit,
        },
        contactName: {
          title: this.translate.instant('module.companies.columns.contactName'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.company.contactName ? `${row.company.contactName} ${row.company.contactLastName}` : 'No Asignado',
        },
        contactEmail: {
          title: this.translate.instant('module.companies.columns.contactEmail'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.company.contactEmail,
        },
        contactPhone: {
          title: this.translate.instant('module.companies.columns.contactPhone'),
          type: 'string',
          valuePrepareFunction: (cell, row) => row.company.contactPhone,
        },
      },
    };
  }

  userCompanyNewType: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userCompanyService: UserCompanyService,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,

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
  }

  ngOnInit() {
    // this.companies=[];
    // this.userCompanyService.getUserCompanies(null, this.userId).then((getUserCompanies) => {
    //   getUserCompanies.subscribe( userCompanies => this.source.load(userCompanies));
    // });

    this.source = new HeadersServerDataSource(this.http, this.headers, {
      dataKey: 'data.items',
      endPoint: this.userCompanyService.getBaseEndpoint(),
      pagerPageKey: 'page', // this should be page number param name in endpoint (request not response) for example 'page'
      pagerLimitKey: 'limit', // this should page size param name in endpoint (request not response)
      filterFieldKey: '#field#',
      totalKey: 'data.totalCount',
    }, { user: this.userId });



    this.userCompanyNewType = this.formBuilder.group({
      company: ['', Validators.required],
      user: [this.userId, Validators.required],
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'show':
        this.router.navigate(['pages/companies/show/' + event.data.id]);
        break;
      case 'edit':
        break;
      case 'fields':
        break;
      default:
        break;
    }
  }

  onAddAction(dialog: TemplateRef<any>): void {
    this.dialogService.open(
      dialog,
      {
        context: this.translate.instant('messages.deleteModalText'),
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    ).onClose.subscribe((res) => {
      // if(res){
      //   this.userCompanyService.deleteUserCompany($event.data.id).then( (deleteUserCompany) => {
      //     deleteUserCompany.subscribe( ( res ) => {            
      //       this.source.remove($event.data);

      //       this.makeToast('success', this.translate.instant('messages.deleteRecordMessageTitle', {value: this.translate.instant('module.companies.singularNameModule')}), this.translate.instant('messages.deleteRecordMessage'));
      //     }, (err) => {
      //       this.makeToast('danger', this.translate.instant('messages.deleteRecordMessageTitle', {value: this.translate.instant('module.companies.singularNameModule')}), this.translate.instant('messages.deleteRecordErrorMessage'));
      //     });
      //   })
      // }

    });
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
        this.userCompanyService.deleteUserCompany($event.data.id).then((deleteUserCompany) => {
          deleteUserCompany.subscribe((res) => {
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
    console.log('this.userCompanyNewType.value', this.userCompanyNewType.value);
    const data = this.userCompanyNewType.value
    // this.user.groups = [this.userEditType.get('groups').value];
    // let data = _.pick(this.userCompanyNewType.value,['email','username','firstName','lastName','company', 'phone', 'groups']);
    // data.groups = this.user.groups
    // data.username = this.userEditType.get('email').value;


    this.userCompanyService.newUserCompany(data).then((newUserCompany) => {
      newUserCompany.subscribe((userCompany) => {
        this.source.add(userCompany);
        this.source.refresh();

        dialog.close();
        this.makeToast('success', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.editedRecordMessage'));

      }, (err) => {
        this.makeToast('danger', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.editedRecordErrorMessage'));
      });
    });

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
