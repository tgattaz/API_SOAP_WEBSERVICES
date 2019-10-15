import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";
import * as _ from 'lodash';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    HAL$:  Observable<any>;

    ARXIV$:  Observable<any>;

    checkHAL: Boolean;

    checkARXIV: Boolean;
    

    constructor(private http: HttpClient) {
        this.checkHAL=true;
        this.checkARXIV=true;
    }

    ngOnInit() {
    }


    SearchHAL(filter: string) {


        const headers = new HttpHeaders()
            .set("X-CustomHeader", "custom header value");

        const httpGet$ = this.http
            .get("http://api.archives-ouvertes.fr/search/?q="+filter+"&wt=json&fl=*", {headers})
            .map(data => _.values(data))
            .shareReplay();

        httpGet$.subscribe(
            (val) => console.log(val)
        );

        this.HAL$ = httpGet$;
        //this.ARXIV$ = null;

    }

    ParseString(data: string){
        var result;
        var parser = require('xml2js');
        parser.Parser().parseString(data, (e, r) => {result = r});
        return result;  
    }


    SearchARXIV(filter: string) {

        const my_headers = new HttpHeaders({ 'Content-Type': 'application/xml' }).set('Accept', 'application/xml');
        
        const options: {
            headers?: HttpHeaders,
            observe?: 'body',
            params?: HttpParams,
            reportProgress?: boolean,
            responseType: 'text',
            withCredentials?: boolean
        } = {
            headers: my_headers,
            responseType: 'text'
        };

        const httpGet$ = this.http
            .get("http://export.arxiv.org/api/query?search_query="+filter,options)
            .map(data => _.values(this.ParseString(data)))
            .shareReplay();

        httpGet$.subscribe(
            (val) => console.log(val)
        );

        this.ARXIV$ = httpGet$;
        //this.HAL$ = null;

        

        //this.result$ = httpGet$;

    }

}
