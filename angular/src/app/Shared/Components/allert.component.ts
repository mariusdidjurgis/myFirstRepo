import { Component, Input } from "@angular/core";

@Component({
    selector: "alert",
    template: `
      <h1>Alert: {{type}}</h1>
    `,
  })
  export class AlertComponent {
    @Input() type: string = "success";
  }