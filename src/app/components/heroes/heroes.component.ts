import { Component, OnInit } from '@angular/core';
import { Hero } from 'src/app/hero';
import { HEROES } from 'src/app/mocks/heroes.mock';
import { HeroService } from 'src/app/services/hero/hero.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit{

  // selectedHero?: Hero;
  heroes: Hero[] = [];
  // heroes = HEROES;

//   hero: Hero = {
//     id: 1,
//     name: 'Windstorm'
// };

constructor(private heroService: HeroService, private messageService: MessageService){}

ngOnInit(): void {
  this.getHeroes();
}

// onSelect(hero: Hero): void{
//   this.selectedHero = hero;
//   console.log(this.selectedHero);
//   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
// }

/**Méthode pour récupérer les héros du service*/
getHeroes(): void {
  this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
}

add(name: string): void {
  name = name.trim();
    if (!name) { 
      return; 
    }
  this.heroService.addHero({ name } as Hero).subscribe(hero => {
    this.heroes.push(hero);
  });
}

delete(hero: Hero): void {
  this.heroes = this.heroes.filter(h => h !== hero);
  this.heroService.deleteHero(hero.id).subscribe();
}

}
