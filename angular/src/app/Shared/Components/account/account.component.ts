import { Component, Input } from "@angular/core";
import { FormGroup, NgForm, ControlContainer } from "@angular/forms";

@Component({
    selector: "account",
    templateUrl: './account.component.html',
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
  })
  export class AccountComponent {

    @Input() account: any;
    @Input() testForm: FormGroup;

    constructor(){
        console.log(this);
    }

  }