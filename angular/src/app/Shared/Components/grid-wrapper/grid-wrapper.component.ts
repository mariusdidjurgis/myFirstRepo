import { Component, Input } from "@angular/core";
import { FormGroup, NgForm, ControlContainer } from "@angular/forms";
import { DataBindingDirective } from "@progress/kendo-angular-grid";

@Component({
    selector: "grid-wrapper",
    templateUrl: './grid-wrapper.component.html',
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
  })
export class GridWrapperComponent {

    @Input() columns: any;
    @Input() data: Array<any>;
    @Input() settings: any;
    private kSettings: any = {
        pageSize: 10,
        pageable: true,
        sortable: true,
        filterable: true,
        groupable: false,
        height: 500
    }

    constructor(){
        if(this.settings){
            Object.assign(this.kSettings, this.settings);
        }
        
        console.log(this);
    }
}