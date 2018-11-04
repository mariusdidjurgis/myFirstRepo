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

    public view: any[]; 
    public formGroup: FormGroup;
    public groups: GroupDescriptor[] = [];
    @ViewChild(GridComponent) private grid: GridComponent;
    private editedRowIndex: number;
    private isNew = false;

    public get isInEditingMode(): boolean {
        return this.editedRowIndex !== undefined || this.isNew;
    }

    public groupChange(groups: GroupDescriptor[]): void {
        this.groups = groups;
        this.view = groupBy(this.view, this.groups);
    }

    constructor(private api: ApiService, private renderer: Renderer2) {
        console.log(this);
     }

    public ngOnInit(): void {
        this.api.getHoldings().subscribe((x: any) => { this.view = x; });

      this.api.getHoldings().subscribe(x => {
        this.view = x;    
      });
    //   this.renderer.listen(
    //       "document",
    //       "click",
    //       ({ target }) => {
    //           if (!isChildOf(target, "k-grid")) {
    //               this.saveClick();
    //           }
    //       });
    }

    public addHandler({ sender }: AddEvent): void {
        this.closeEditor(sender);

        // this.formGroup = formGroup({
        //     'Discontinued': false,
        //     'ProductName': "",
        //     'UnitPrice': 0,
        //     'UnitsInStock': ""
        // });

        this.isNew = true;
        sender.addRow(this.formGroup);
    }

    public editHandler({ sender, colIndex, rowIndex, dataItem }: EditEvent): void {
        // if (this.formGroup && !this.formGroup.valid) {
        //     return;
        // }

        // this.saveRow();
        // this.formGroup = formGroup(dataItem);
        // this.editedRowIndex = rowIndex;
        // sender.editRow(rowIndex, this.formGroup);
        // setTimeout(() => {
        //   console.log(colIndex);
        //   document.querySelector(`.k-grid-edit-row > td:nth-child(${colIndex + 1}) input`).focus();
        // });
    }

    public cancelHandler(): void {
        this.closeEditor(this.grid, this.editedRowIndex);
    }

    public editClick({ dataItem, rowIndex, columnIndex }: any): void {
        this.editHandler({
            dataItem: dataItem,
            rowIndex: rowIndex,
            colIndex: columnIndex,
            sender: this.grid
        });
    }

    public saveClick(): void {
        if (this.formGroup && !this.formGroup.valid) {
            return;
        }

        this.saveRow();
    }

    private closeEditor(grid: GridComponent, rowIndex: number = this.editedRowIndex): void {
        this.isNew = false;
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    private saveRow(): void {
        if (this.isInEditingMode) {
            //this.api.save(this.formGroup.value, this.isNew);
        }

        this.closeEditor(this.grid);
    }
}
