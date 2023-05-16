import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { User } from '../../../@core/data/user-api-data';
import { UserApiService } from '../../../@core/mock/user-api.service';
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
  selector: 'ngx-users-show',
  templateUrl: './users-show.component.html',
  styleUrls: ['./users-show.component.scss']
})
export class UsersShowComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  userDocTest = [];
  base64textString: any;

  fieldImageNewControl = true;

  userId: string;
  user: User = {
    uuid: '',
    email: '',
    roles: [],
    roleGroups: [],
    firstName: '',
    lastName: '',
    dni: '',
    avatar: '',
    base64File: null,
    active: true,
    expiredAt: ''
  }

  roleGroups: any = [];
  userRouters: any = [];
  userActiveGroups = [];

  config: NbToastrConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = false;

  status: NbComponentStatus = 'primary';
  title = '';
  content = '';

  userEditType: FormGroup;
  changePasswordType: FormGroup;
  userEditControl = false;
  passwordEditControl = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userApiService: UserApiService,
    private roleGroupsService: RoleGroupService,

    private translate: TranslateService,
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
    });
  }

  ngOnInit() {

    this.roleGroups = [];
    this.userRouters = [];
    this.user = {
      uuid: null,
      email: '',
      roleGroups: [],
      firstName: '',
      lastName: '',
      // userRouters: '',
      active: true,
      roles: [],
      dni: '',
      avatar: '',
      base64File: null,
      expiredAt: '',
    }

    this.roleGroupsService.getGroups().then((getGroups) => {
      getGroups.subscribe((groups) => {
        this.roleGroups = groups.items
        console.log('this.roleGroups', this.roleGroups);
      });
    });

    this.userEditType = this.formBuilder.group({
      avatar: [{ value: null, disabled: true }],
      base64File: [{ value: null, disabled: true }],
      dni: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(180), Validators.email]],
      roleGroups: [{ value: '', disabled: true }, Validators.required],
      roles: [{ value: '', disabled: true }],
      expiredAt: [{ value: '', disabled: true }],
      firstName: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
      lastName: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
      // userRouters: [[]],
      password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
      active: [{ value: false, disabled: true }]
    });

    this.changePasswordType = this.formBuilder.group({
      password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
      confirmPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(180)]],
    }, { validator: this.checkPasswords });



    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      this.userApiService.getUser(this.userId).then((getUser) => {
        getUser.subscribe(user => {
          this.user = user;
          this.user.roleGroups = _.map(this.user.roleGroups, (roleGroup) => roleGroup.uuid);
          // console.log(user);
          this.userEditType = this.formBuilder.group({
            avatar: [{ value: null, disabled: true }],
            base64File: [{ value: null, disabled: true }],
            dni: [{ value: this.user.dni, disabled: true }, [Validators.required, Validators.maxLength(100)]],
            email: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.maxLength(180), Validators.email]],
            roleGroups: [{ value: this.user.roleGroups, disabled: true }, Validators.required],
            roles: [{ value: this.user.roles, disabled: true }],
            expiredAt: [{ value: this.user.expiredAt, disabled: true }],
            firstName: [{ value: this.user.firstName, disabled: true }, [Validators.required, Validators.maxLength(100)]],
            lastName: [{ value: this.user.lastName, disabled: true }, [Validators.required, Validators.maxLength(100)]],
            // userRouters: [[]],
            active: [{ value: this.user.active, disabled: true }]
          });

          this.userActiveGroups = _.map(this.user.roleGroups, (group) => group.uuid);
        });
      });
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  userEdit() {
    console.log(this.user);
    this.userEditControl = this.userEditControl ? false : true;
    this.userEditControl ? this.userEditType.enable() : this.userEditType.disable();
  }

  passwordEdit() {
    this.passwordEditControl = this.passwordEditControl ? false : true;
    this.passwordEditControl ? this.changePasswordType.enable() : this.changePasswordType.disable();
  }

  userCancel() {
    if (!this.userEditType.pristine) {
      this.userEditType.setValue({
        email: this.user.email,
        roleGroups: this.user.roleGroups,
        dni: this.user.dni,
        expiredAt: this.user.expiredAt,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        active: this.user.active
      });

      this.userEditType.markAsPristine()
      this.userEdit();
    } else {
      this.userEdit();
    }

  }

  passwordCancel() {
    if (!this.changePasswordType.pristine) {
      this.changePasswordType.setValue({
        password: '',
        confirmPassword: '',
      });
      this.changePasswordType.markAsPristine()
      this.passwordEdit();
    } else {
      this.passwordEdit();
    }
  }

  saveForm() {
    // const data = this.userEditType.value;
    this.user.roleGroups = [this.userEditType.get('roleGroups').value];
    let data = _.pick(this.userEditType.value, ['email', 'firstName', 'lastName', /*'userRouters'*/, 'avatar', 'dni', 'expiredAt', 'base64File', 'password', 'roleGroups', 'active']);
    data.roleGroups = this.user.roleGroups
    console.log(data);
    this.userApiService.editUser(this.userId, data).then((editUser) => {
      editUser.subscribe((user) => {
        this.userEdit();
        this.user = user;
        this.userEditType.markAsPristine()
        this.makeToast('success', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.editedRecordMessage'));

      }, (err) => {
        this.makeToast('danger', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.editedRecordErrorMessage'));
      });
    });

  }

  saveChangePassword() {
    let data = {
      plainPassword: {
        "first": this.changePasswordType.get('password').value,
        "second": this.changePasswordType.get('confirmPassword').value
      }
    }
    this.userApiService.changeUserPassword(this.userId, data).then((changePassword) => {
      changePassword.subscribe((result) => {
        this.changePasswordType.reset();
        this.passwordEdit();
        this.changePasswordType.markAsPristine()
        this.makeToast('success', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.editedPasswordMessage'));
      }, (err) => {
        this.makeToast('danger', this.translate.instant('messages.editedRecordMessageTitle', { value: this.translate.instant('module.users.singularNameModule') }), this.translate.instant('messages.editedRecordErrorMessage'));
      })
    })
    console.log(this.changePasswordType.value);
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

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;
    _.each(group.controls.password.errors, (key, error) => {
      console.log('error', [error, key]);
    });

    if (pass === confirmPass) {
      if (group.controls.confirmPassword.errors && group.controls.confirmPassword.errors.notSame) {
        group.controls.confirmPassword.setErrors(null);
      }
      if (group.controls.password.errors && group.controls.password.errors.notSame) {
        group.controls.password.setErrors(null);
      }
    } else {
      !group.controls.password.errors ? group.controls.password.setErrors({ notSame: true }) : group.controls.password.errors.notSame = true;
      !group.controls.confirmPassword.errors ? group.controls.confirmPassword.setErrors({ notSame: true }) : group.controls.confirmPassword.errors.notSame = true;
    }
    return pass === confirmPass ? null : { notSame: true };
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
              this.userEditType.get('base64File').setValue(imgBase64Path);
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

  checkGroupActive(groupUuid) {
    console.log(this.userActiveGroups);
    let groupActive = _.find(this.userActiveGroups, (activeGroup) => activeGroup === groupUuid);
    console.log('asdasd', groupActive ? true : false);
    return groupActive ? true : false;
  }
}
