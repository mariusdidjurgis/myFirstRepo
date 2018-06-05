import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit{

    private title: string = "Home works";
    constructor(private changeDetectorRef: ChangeDetectorRef) { 
        console.log(this);
    }

    ngOnInit() {

    }

}
