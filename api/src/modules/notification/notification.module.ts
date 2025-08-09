import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationController, NotificationStatusController } from './notification.controller';
import { NotificationService } from './notification.service';
import { StoreService } from '../../shared/services/store.service';
import { RandomService } from '../../shared/services/random.service';
import { createRabbitMQClientConfig } from '../../config/rabbitmq';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_ENTRADA',
        useFactory: (configService: ConfigService) => {
          const queueSuffix = configService.get<string>('QUEUE_SUFFIX');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                `amqp://${configService.get<string>('RABBITMQ_USER')}:${configService.get<string>('RABBITMQ_PASS')}@${configService.get<string>('RABBITMQ_HOST')}:${configService.get<string>('RABBITMQ_PORT')}${configService.get<string>('RABBITMQ_VHOST')}`
              ],
              queue: `fila.notificacao.entrada.${queueSuffix}`,
              queueOptions: {
                durable: true,
              },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_STATUS',
        useFactory: (configService: ConfigService) => {
          const queueSuffix = configService.get<string>('QUEUE_SUFFIX', 'ANDERSON');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                `amqp://${configService.get<string>('RABBITMQ_USER')}:${configService.get<string>('RABBITMQ_PASS')}@${configService.get<string>('RABBITMQ_HOST')}:${configService.get<string>('RABBITMQ_PORT')}${configService.get<string>('RABBITMQ_VHOST')}`
              ],
              queue: `fila.notificacao.status.${queueSuffix}`,
              queueOptions: {
                durable: true,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotificationController, NotificationStatusController],
  providers: [NotificationService, StoreService, RandomService],
  exports: [NotificationService, StoreService, RandomService],
})
export class NotificationModule {}