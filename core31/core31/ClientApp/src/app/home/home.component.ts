import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {


  public filter: Filter = new Filter();

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    console.log(this);
  }

  ngOnInit(): void {

  }
  

  public async test() {
    var filterJson = await this.http.get(this.baseUrl + 'weatherforecast/filter').toPromise();
      this.filter = new Filter(filterJson);
  }

}

class Filter {
    public name: string;
    public surname: string;
    public age: number;

    constructor(init?: Partial<Filter>) {
        Object.assign(this, init);
    }
}
