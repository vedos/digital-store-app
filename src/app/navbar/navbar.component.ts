import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/helper';
import { Platform, Search } from 'src/models';
import { RawgService, StorageService } from 'src/services';
import { GameView } from '../home/home.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  public platforms: Platform[];
  private navbarTags: string[];
  search_param?: string;
  selected_nav?: number;
  cart: GameView[] = [];
  
  cartKey: string = 'cart';  
  navbarKey: string = 'navbar';

  constructor(
    private rawgService: RawgService,
    private shareService: ShareService,
    private storageService: StorageService
    ) { 
    this.navbarTags = ['pc', 'playstation5', 'xbox-one', 'playstation4', 'xbox-series-x', 'nintendo-switch'];
    this.platforms = [];
    this.getPlatforms();
  }

  ngOnInit(): void {    
    this.watchCart();
  }

  getPlatforms() {
    if (this.storageService.get(this.cartKey) == null) {
      this.rawgService.platforms().subscribe({
        next: data => {
          data.results.forEach(x => {
            //set navbar tags
            if (this.navbarTags.indexOf(x.slug) > -1) {
              this.platforms.push(x);
            }
          })
          this.storageService.set<Platform[]>(this.platforms,this.navbarKey);
        },
        error: error => {
          // alert error
        },
        complete: () => {
          console.log('Request complete');
        }
      })
    } else {
      this.platforms = this.storageService.get<Platform[]>(this.navbarKey);
    }
  }

  watchCart(){   
    this.storageService.watchStorage().subscribe((t) => {
      if(t == 'removed'+this.cartKey || this.storageService.get(this.cartKey) == null)
        this.cart = [];
      else
        this.cart = this.storageService.get(this.cartKey);
    });
  }

  downloadCart(){
    let json = this.storageService.getJson(this.cartKey) || '{}';    
    let uri = "data:application/json;charset=UTF-8," + encodeURIComponent(json);
    let link = document.createElement("a");
    link.download = "cart";
    link.href = uri;
    link.click(); 
    
    this.storageService.remove(this.cartKey);
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
