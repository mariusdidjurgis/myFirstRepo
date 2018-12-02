import { Component, Input, ViewChild, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, NgForm, ControlContainer, FormsModule, FormBuilder  } from "@angular/forms";
import { DataBindingDirective, GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { process, State, SortDescriptor } from "@progress/kendo-data-query";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { ApiService } from "../../Services/api.service";
import { toODataString } from '@progress/kendo-data-query';
import { shareReplay, map, tap } from 'rxjs/operators';
import { GridDatasourceService } from "../../Services/gridDatasource.service";

@Component({
    selector: "base-grid",
    templateUrl: './base-grid.component.html',
    viewProviders: [ 
        { provide: ControlContainer, useExisting: NgForm },
     ]
  })
export class BaseGridComponent implements OnInit{

    @Input() columns: any;
    @Input() settings: any;
    @Input() BASE_URL: string = 'holding?fromAcc=123&toAcc=321';
    private kSettings: any = {
        pageSize: 10,
        pageable: true,
        //sortable: true,
        sortable: {
            allowUnsort: true,
            mode: 'single', // multiple ? 'multiple' : 'single'
            },
        filterable: true,
        groupable: false,
        navigable: true,
        height: 500
    }
    protected state: State = { skip: 0, take: 10, sort: new Array<SortDescriptor>() };
    private filter: any = {};
    private url: string = '';
    public loading: boolean = false;
    public formGroup: FormGroup;
    @ViewChild(GridComponent) private grid;
    public gridData: GridDataResult = { data: [], total: 0};

    @Output() cellClose = new EventEmitter<any>();

    constructor(private formBuilder: FormBuilder){
        this.createFormGroup = this.createFormGroup.bind(this);
        if(this.settings){
            Object.assign(this.kSettings, this.settings);
        }
        this.state.take = this.kSettings.pageSize;

        console.log(' BaseGrid ', this);
    }

    ngOnInit(): void {
               
    }

    public onStateChange(evt: any){
        console.log('onStateChange ', evt)
    }
    public onCellClick(evt: any){
        console.log('onCellClick ', evt);
    }
    public onCellClose(evt: any){
        this.cellClose.emit(evt);
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