    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({
    name: 'contador',
    standalone: true
    })
    export class ContadorPipe implements PipeTransform {

    transform(valor: number): string {

        if (valor == null) {
        return '0';
        }

        if (valor >= 1000000) {
        return (valor / 1000000).toFixed(1).replace('.0', '') + 'M';
        }

        if (valor >= 1000) {
        return (valor / 1000).toFixed(1).replace('.0', '') + 'K';
        }

        return valor.toString();

    }

    }