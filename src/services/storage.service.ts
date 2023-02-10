export class StorageService<T> {
    key: string;

    constructor(key:string){
        this.key = key
    }

    setKey(key:string){
        this.key = key;
    }

    set(object: T){
        localStorage.setItem(this.key, JSON.stringify(object));
    }

    get(){
        return <T>(JSON.parse(localStorage.getItem(this.key) || 'null'));
    }

    remove(){
        localStorage.removeItem(this.key);
    }
    
}