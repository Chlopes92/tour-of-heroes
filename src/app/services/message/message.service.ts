import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/** Le service sert à exposer un cache de messages et deux méthodes*/
export class MessageService {

  messages: string[] = [];

  constructor() { }

  add(message: string){
    this.messages.push(message);
  }

  clear(){
    this.messages = [];
  }

}
