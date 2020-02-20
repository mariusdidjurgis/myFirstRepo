import { Component, OnInit, DoCheck, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-planeta',
  templateUrl: './planeta.component.html',
  styleUrls: ['./planeta.component.css']
})
export class PlanetaComponent implements OnInit, DoCheck, OnChanges {

    @Input() Name: string;  
    public title: string = "Planet works";
    public model: any = {};
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

    onSubmit(){
        console.log('submit', this);
    }

}
