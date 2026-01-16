import { HttpClient } from '@angular/common/http';
import { Component, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginModel, Passport, RegisterModel } from '../../_models/passport/passport';
import { Login } from '../../login/login';
import { first, firstValueFrom } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

export class PassportService {
  private _key = 'passport'
  private _base_Url = environment.baseUrl + '/api'
  private _http = inject(HttpClient)
  // constructor(private _http: HttpClient) { }

  data = signal<undefined | Passport>(undefined)

  private loadPassportFromLocalStorage() {

    const jsonString = localStorage.getItem(this._key)
    if (!jsonString) return 'not found'
    try{
      const passport = JSON.parse(jsonString) as Passport
      this.data.set(passport)
      
    } catch (error) {
      return `${error}`
    }
    return null
  }

  private savePassportToLocalStorage() {
    const passport = this.data()
    if (!passport) return
    const jsonString = JSON.stringify(passport)
    localStorage.setItem(this._key, jsonString)
  }

  constructor() {
    this.loadPassportFromLocalStorage()
  }

  destroy(){
    this.data.set(undefined)
    localStorage.removeItem(this._key)
  }

  async get(value: any): Promise<null | String> {

    try {
      const api_url = this._base_Url + '/authentication/login'
      this.fatchPassport(value)

    } catch (error) {
      return `${error}`
    }
    return null
  }

  private async fatchPassport(_models: LoginModel | RegisterModel): Promise<null | String> {
    try {
      const result = this._http.post<Passport>(this._base_Url + '/authentication/login', _models)
      const passport = await firstValueFrom(result)
      this.data.set(passport)
      this.savePassportToLocalStorage()
      return null
    } catch (error) {
      // console.log(error)
      // console.log(Error.ERROR)
      return `${error}`
    }
  }


  async register(regiseter: RegisterModel): Promise<null | String> {
    try {
      const api_url = this._base_Url + '/brawler/register'
     await this.fatchPassport(regiseter)

    } catch (error) {
      return `${error}`
    }

    return null
  }


}

