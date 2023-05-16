import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { UserApiService } from '../../../@core/mock/user-api.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../../../@core/data/user-api-data';



import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbToastrConfig,
} from '@nebular/theme';

import * as _ from 'lodash';
import * as moment from 'moment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UserCompanyService } from '../../../@core/mock/user-company.service';
import { RoleGroupService } from '../../../@core/mock/role-group.service';

@Component({
  selector: 'ngx-users-new',
  templateUrl: './users-new.component.html',
  styleUrls: ['./users-new.component.scss']
})
export class UsersNewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();


  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  userDocTest = [];
  base64textString: any;

  fieldImageNewControl = true;

  user: User = {
    uuid: null,
    email: '',
    roles: [],
    roleGroups: [],
    firstName: '',
    lastName: '',
    dni: '',
    avatar: '',
    base64File: null,
    active: true,
    expiredAt: '',
    password: '',
  }

  roleGroups: any = [];
  routers: any = [];

  config: NbToastrConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = false;

  status: NbComponentStatus = 'primary';
  title = '';
  content = '';

  userNewType: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
    private userApiService: UserApiService,
    private roleGroupsService: RoleGroupService,
    private translate: TranslateService,
    private userCompanyService: UserCompanyService,
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
    });

    this.roleGroupsService.getGroups().then((getGroups) => {
      getGroups.subscribe((groups) => {
        this.roleGroups = groups.items;
      });
    });
  }

  ngOnInit(): void {

    this.roleGroups = [];
    this.routers = [];
    this.user = {
      uuid: null,
      email: '',
      roleGroups: [],
      firstName: '',
      lastName: '',
      // userRouters: '',
      password: '',
      active: true,
      roles: [],
      dni: '',
      avatar: '',
      base64File: null,
      expiredAt: '',
    }



    this.userNewType = this.formBuilder.group({
      avatar: [''],
      base64File: [''],
      dni: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.maxLength(180), Validators.email]],
      roleGroups: ['', Validators.required],
      roles: [''],
      expiredAt: [''],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      // userRouters: [[]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
      active: [true]
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveForm() {
    this.user.roleGroups.push(this.userNewType.get('roleGroups').value);
    let data = _.pick(this.userNewType.value, ['email', 'firstName', 'lastName', /*'userRouters'*/, 'avatar', 'dni', 'expiredAt', 'base64File', 'password', 'roleGroups', 'active']);

    data.expiredAt = moment(data.expiredAt).format();
    console.log(this.user);
    // data.userRouters = _.map(this.userNewType.get('userRouters').value, (routerUuid) => {
    //   var userRouterObject = {
    //     user: null,
    //     router: RouterUuid
    //   }
    //   return userRouterObject;
    // });

    data.roleGroups = this.user.roleGroups;

    console.log('data', data);
    this.userApiService.newUser(data).then((newUser) => {
      newUser.subscribe((user) => {
        this.makeToast('success', this.translate.instant('messages.createdRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.createdRecordMessage'));

        this.router.navigate(['pages/users/show/' + user.uuid]);
      }, (err) => {
        this.makeToast('danger', this.translate.instant('messages.createdRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.createdRecordErrorMessage'));
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

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      console.log('entro');
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg', 'application/pdf'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        console.log('maxZise');
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }


      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        console.log('formato');
        return false;
      }

      const reader = new FileReader();
      if (fileInput.target.files[0].type !== 'application/pdf') {
        reader.onload = (e: any) => {
          console.log('fileReader');
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];

            console.log(img_height, img_width);

            if (img_height > max_height && img_width > max_width) {
              this.imageError =
                'Maximum dimentions allowed ' +
                max_height +
                '*' +
                max_width +
                'px';
              console.log('tamaño');
              return false;
            } else {
              const imgBase64Path = e.target.result;
              this.cardImageBase64 = imgBase64Path;
              this.isImageSaved = true;
              console.log('imgBase64Path', imgBase64Path);
              this.userNewType.get('base64File').setValue(imgBase64Path);
              this.userDocTest.push({
                fileName: fileInput.target.files[0].name,
                base64File: imgBase64Path,
              });
              // this.previewImagePath = imgBase64Path;
            }
          };
        };
      } else {
        reader.onload = (e: any) => {
          console.log('fileReader');
          // const image = new Image();
          let base64;
          // image.src = e.target.result;
          base64 = e.target.result;
          console.log('base64', base64);
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;
          this.userDocTest.push({
            fileName: fileInput.target.files[0].name,
            base64File: imgBase64Path,
          });
          console.log('imgBase64Path', imgBase64Path);

        };
      }

      console.log('salio');
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

}
