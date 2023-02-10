import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private storageSub = new Subject<string>();

    constructor(){
    }
      
    watchStorage(): Observable<string> {
        return this.storageSub.asObservable();
    }

    set<T>(object: T, key:string){
        localStorage.setItem(key, JSON.stringify(object));        
        this.storageSub.next('added' + key);
    }

    get<T>(key:string){
        
        return <T>(JSON.parse(localStorage.getItem(key) || 'null'));
    }

    getJson(key:string){
        return localStorage.getItem(key);
    }

    remove(key: string){        
        localStorage.removeItem(key);
        this.storageSub.next('removed' + key);
    }
    
}