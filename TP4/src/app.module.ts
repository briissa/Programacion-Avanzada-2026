import { ConfigModule } from '@nestjs/config'; //este es el que agregamos
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [ //esto tambien lo agregamos para poder usar variables de entorno en cualquier parte del proyecto
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}