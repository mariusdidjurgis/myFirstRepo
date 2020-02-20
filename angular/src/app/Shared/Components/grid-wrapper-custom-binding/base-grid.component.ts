import { Component, Input, ViewChild, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, NgForm, ControlContainer, FormsModule, FormBuilder, FormControl, Validators  } from "@angular/forms";
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
    public kSettings: any = {
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
    private editedRowIndex: number;

    @Output() cellClose = new EventEmitter<any>();
    @Output() dataChange = new EventEmitter<any>();

    constructor(private formBuilder: FormBuilder){
        this.createFormGroup = this.createFormGroup.bind(this);
        if(this.settings){
            Object.assign(this.kSettings, this.settings);
        }
        this.state.take = this.kSettings.pageSize;        
    }

    ngOnInit(): void {
        
    }

    public onStateChange(evt: any){
        
    }

    public onCellClick(evt: any){
        
    }

    public onCellClose(evt: any){
        const updatedHolding = evt.formGroup.value;
        this.cellClose.emit(evt);
        this.dataChange.emit(evt);
    }

    public removeHandler({ dataItem }): void {
        
    }

    public editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);

        this.formGroup = this.createFormGroupFromDataItem(dataItem);

        this.editedRowIndex = rowIndex;

        sender.editRow(rowIndex, this.formGroup);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    public saveHandler(evt: any){
        this.dataChange.emit(evt);
    }

    public createFormGroup(args: any): FormGroup {
        const item = args.isNew ? {} : args.dataItem;
        console.log('dataItem ', args.isNew, 'args ', args);

        let groupObject = {};
        for (let col of this.columns) {  
            if(col.editable || col.field == 'Id'){
                groupObject[col.field] = item[col.field];
            }
        }
        this.formGroup = this.formBuilder.group(groupObject);
        //this.formGroup.valueChanges.subscribe(evt => { this.dataChange.emit({ row: evt, grid: this.grid} ); });

        return this.formGroup;
    }

    public createFormGroupFromDataItem(dataItem: any): FormGroup {
        
        let fg = new FormGroup({});

        for (let col of this.columns) {  
            if(col.editable || col.field == 'Id'){
                fg.addControl(col.field, new FormControl(dataItem[col.field]));
            }
        }

        return fg;
    };
}