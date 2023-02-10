import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private item = new BehaviorSubject<any>({});
  selectedItem = this.item.asObservable();
  constructor() {}

  setItem(item: any) {
    this.item.next(item);
  }
}