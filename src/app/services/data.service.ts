import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getWebsites(keywords, limit, offset): Observable<any> {
    return this.http.get(`/websites?keywords=${keywords}&limit=${limit}&offset=${offset}`).map(res => res.json());
  }

  getWebsitesCount(): Observable<any> {
    return this.http.get(`/websites/count`).map(res => res.json());
  }

  addWebsite(website): Observable<any> {
    return this.http.post('/website', JSON.stringify(website), this.options);
  }

  editWebsite(website): Observable<any> {
    return this.http.put(`/website/${website._id}`, JSON.stringify(website), this.options);
  }

  deleteWebsite(website): Observable<any> {
    return this.http.delete(`/website/${website._id}`, this.options);
  }

}
