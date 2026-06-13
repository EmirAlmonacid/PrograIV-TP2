import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Usuario {

  @Prop({
    required: true,
    maxlength: 25
  })
  nombre!: string;

  @Prop({
    required: true,
    maxlength: 25
  })
  apellido!: string;

  @Prop({
    required: true,
    unique: true,
    maxlength: 50
  })
  correo!: string;

  @Prop({
    required: true,
    unique: true,
    maxlength: 20
  })
  usuario!: string;

  @Prop({
    required: true
  })
  password!: string;

  @Prop({
    required: true
  })
  fechaNacimiento!: Date;

  @Prop({
    maxlength: 150
  })
  descripcion!: string;

  @Prop({
  default:
    'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
})
foto!: string;


  @Prop({
  enum: ['usuario', 'administrador'],
  default: 'usuario'
})
perfil!: string;

}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);