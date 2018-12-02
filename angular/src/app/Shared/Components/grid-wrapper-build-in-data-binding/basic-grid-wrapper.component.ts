import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { FormGroup, NgForm, ControlContainer, FormsModule, FormBuilder  } from "@angular/forms";
import { DataBindingDirective, GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { GridDatasourceService } from "../../Services/gridDatasource.service";
import { process, State } from "@progress/kendo-data-query";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { ApiService } from "../../Services/api.service";
import { toODataString } from '@progress/kendo-data-query';
import { shareReplay, map, tap } from 'rxjs/operators';

@Component({
    selector: "basic-grid-wrapper",
    templateUrl: './basic-grid-wrapper.component.html',
    viewProviders: [ 
        { provide: ControlContainer, useExisting: NgForm }
     ]
  })
export class BasicGridWrapperComponent implements OnInit{

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

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private apiService: ApiService){
        
        this.createFormGroup = this.createFormGroup.bind(this);
        if(this.settings){
            Object.assign(this.kSettings, this.settings);
        }
    }

    ngOnInit(): void {
             
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