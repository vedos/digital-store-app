import { Component } from '@angular/core';
import { ShareService } from 'src/helper';
import { Platform, Search } from 'src/models';
import { RawgService, StorageService } from 'src/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public platforms: Platform[];
  private navbarTags: string[];
  private storageService: StorageService<Platform[]>;
  search_param?: string;
  selected_nav?: number;

  constructor(
    private rawgService: RawgService,
    private shareService: ShareService) {
    this.storageService = new StorageService('navbar');
    this.navbarTags = ['pc', 'playstation5', 'xbox-one', 'playstation4', 'xbox-series-x', 'nintendo-switch'];
    this.platforms = [];
    this.getPlatforms();
  }

  getPlatforms() {
    if (this.storageService.get() == null) {
      this.rawgService.platforms().subscribe({
        next: data => {
          data.results.forEach(x => {
            //set navbar tags
            if (this.navbarTags.indexOf(x.slug) > -1) {
              this.platforms.push(x);
            }
          })
          this.storageService.set(this.platforms);
        },
        error: error => {
          // alert error
        },
        complete: () => {
          console.log('Request complete');
        }
      })
    } else {
      this.platforms = this.storageService.get();
    }
  }

  typing() {
    //search when stop typing
    let search_temp = this.search_param;
    this.delay(500).then(() => {
      if(search_temp == this.search_param)   
        this.search(this.selected_nav);
    })
  }


  search(id?: number) {
    this.selected_nav = id;
    let params: Search = {
      platform: id,
      search: this.search_param,
      page: 1
    };
    this.shareService.setItem(params);
  }

  delay(t:number, v?:any) {
    return new Promise(resolve => setTimeout(resolve, t, v));
  }
}
