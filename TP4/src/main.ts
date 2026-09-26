import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
}
bootstrap();

/*
app.useGlobalPipes(new ValidationPipe({...})): esto es lo que realmente "conecta" el DTO que armamos con la validación automática. 
Sin esta línea, nadie los estaría chequeando — el DTO sería solo decoración sin efecto real.

whitelist: true: le dice a Nest "si llega algún campo en el JSON que no está definido en el DTO, borralo automáticamente"
 (por ejemplo, si alguien manda un campo extra hackeando: true, se descarta solo).

forbidNonWhitelisted: true: es un paso más estricto todavía — en vez de solo borrar los campos extra en silencio, rechaza el pedido entero con error 400 si detecta algún campo que no debería estar.
  Esto es  lo que pide el criterio de aceptación del tp: "Request inválido (sin items, precio negativo, campos extra) responde 400".

El puerto: ya estaba usando process.env.PORT, pero le cambié el valor por defecto de 3000 a 3003, que es el puerto sugerido por el PDF — así, aunque por algún motivo PORT no esté en el .env, igual arranca en el puerto correcto.
*/