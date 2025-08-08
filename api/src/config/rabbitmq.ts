import { ConfigService } from '@nestjs/config';
import { ClientsModuleOptions, Transport } from '@nestjs/microservices';

export const NOTIFICATION_ENTRADA = 'NOTIFICATION_ENTRADA';
export const NOTIFICATION_STATUS = 'NOTIFICATION_STATUS';

export const createRabbitMQClientConfig = (configService: ConfigService): ClientsModuleOptions => {
  const queueSuffix = configService.get<string>('QUEUE_SUFFIX', 'ANDERSON');
  
  return [
    {
      name: NOTIFICATION_ENTRADA,
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${configService.get<string>('RABBITMQ_USER', 'guest')}:${configService.get<string>('RABBITMQ_PASS', 'guest')}@${configService.get<string>('RABBITMQ_HOST', 'localhost')}:${configService.get<string>('RABBITMQ_PORT', '5672')}${configService.get<string>('RABBITMQ_VHOST', '/')}`
        ],
        queue: `fila.notificacao.entrada.${queueSuffix}`,
        queueOptions: {
          durable: true,
        },
      },
    },
    {
      name: NOTIFICATION_STATUS,
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${configService.get<string>('RABBITMQ_USER', 'guest')}:${configService.get<string>('RABBITMQ_PASS', 'guest')}@${configService.get<string>('RABBITMQ_HOST', 'localhost')}:${configService.get<string>('RABBITMQ_PORT', '5672')}${configService.get<string>('RABBITMQ_VHOST', '/')}`
        ],
        queue: `fila.notificacao.status.${queueSuffix}`,
        queueOptions: {
          durable: true,
        },
      },
    },
  ];
};

export const createRabbitMQMicroserviceConfig = (configService: ConfigService) => {
  const queueSuffix = configService.get<string>('QUEUE_SUFFIX', 'ANDERSON');
  
  return {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${configService.get<string>('RABBITMQ_USER', 'guest')}:${configService.get<string>('RABBITMQ_PASS', 'guest')}@${configService.get<string>('RABBITMQ_HOST', 'localhost')}:${configService.get<string>('RABBITMQ_PORT', '5672')}${configService.get<string>('RABBITMQ_VHOST', '/')}`
      ],
      queue: `fila.notificacao.entrada.${queueSuffix}`,
      queueOptions: {
        durable: true,
      },
    },
  };
};