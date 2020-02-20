import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    public model: any = { name: 'theName' };
    
    public returnReplaySubject5(): Observable<{}> {
        const obj: ReplaySubject<{}> = new ReplaySubject<{}>();

        return obj;
    }

    public returnObservableFrom5(): Observable<{}> {

        return Observable.of({});
    }

    public returnBehaviourSubjectFrom5(): Observable<{}> {
        const obj: BehaviorSubject<number> = new BehaviorSubject<number>(123);

        return obj;
    }
}
