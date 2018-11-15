import { Component, Input } from "@angular/core";
import { FormGroup, NgForm, ControlContainer } from "@angular/forms";

@Component({
    selector: "grid-wrapper",
    templateUrl: './grid-wrapper.component.html',
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
  })
  export class GridWrapperComponent {

    @Input() columns: any;
    @Input() data: Array<any>;

    constructor(){
        console.log(this);
    }

  }