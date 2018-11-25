import { Component, Input, ViewChild } from "@angular/core";
import { FormGroup, NgForm, ControlContainer, FormsModule, FormBuilder  } from "@angular/forms";
import { DataBindingDirective, GridComponent } from "@progress/kendo-angular-grid";

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
        navigable: true,
        height: 500
    }
    public formGroup: FormGroup;
    @ViewChild(GridComponent) private grid;
    
    constructor(private formBuilder: FormBuilder){
        this.createFormGroup = this.createFormGroup.bind(this);
        if(this.settings){
            Object.assign(this.kSettings, this.settings);
        }
        
        console.log(this);
    }

    public createFormGroup(args: any): FormGroup {
        const item = args.isNew ? {} : args.dataItem;

        let groupObject = {};
        for (let col of this.columns) {  
            if(col.editable){
                groupObject[col.field] = item[col.field];
            }
        }
        this.formGroup = this.formBuilder.group(groupObject);

        return this.formGroup;
    }
}