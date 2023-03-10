import { Component, OnInit } from '@angular/core';
import { AlertService, ShareService } from 'src/helper';
import { Game, Search } from 'src/models';
import { RawgService, StorageService } from 'src/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public rawgGames: GameView[];
  page: number = 1;
  pageSize: number = 0;
  params: Search;
  cart: GameView[];

  cartKey: string = 'cart';  
  navbarKey: string = 'navbar';

  constructor(
    private shareService: ShareService,    
    private storageService: StorageService,
    private rawgService: RawgService,
    private alertService: AlertService){
    this.rawgGames = [];
    this.params = {};
    this.cart = [];
  }
  
  ngOnInit(): void {  
    //searched values
    this.shareService.selectedItem.subscribe((params) => {
      this.rawgService.games((params as Search)).subscribe({
        next: data => {       
          this.rawgGames = [];
          data.results.forEach(x => {
            let gameView: GameView = x as GameView;
            gameView.price = this.getRandomInt(60);
            this.rawgGames.push( gameView );
          })        
          
          this.page = params.page || this.page;
          if(this.page != this.pageSize)
            this.pageSize = Math.round(data.count/data.results.length);

          this.alertService.success("Games: " + data.count + "" );
          this.params = params as Search;
        },
        error: error => {
          // alert error
        },
        complete: () => {          
          console.log('Request complete');
        }
      });
    })

    this.watchCart();
  }

  watchCart(){
    if(this.storageService.get(this.cartKey) != null)
      this.cart = this.storageService.get(this.cartKey);

    this.storageService.watchStorage().subscribe((t) => {
      if(t == 'removed'+this.cartKey || this.storageService.get(this.cartKey) == null)
        this.cart = [];
      else
        this.cart = this.storageService.get(this.cartKey);
    });
  }

  goToPage(page: number){
    if(page <= this.pageSize && page >= 1){      
      this.page = page;      
      this.params.page = this.page;
      this.shareService.setItem(this.params);
    }
  }

  addToCart(x: GameView){
    this.cart.push(x);
    this.storageService.set<GameView[]>(this.cart, this.cartKey);
    this.alertService.clear();
    this.alertService.success(x.name + " added to cart" );
  }
  
  getRandomInt(max:number) {
    return Math.floor(Math.random() * max);
  }
}
export interface GameView extends Game{
    price: number;
}
