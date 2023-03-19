import { Injectable } from '@angular/core';
import { Hero } from 'src/app/hero';
import { HEROES } from 'src/app/mocks/heroes.mock';
import { MessageService } from '../message/message.service';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

//Méthode pour renvoyer les héros fictifs 
  // getHeroes(): Hero[]{
  //   return HEROES;
  // }

/** Récupére les héros du serveur */
  getHeroes(): Observable<Hero[]>{
   
    // this.messageService.add(`HeroService: Fetched Heroes`);
    // return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    );

  }

/** Récupére les héros par l'id, et retourne 'undefined' si l'id n'est pas trouvée*/
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), 
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

/**Obtenir le héro par identifiant et renvoyer 404 si l'identifiant n'est pas trouvé*/
  getHero(id: number): Observable<Hero>{
    // const hero = HEROES.find(h => h.id === id)!;
    // this.messageService.add('HeroService: fetched hero id=${id}');
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );

  }

/** Obtenir les héros dont le nom contient le terme recherché */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
  }

  /////////Les méthodes d'enregistrement//////////

/** Ajouter un nouveau héros au serveur */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

/** Supprimer les héros du serveur */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
  
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

/** Mettre à jour le héros sur le serveur */
  updateHero(hero: Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

/** Gérer l'opération Http qui a échoué
 * Et laisser l'application continuer
 */
  private handleError<T>(operation = 'operation', result?: T){

    return (error: any): Observable<T> =>{

      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
    
      return of(result as T);
    }
  }

/**Enregistre un message HeroService avec le MessageService*/ 
  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

  
}
