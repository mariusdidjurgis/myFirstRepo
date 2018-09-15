import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, OnChanges, SimpleChanges, HostListener, ViewContainerRef, ComponentFactoryResolver, Compiler, Injector, NgModuleRef, NgModule, ViewChild, ComponentRef } from '@angular/core';
import { AlertComponent } from '../Shared/Components/allert.component';
import { Customer, Person } from '../Shared/Types/customer';

@Console('hello custom decorator')
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit{

    private title: string = "Home works";
    private dynMessage: string = "some kind of message";
    @ViewChild("dynamicContainer", { read: ViewContainerRef }) container;
    
    constructor(private changeDetectorRef: ChangeDetectorRef, private resolver: ComponentFactoryResolver) {

        let c = new Customer();
        c.Name = "Albert";
        let c2 = new Customer(c);
        let c3 = new Customer({ Name: "Jonas"});
        let p1 = new Person({ Name: "Smith"} as Person);
        let c4 = new Customer(p1);
        
    }

    ngOnInit() {

    }

    testDynamicComponent(message: string){
        //this.container.clear(); //you can clear previous attached components
        let componentFactory = this.resolver.resolveComponentFactory(AlertComponent);
        let dynamicComponent = this.container.createComponent(componentFactory);
        dynamicComponent.instance.type = message;
    }

    ngOnDestroy() {
        this.container.destroy(); 
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
