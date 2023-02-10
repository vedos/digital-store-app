import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RawgGame, RawgPlatform, Search } from '../models';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RawgService {

  constructor(private http: HttpClient) {}

  platforms(){
    return this.http.get<RawgPlatform>(`${environment.apiUrl}/platforms`)
  }

  games(search: Search){
    let queryParams = new HttpParams();
    
    if(search.platform != null)
      queryParams = queryParams.append('platforms',search.platform || '');
    
    if(search.search != null)
      queryParams = queryParams.append('search',search.search || '');

          
    if(search.page != null)
      queryParams = queryParams.append('page',search.page || '');

    //queryParams = queryParams.append('ordering','rating-released');

    return this.http.get<RawgGame>(`${environment.apiUrl}/games`, {params: queryParams})
  }
}
