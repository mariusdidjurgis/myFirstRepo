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
        title: "Pset title",
        type: 'text'
    },{
        field: "Isin",
        title: "Isin title",
        type: 'text'
    },{
        field: "TradeDate",
        title: "TradeDate title",
        type: 'date'
    },{
        field: "SettlementDate",
        title: "SettlementDate title",
        type: 'date'
    },{
        field: "TotalAmount",
        title: "TotalAmount title",
        type: 'numeric'
    },{
        field: "AvailableAmount",
        title: "AvailableAmount title",
        type: 'numeric'
    },{
        field: "Status",
        title: "Status title",
        type: 'text'
    },{
        field: "Valid",
        title: "Valid title",
        type: 'boolean'
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
