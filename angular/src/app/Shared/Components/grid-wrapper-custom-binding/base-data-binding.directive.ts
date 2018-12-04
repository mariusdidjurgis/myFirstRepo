import { Component, Input, ViewChild, Directive, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, NgForm, ControlContainer, FormsModule, FormBuilder  } from "@angular/forms";
import { DataBindingDirective, GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { GridDatasourceService } from "../../Services/gridDatasource.service";
import { State } from "@progress/kendo-data-query";
import { Observable, Subscription } from "rxjs";

@Directive({
    selector: '[baseDataBinding]'
})
export class BaseDataBindingDirective extends DataBindingDirective implements OnInit, OnDestroy {

    @Input() baseDataBinding: GridDatasourceService;
    private serviceSubscription: Subscription;

    constructor(private dataSource: GridDatasourceService, grid: GridComponent) {
        super(grid);

        console.log('baseDataBinding ', this)
    }

    public ngOnInit(): void {
        this.serviceSubscription = this.dataSource.subscribe((result) => {
            this.grid.loading = false;
            this.grid.data = result;
            this.notifyDataChange();
        });

        super.ngOnInit();

        this.rebind();
    }

    public ngOnDestroy(): void {
        if (this.serviceSubscription) {
            this.serviceSubscription.unsubscribe();
        }

        super.ngOnDestroy();
    }

    public rebind(): void {
        this.grid.loading = true;

        this.dataSource.query(this.state);
    }
}
