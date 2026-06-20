import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
    selector: 'app-loading',
    standalone: true,
    templateUrl: './loading.html',
    styleUrl: './loading.css'
})
export class Loading implements OnInit {


    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {

        const token =
        localStorage.getItem('token');

        if (!token) {

        this.router.navigate(
            ['/login']
        );

        return;

        }

        this.authService
        .autorizar(token)
        .subscribe({

            next: () => {

            this.router.navigate(
                ['/publicaciones']
            );

            },

            error: () => {

            localStorage.removeItem(
                'token'
            );

            localStorage.removeItem(
                'usuarioLogueado'
            );

            this.router.navigate(
                ['/login']
            );

            }

        });

    }

    }