    import {
    Component,
    AfterViewInit
    } from '@angular/core';

    import { Chart } from 'chart.js/auto';

    import { PublicacionesService } from '../../../services/publicaciones';

    @Component({
    selector: 'app-dashboard-estadisticas',
    imports: [],
    templateUrl: './dashboard-estadisticas.html',
    styleUrl: './dashboard-estadisticas.css'
    })
    export class DashboardEstadisticas implements AfterViewInit {

    constructor(
        private publicacionesService: PublicacionesService
    ) {}

    ngAfterViewInit(): void {

        // Carga los tres gráficos del dashboard al iniciar la vista.
        this.cargarGraficoPublicaciones();

        this.cargarGraficoComentarios();

        this.cargarGraficoComentariosDia();

    }

    cargarGraficoPublicaciones() {

        this.publicacionesService
        .obtenerEstadisticasPublicaciones()
        .subscribe({

            next: (datos: any[]) => {

            // Muestra la cantidad de publicaciones realizadas por cada usuario.
            new Chart('graficoPublicaciones', {

                type: 'bar',

                data: {

                labels: datos.map(
                    d => d.usuario
                ),

                datasets: [

                    {

                    label: 'Publicaciones',

                    data: datos.map(
                        d => d.cantidad
                    )

                    }

                ]

                }

            });

            }

        });

    }

    cargarGraficoComentarios() {

        this.publicacionesService
        .obtenerEstadisticasComentarios()
        .subscribe({

            next: (datos: any[]) => {

            // Representa la cantidad de comentarios recibidos por cada publicación.
            new Chart('graficoComentarios', {

                type: 'bar',

                data: {

                labels: datos.map(
                    d => d.titulo
                ),

                datasets: [

                    {

                    label: 'Comentarios',

                    data: datos.map(
                        d => d.comentarios
                    )

                    }

                ]

                }

            });

            }

        });

    }

    cargarGraficoComentariosDia() {

        this.publicacionesService
        .obtenerEstadisticasComentariosPorDia()
        .subscribe({

            next: (datos: any[]) => {

            // Grafica la evolución diaria de los comentarios realizados.
            new Chart('graficoComentariosDia', {

                type: 'line',

                data: {

                labels: datos.map(
                    d => d.fecha
                ),

                datasets: [

                    {

                    label: 'Comentarios por día',

                    data: datos.map(
                        d => d.cantidad
                    )

                    }

                ]

                }

            });

            }

        });

    }

    }