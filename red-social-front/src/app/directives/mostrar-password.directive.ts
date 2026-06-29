    import {
    Directive,
    HostListener,
    Input
    } from '@angular/core';

    @Directive({
    selector: '[appMostrarPassword]',
    standalone: true
    })
    export class MostrarPasswordDirective {

    @Input()
    input!: HTMLInputElement;

    @HostListener('click')
    cambiarVisibilidad() {

        this.input.type =
        this.input.type === 'password'
            ? 'text'
            : 'password';

    }

    }