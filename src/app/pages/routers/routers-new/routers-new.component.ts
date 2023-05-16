import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { Routers } from '../../../@core/data/routers-data';
import { RoutersService } from '../../../@core/mock/routers.service';
import { RoleGroupService } from '../../../@core/mock/role-group.service';

import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbToastrConfig,
} from '@nebular/theme';
import * as _ from "lodash";
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-routers-new',
  templateUrl: './routers-new.component.html',
  styleUrls: ['./routers-new.component.scss']
})
export class RoutersNewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  routerDocTest = [];
  base64textString: any;

  fieldImageNewControl = true;

  routerId: string;
  mikroRouter: Routers = {
    uuid: null,
    identity: '',
    ipAddress: '',
    login: '',
    password: '',
    connect: true,
    name: '',
    description: null
  }

  roleGroups: any = [];
  routerRouters: any = [];
  routerActiveGroups = [];

  config: NbToastrConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = false;

  status: NbComponentStatus = 'primary';
  title = '';
  content = '';

  routerNewType: FormGroup;
  changePasswordType: FormGroup;
  routerEditControl = false;
  passwordEditControl = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routersService: RoutersService,
    private translate: TranslateService,
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
    });
  }

  ngOnInit() {

    this.mikroRouter = {
      uuid: null,
      identity: '',
      ipAddress: '',
      login: '',
      password: '',
      connect: true,
      name: '',
      description: null
    }

    this.routerNewType = this.formBuilder.group({

      ipAddress: ['', [Validators.required, Validators.maxLength(20)]],
      login: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  saveForm() {

    let data = _.pick(this.routerNewType.value, ['ipAddress', 'login', 'password', 'name', 'description']);

    this.routersService.newRouter(data).then((newRouter) => {
      newRouter.subscribe((router) => {
        this.makeToast('success', this.translate.instant('messages.createdRecordMessageTitle', { value: this.translate.instant('module.routers.singularNameModule') }), this.translate.instant('messages.createdRecordMessage'));

        this.router.navigate(['pages/routers/show/' + router.uuid]);
      }, (err) => {
        this.makeToast('danger', this.translate.instant('messages.createdRecordMessageTitle', { value: this.translate.instant('module.routers.singularNameModule') }), this.translate.instant('messages.createdRecordErrorMessage'));
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
