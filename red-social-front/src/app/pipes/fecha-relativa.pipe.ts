    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({
    name: 'fechaRelativa',
    standalone: true
    })
    export class FechaRelativaPipe implements PipeTransform {

    transform(fecha: string | Date): string {

        const fechaPublicacion = new Date(fecha);
        const ahora = new Date();

        const diferencia =
        ahora.getTime() - fechaPublicacion.getTime();

        const segundos =
        Math.floor(diferencia / 1000);

        const minutos =
        Math.floor(segundos / 60);

        const horas =
        Math.floor(minutos / 60);

        const dias =
        Math.floor(horas / 24);

        if (segundos < 60) {
        return 'Hace unos segundos';
        }

        if (minutos < 60) {
        return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        }

        if (horas < 24) {
        return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
        }

        if (dias === 1) {
        return 'Ayer';
        }

        if (dias < 30) {
        return `Hace ${dias} días`;
        }

        return fechaPublicacion.toLocaleDateString();

    }

    }