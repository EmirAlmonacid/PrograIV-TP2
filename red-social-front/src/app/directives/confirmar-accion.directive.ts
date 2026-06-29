    import {
    Directive,
    HostListener,
    Input
    } from '@angular/core';

    @Directive({
    selector: '[appConfirmarAccion]',
    standalone: true
    })
    export class ConfirmarAccionDirective {

    @Input()
    mensaje =
        '¿Está seguro de realizar esta acción?';

    @HostListener('click', ['$event'])
    confirmar(event: MouseEvent) {

        const aceptar =
        window.confirm(this.mensaje);

        if (!aceptar) {

        event.preventDefault();

        event.stopImmediatePropagation();

        }

    }

    }