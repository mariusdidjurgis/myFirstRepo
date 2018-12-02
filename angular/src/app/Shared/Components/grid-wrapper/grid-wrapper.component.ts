import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { FormGroup, NgForm, ControlContainer, FormsModule, FormBuilder  } from "@angular/forms";
import { DataBindingDirective, GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { process, State, SortDescriptor } from "@progress/kendo-data-query";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { ApiService } from "../../Services/api.service";
import { toODataString } from '@progress/kendo-data-query';
import { shareReplay, map, tap } from 'rxjs/operators';

@Component({
    selector: "grid-wrapper",
    templateUrl: './grid-wrapper.component.html',
    viewProviders: [ 
        { provide: ControlContainer, useExisting: NgForm },
     ]
  })
export class GridWrapperComponent implements OnInit{

    @Input() columns: any;
    @Input() data: Array<any>;
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

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private apiService: ApiService){
        this.createFormGroup = this.createFormGroup.bind(this);
        if(this.settings){
            Object.assign(this.kSettings, this.settings);
        }
        this.state.take = this.kSettings.pageSize;
        console.log(' grid Wrapper ', this);
    }

    ngOnInit(): void {
        this.query();        
    }

    public onStateChange(evt: any){
        console.log('onStateChange', evt);
    }
    public onPageChange(evt: any){
        console.log('pageChange ', evt);
        Object.assign(this.state, evt);
        this.query();
    }
    public onSortChange(sort: SortDescriptor[]){
        if(sort && sort[0] && sort[0].dir){
            this.state.sort = sort;
        }else{
            this.state.sort.length = 0;
        }
        
        console.log('sortChange ', sort, ' state ', this.state);
        this.query();
    }
    public onCellClick(evt: any){
        console.log('onCellClick ', evt);
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

    public query(): void {
        this.createUrl();
        this.fetch().subscribe(response => {
            this.gridData = response;
        });
    }

    protected fetch(): Observable<GridDataResult> {
        this.loading = true;

        return this.apiService.getHoldingsWitParams(this.url).pipe(
            map(response => { 
                console.log('response ', response);
                    return (<GridDataResult>{
                    data: response['data'],
                    total: response['total']
                    //data: response['value'],
                    //total: parseInt(response['@odata.count'], 10)
                })
            }),
            tap(() => this.loading = false));
    }

    private createUrl(){
        const queryStr =`${toODataString(this.state)}&$count=true`;

        this.url = '?skip=' + this.state.skip +'&take=' + this.state.take;
        if(this.state.sort && this.state.sort.length > 0){
            this.url += '$sort=' + this.state.sort[0].field + ' ' + this.state.sort[0].dir;
        }
    }
}