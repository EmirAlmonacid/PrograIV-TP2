    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({
    name: 'capitalizar',
    standalone: true
    })
    export class CapitalizarPipe implements PipeTransform {

    transform(texto: string): string {

        // Convierte la primera letra en mayúscula y el resto en minúscula.
        if (!texto) {
        return '';
        }

        return texto.charAt(0).toUpperCase() +
        texto.slice(1).toLowerCase();

    }

    }