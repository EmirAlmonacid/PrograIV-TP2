import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appDeshabilitadoVisual]',
  standalone: true
})
export class DeshabilitadoVisualDirective
implements OnChanges {

  @Input()
  deshabilitado = false;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (this.deshabilitado) {

      this.renderer.setStyle(
        this.element.nativeElement,
        'opacity',
        '.45'
      );

      this.renderer.setStyle(
        this.element.nativeElement,
        'pointer-events',
        'none'
      );

      this.renderer.setStyle(
        this.element.nativeElement,
        'cursor',
        'not-allowed'
      );

    } else {

      this.renderer.removeStyle(
        this.element.nativeElement,
        'opacity'
      );

      this.renderer.removeStyle(
        this.element.nativeElement,
        'pointer-events'
      );

      this.renderer.removeStyle(
        this.element.nativeElement,
        'cursor'
      );

    }

  }

}