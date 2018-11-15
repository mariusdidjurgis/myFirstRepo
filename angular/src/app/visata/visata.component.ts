import { ApiService } from './../Shared/Services/api.service';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GroupDescriptor, groupBy } from '@progress/kendo-data-query';
import { GridComponent, AddEvent, EditEvent } from '@progress/kendo-angular-grid';

@Component({
    selector: 'app-visata',
    templateUrl: './visata.component.html',
    styleUrls: ['./visata.component.css']
})
export class VisataComponent implements OnInit {

    public holdings: any[]; 
    public columns = [{
        field: "Pset",
        title: "Pset title"
    },{
        field: "Isin",
        title: "Isin title"
    },{
        field: "TradeDate",
        title: "TradeDate title"
    },{
        field: "SettlementDate",
        title: "SettlementDate title"
    },{
        field: "TotalAmount",
        title: "TotalAmount title"
    },{
        field: "AvailableAmount",
        title: "AvailableAmount title"
    },{
        field: "Status",
        title: "Status title"
    },{
        field: "Valid",
        title: "Valid title"
    }]
    //@ViewChild(GridComponent) private grid: GridComponent;

    constructor(private api: ApiService, private renderer: Renderer2) {
        console.log(this);
     }

    public ngOnInit(): void {
        this.api.getHoldings().subscribe((x: any) => { this.holdings = x; });

        this.api.getHoldings().subscribe(x => {
            this.holdings = x;    
        });
    }
}
