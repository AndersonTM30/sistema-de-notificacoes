import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { StoreService } from '../../shared/services/store.service';
import { RandomService } from '../../shared/services/random.service';
import { NOTIFICATION_ENTRADA, NOTIFICATION_STATUS } from '../../config/rabbitmq';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(NOTIFICATION_ENTRADA) private readonly entradaClient: ClientProxy,
    @Inject(NOTIFICATION_STATUS) private readonly statusClient: ClientProxy,
    private readonly storeService: StoreService,
    private readonly randomService: RandomService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { mensagemId, conteudoMensagem } = createNotificationDto;
    
    this.logger.log(`Enviando notificação para fila: ${mensagemId}`);
    
    // Emite mensagem na fila de entrada
    this.entradaClient.emit(`fila.notificacao.entrada.${process.env.QUEUE_SUFFIX || 'ANDERSON'}`, {
      mensagemId,
      conteudoMensagem,
      timestamp: new Date(),
    });

    return {
      mensagemId,
      message: 'Notificação em processamento.',
    };
  }

  async handleMessage(data: any) {
    const { mensagemId, conteudoMensagem } = data;
    
    this.logger.log(`Processando mensagem: ${mensagemId}`);
    
    // Simula delay de 1-2 segundos
    await this.randomService.simulateDelay();
    
    // Determina se deve falhar (20% de chance)
    const shouldFail = this.randomService.shouldFail(20);
    const status = shouldFail ? 'FALHA_PROCESSAMENTO' : 'PROCESSADO_SUCESSO';
    
    this.logger.log(`Mensagem ${mensagemId} processada com status: ${status}`);
    
    // Persiste status no store
    this.storeService.setStatus(mensagemId, status);
    
    // Emite status na fila de status
    const statusMessage = {
      mensagemId,
      status,
      timestamp: new Date(),
    };
    
    this.statusClient.emit(`fila.notificacao.status.${process.env.QUEUE_SUFFIX || 'ANDERSON'}`, statusMessage);
    
    return statusMessage;
  }

  getStatus(mensagemId: string) {
    const status = this.storeService.getStatus(mensagemId);
    
    if (!status) {
      return null;
    }
    
    return {
      mensagemId: status.mensagemId,
      status: status.status,
    };
  }
}