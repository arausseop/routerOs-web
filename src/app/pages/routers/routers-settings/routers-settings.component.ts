import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
// import { Component } from '@angular/core';
import { NbIconConfig, NbWindowRef } from '@nebular/theme';

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

@Component({
  selector: 'ngx-routers-settings',
  templateUrl: './routers-settings.component.html',
  styleUrls: ['./routers-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class RoutersSettingsComponent implements OnInit, OnDestroy {
  // constructor(public windowRef: NbWindowRef) { }

  @Input() routerInfo: any;
  activeTab = false;
  bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'eva' };
  private destroy$: Subject<void> = new Subject<void>();

  config: NbToastrConfig;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = false;

  status: NbComponentStatus = 'primary';
  title = '';
  content = '';

  constructor(
    public windowRef: NbWindowRef,
    private formBuilder: FormBuilder,
    // protected ref: NbDialogRef<RoutersSettingsComponent>,
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
    console.log('roiterInfo', this.routerInfo);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  close() {
    this.windowRef.close();
  }

  receivedOuputEvent($event) {
    this.activeTab = $event;
    console.log('ouputEvent', [$event])
  }
}
