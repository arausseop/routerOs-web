import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, of, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbSelectComponent, NbSelectModule, NbDialogRef, NbComponentSize } from '@nebular/theme';

import { map } from 'rxjs/operators';
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
import { async } from '@angular/core/testing';

interface FieldImage {

  id: number,
  field: number,
  comment: string,
  imageDate: string,
  base64File: string,
  imagePath: string,
  imageType: number
}

interface IPaging {
  page: number;
  perPage: number;
}


@Component({
  selector: 'ngx-routers-settings-dialog',
  templateUrl: './routers-settings-dialog.component.html',
  styleUrls: ['./routers-settings-dialog.component.scss']
})
export class RoutersSettingsDialogComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() fieldId: any;

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  userDocTest = [];
  base64textString: any;

  fieldImageProducts: any = [];

  fieldSize: NbComponentSize = 'small';

  source: LocalDataSource = new LocalDataSource();

  fieldImage: FieldImage = {
    id: null,
    field: null,
    comment: '',
    imageDate: '',
    imagePath: '',
    base64File: '',
    imageType: null
  }
  fieldProductTypes = [];
  imageTypes = [];

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

  @ViewChild('autoInput') input;

  fieldImageNewType: FormGroup;
  fieldImageNewControl = true;

  constructor(private formBuilder: FormBuilder,
    protected ref: NbDialogRef<RoutersSettingsDialogComponent>,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
    });
  }

  ngOnInit() {
    this.fieldImage = {
      id: null,
      field: null,
      comment: '',
      imageDate: '',
      base64File: '',
      imagePath: '',
      imageType: null
    }

    this.fieldImageProducts = [];
    this.source.load(this.fieldImageProducts);

    this.fieldImageNewType = this.formBuilder.group({
      field: [this.fieldId],
      imageDate: ['', Validators.required],
      imageType: ['', Validators.required],
      comment: ['', Validators.required],
      imagePath: ['', Validators.required],
      base64File: [''],
    });
  }

  addFieldImageProduct() {
    let fieldProductSelected = _.find(this.imageTypes, { 'id': this.fieldImageNewType.get('fieldProduct').value });
    let fieldProductTypeSelected = _.find(this.fieldProductTypes, { 'id': this.fieldImageNewType.get('fieldProductType').value });
    console.log('fieldProductTypeSelected', fieldProductTypeSelected);

    this.source.add({
      fieldProduct: fieldProductSelected,
      fieldProductType: fieldProductTypeSelected,
      otherProduct: null,
      quantitySupplied: this.fieldImageNewType.get('fieldImageProductQuantity').value,
      supplayDate: this.fieldImageNewType.get('detailDate').value,
    });
    this.source.refresh();
    this.fieldImageNewType.get('fieldProduct').reset();
    this.fieldImageNewType.get('fieldProductType').reset();
    this.fieldImageNewType.get('fieldImageProductQuantity').reset();
    this.input.nativeElement.value = '';
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
        this.source.remove($event.data);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveForm() {

    // let fieldProductDetailToSave;
    this.fieldImage = this.fieldImageNewType.value;
    console.log(this.fieldImage);
  }

  closeUserFormDialog() {
    this.ref.close();
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
              this.fieldImageNewType.get('base64File').setValue(imgBase64Path);
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
