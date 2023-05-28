import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-routers-tab1',
  template: `
    <p>Early home automation began with labor-saving machines. Self-contained electric or gas powered
      <a target="_blank" href="https://en.wikipedia.org/wiki/Home_appliances">home appliances</a>
      became viable in the 1900s with the introduction of
      <a target="_blank" href="https://en.wikipedia.org/wiki/Electric_power_distribution">electric power distribution
      </a> and led to the introduction of washing machines (1904), water heaters (1889), refrigerators, sewing machines,
      dishwashers, and clothes dryers.
    </p>
  `,
})
export class RoutersTab1Component { }

@Component({
  selector: 'ngx-routers-tab2',
  template: `
    <p>Tab 2 works!</p>
  `,
})
export class RoutersTab2Component { }

@Component({
  selector: 'ngx-tabs',
  styleUrls: ['./routers-tabs.component.scss'],
  templateUrl: './routers-tabs.component.html',
})
export class RoutersTabsComponent implements OnInit {

  tabs: any[] = [
    {
      title: 'Route tab #1',
      route: '/pages/routers/tabs/tab1',
    },
    {
      title: 'Route tab #2',
      route: '/pages/routers/tabs/tab2',
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
