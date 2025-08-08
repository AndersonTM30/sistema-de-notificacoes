import { Injectable } from '@nestjs/common';

export interface NotificationStatus {
  mensagemId: string;
  status: 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO';
  timestamp: Date;
}

@Injectable()
export class StoreService {
  private readonly statusStore = new Map<string, NotificationStatus>();

  setStatus(mensagemId: string, status: 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO'): void {
    const notificationStatus: NotificationStatus = {
      mensagemId,
      status,
      timestamp: new Date(),
    };
    
    this.statusStore.set(mensagemId, notificationStatus);
  }

  getStatus(mensagemId: string): NotificationStatus | undefined {
    return this.statusStore.get(mensagemId);
  }

  getAll(): NotificationStatus[] {
    return Array.from(this.statusStore.values());
  }

  clear(): void {
    this.statusStore.clear();
  }

  size(): number {
    return this.statusStore.size;
  }
}