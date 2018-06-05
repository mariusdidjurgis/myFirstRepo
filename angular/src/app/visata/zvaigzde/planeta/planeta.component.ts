import { Component, OnInit, DoCheck, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-planeta',
  templateUrl: './planeta.component.html',
  styleUrls: ['./planeta.component.css']
})
export class PlanetaComponent implements OnInit, DoCheck, OnChanges {

    @Input() Name: string;  
    private title: string = "Planet works";
    constructor() { 

    }

    ngOnInit() {

    }

    ngDoCheck(): void {
        console.log('ngDoCheck');
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges ', changes);
    }

}
