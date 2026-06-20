import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
    })
    export class AuthService {

    private apiUrl =
        'https://progra-iv-tp-2-back-omega.vercel.app/auth';

    constructor(
        private http: HttpClient
    ) {}

    autorizar(token: string) {

        return this.http.post(
        `${this.apiUrl}/autorizar`,
        { token }
        );

    }

    refrescar(token: string) {

        return this.http.post(
        `${this.apiUrl}/refrescar`,
        { token }
        );

    }

    }