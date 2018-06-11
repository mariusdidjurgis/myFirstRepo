import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, OnChanges, SimpleChanges, HostListener } from '@angular/core';

@Console('hello custom decorator')
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

    @HostListener('click', ['$event'])
    onHostClick(event: Event) {
        console.log('// clicked, `event` available ', event);
    }
}

function Console(message) : any {
    console.log('Our decorated class: ', message);
    return function(target: any){
        console.log('Our decorated class', target);
    }
  }
