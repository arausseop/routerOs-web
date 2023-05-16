import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `<div>
    <span>Developed by</span>&nbsp;<a href="https://www.carlos.com" target="_blank"><img alt="carlos.com" src="../../assets/images/carlos-logo-blanco.png" style="height: 15px; margin-right: 5px;" border="0"></a>
    <span>for</span>&nbsp;
    <a href="https://www.test.com.cl" target="_blank"><img alt="TESTLOGO" style="height: 25px; vertical-align: text-bottom;" src="../../assets/images/testLogoBlancoBold.png"></a>
  </div>
  `,
})
export class FooterComponent {
}
