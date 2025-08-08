import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notificar')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @MessagePattern('fila.notificacao.entrada.*')
  async handleMessage(data: any) {
    return this.notificationService.handleMessage(data);
  }
}

@Controller('notificacao')
export class NotificationStatusController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('status/:mensagemId')
  getStatus(@Param('mensagemId') mensagemId: string) {
    const status = this.notificationService.getStatus(mensagemId);
    
    if (!status) {
      throw new NotFoundException('Status não encontrado');
    }
    
    return status;
  }
}