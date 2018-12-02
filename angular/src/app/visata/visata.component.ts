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
        field: "Message",
        title: "Message",
        type: 'text',
    },{
        field: "Pset",
        title: "Pset title",
        type: 'text',
        editable: true
    },{
        field: "Isin",
        title: "Isin title",
        type: 'text'
    },{
        field: "TradeDate",
        title: "TradeDate title",
        type: 'date',
        editable: true,
        format:'{0:yyyy-MM-dd}'
    },{
        field: "SettlementDate",
        title: "SettlementDate title",
        type: 'date',
        editable: true,
        format:'{0:MM/dd/yyyy HH:mm:ss}'
    },{
        field: "TotalAmount",
        title: "TotalAmount title",
        type: 'numeric',
        format: "{0:c}"
    },{
        field: "AvailableAmount",
        title: "AvailableAmount title",
        type: 'numeric',
        format: '{0:c}'
    },{
        field: "ToTransferAmount",
        title: "Transfer amount",
        type: 'numeric',
        editable: true
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
    }

    public onCellClose(evt: any){
        console.log('onCellClose ', evt.dataItem, ' evt ', evt);
    }
}
