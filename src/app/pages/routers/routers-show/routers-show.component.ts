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
  selector: 'ngx-routers-show',
  templateUrl: './routers-show.component.html',
  styleUrls: ['./routers-show.component.scss']
})
export class RoutersShowComponent implements OnInit, OnDestroy {
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

  routerEditType: FormGroup;
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

    this.routerEditType = this.formBuilder.group({
      identity: [{ value: null, disabled: true }],
      ipAddress: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
      login: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
      password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
      name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
      description: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
      connect: [{ value: false, disabled: true }],
    });


    this.activatedRoute.params.subscribe(params => {
      this.routerId = params['id'];
      this.routersService.getRouter(this.routerId).then((getRouter) => {
        getRouter.subscribe(router => {
          this.mikroRouter = router;

          this.routerEditType = this.formBuilder.group({
            identity: [{ value: this.mikroRouter.identity, disabled: true }],
            ipAddress: [{ value: this.mikroRouter.ipAddress, disabled: true }, [Validators.required, Validators.maxLength(20)]],
            login: [{ value: this.mikroRouter.login, disabled: true }, [Validators.required, Validators.maxLength(100)]],
            password: [{ value: this.mikroRouter.password, disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
            name: [{ value: this.mikroRouter.name, disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
            description: [{ value: this.mikroRouter.description, disabled: true }, [Validators.required, Validators.maxLength(100)]],
            connect: [{ value: this.mikroRouter.connect, disabled: true }]
          });
        });
      });
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  routerEdit() {
    console.log(this.mikroRouter);
    this.routerEditControl = this.routerEditControl ? false : true;
    this.routerEditControl ? this.routerEditType.enable() : this.routerEditType.disable();
  }

  routerCancel() {
    if (!this.routerEditType.pristine) {
      this.routerEditType.setValue({
        identity: this.mikroRouter.identity,
        ipAddress: this.mikroRouter.ipAddress,
        login: this.mikroRouter.login,
        password: this.mikroRouter.password,
        name: this.mikroRouter.name,
        description: this.mikroRouter.description,
        connect: this.mikroRouter.connect
      });

      this.routerEditType.markAsPristine()
      this.routerEdit();
    } else {
      this.routerEdit();
    }

  }

  saveForm() {

    let data = _.pick(this.routerEditType.value, ['ipAddress', 'login', 'password', 'name', 'description']);

    console.log(data);
    this.routersService.editRouter(this.routerId, data).then((editRouter) => {
      editRouter.subscribe((router) => {
        this.routerEdit();
        this.router = router;
        this.routerEditType.markAsPristine()
        this.makeToast('success', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.routers.singularNameModule') }), this.translate.instant('messages.editedRecordMessage'));

      }, (err) => {
        this.makeToast('danger', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.routers.singularNameModule') }), this.translate.instant('messages.editedRecordErrorMessage'));
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
