import { Component, OnInit, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from '../Shared/Services/products.service';
import { AddEvent, EditEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';

const formGroup = dataItem => new FormGroup({
    'Discontinued': new FormControl(dataItem.Discontinued),
    'ProductID': new FormControl(dataItem.ProductID),
    'ProductName': new FormControl(dataItem.ProductName, Validators.required),
    'UnitPrice': new FormControl(dataItem.UnitPrice),
    'UnitsInStock': new FormControl(dataItem.UnitsInStock, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')]))
});

const hasClass = (el, className) => new RegExp(className).test(el.className);

const isChildOf = (el, className) => {
    while (el && el.parentElement) {
        if (hasClass(el.parentElement, className)) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
};

@Component({
    selector: 'product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
    public formGroup: FormGroup;
    public groups: GroupDescriptor[] = [];
    public view: any[];
    @ViewChild(GridComponent) private grid: GridComponent;
    private editedRowIndex: number;
    private isNew = false;

    public get isInEditingMode(): boolean {
        return this.editedRowIndex !== undefined || this.isNew;
    }

    public groupChange(groups: GroupDescriptor[]): void {
        this.groups = groups;
        this.view = groupBy(this.service.products(), this.groups);
    }

    constructor(private service: ProductsService, private renderer: Renderer2) { }

    public ngOnInit(): void {
      this.view = this.service.products();
      this.renderer.listen(
          "document",
          "click",
          ({ target }) => {
              if (!isChildOf(target, "k-grid")) {
                  this.saveClick();
              }
          });
    }

    public addHandler({ sender }: AddEvent): void {
        this.closeEditor(sender);

        this.formGroup = formGroup({
            'Discontinued': false,
            'ProductName': "",
            'UnitPrice': 0,
            'UnitsInStock': ""
        });

        this.isNew = true;
        sender.addRow(this.formGroup);
    }

    public editHandler({ sender, colIndex, rowIndex, dataItem }: EditEvent): void {
        if (this.formGroup && !this.formGroup.valid) {
            return;
        }

        this.saveRow();
        this.formGroup = formGroup(dataItem);
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
        setTimeout(() => {
          console.log(colIndex);
          document.querySelector(`.k-grid-edit-row > td:nth-child(${colIndex + 1}) input`).focus();
        });
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
            this.service.save(this.formGroup.value, this.isNew);
        }

        this.closeEditor(this.grid);
    }
}
