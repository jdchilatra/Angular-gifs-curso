import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList : Gif[] = []

  constructor(private http : HttpClient) {
    this.loadLocalStorage();
    if(this._tagHistory.length > 0)
      this.searchTag(this._tagHistory[0])
  }

  private _tagHistory: string[] = [];
  private serviceUrl : string = 'https:api.giphy.com/v1/gifs';

  private apiKey : string = 's1oXdLB97GheYh3iaWwRjdYJ4Enb0CCw';

  get tagHistory(){
    return [...this._tagHistory];
  }

  public searchTag(tag : string) : void{
    if(tag.length === 0) return;
    this.organizeHistory(tag);
    const params = new HttpParams()
      .set('api_key',this.apiKey)
      .set('limit','10')
      .set('q',tag)
    this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params : params})
      .subscribe( resp=> {
        this.gifList = resp.data;
      })
  }

  private organizeHistory(tag : string){
    tag = tag.toLowerCase();
    if(this.tagHistory.includes(tag)){
      this._tagHistory = this.tagHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagHistory.unshift(tag);
    this._tagHistory = this.tagHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private loadLocalStorage():void{
    const temporal = localStorage.getItem('history');
    if(!temporal) return;
    this._tagHistory = JSON.parse(temporal)
  }

  private saveLocalStorage() : void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory))
  }
}
