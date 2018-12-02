import { Guid } from '../Types/guid';
import { Component, Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map, tap } from 'rxjs/operators';
import 'rxjs/Rx';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Holding, Account } from '../Types/holding';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ApiService } from './api.service';
import { toODataString } from '@progress/kendo-data-query';

export abstract class NorthwindService extends BehaviorSubject<GridDataResult> {
    public loading: boolean;
    private BASE_URL = 'https://odatasampleservices.azurewebsites.net/V4/Northwind/Northwind.svc/';

    constructor(
        private http: HttpClient,
        protected apiService: ApiService,
        protected url: string       
    ) {
        super(null);
        this.BASE_URL = url;
    }

    public query(state: any): void {
        this.fetch(state).subscribe(x => super.next(x));
    }

    protected fetch(state: any): Observable<GridDataResult> {
        const queryStr =`${toODataString(state)}&$count=true`;
        this.loading = true;
        console.log('fetch ', state, 'toODaytaString ', queryStr, 'this ', this);

        return this.apiService.getHoldingsWithOdataParams(`${this.BASE_URL}${queryStr}`).pipe(
            map(response => { 
                console.log('response ', response);
                    return (<GridDataResult>{
                    data: response['data'],
                    total: response['total']
                    //data: response['value'],
                    //total: parseInt(response['@odata.count'], 10)
                })
            }),
            tap(() => this.loading = false));

        // return this.http
        //     .get(`${this.BASE_URL}${tableName}?${queryStr}`)
        //     .pipe(
        //         map(response => (<GridDataResult>{
        //             data: response['value'],
        //             total: parseInt(response['@odata.count'], 10)
        //         })),
        //         tap(() => this.loading = false)
        //     );
    }
}

@Injectable()
export class GridDatasourceService extends NorthwindService{

    constructor(http: HttpClient, protected apiService: ApiService) {
        super(http, apiService, "getHoldings");

        //let tmpUrl = this.url || "getHoldings";  @Inject('url') @Optional() public url?: string
        console.log(this.url, ' dataSourceService ', this);
    }

    queryAll(st?: any): Observable<GridDataResult> {
        const state = Object.assign({}, st);
        delete state.skip;
        delete state.take;

        return this.fetch(state);
    }

}

