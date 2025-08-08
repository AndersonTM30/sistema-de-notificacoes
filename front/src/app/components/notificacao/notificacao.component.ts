import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NotificacaoService } from './services/notificacao.service';
import { Notification } from '../../shared/interfaces/notification.interface';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notificacao.component.html',
  styleUrl: './notificacao.component.css',
})
export class NotificacaoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificacaoService = inject(NotificacaoService);

  form = this.fb.group({
    conteudoMensagem: ['', Validators.required],
  });

  notificacoes: Notification[] = [];

  ngOnInit(): void {
    // Implementar lógica de carregamento inicial ou polling aqui
  }

  enviarNotificacao(): void {
    if (this.form.valid) {
      const mensagemId = uuidv4();
      const conteudoMensagem = this.form.value.conteudoMensagem!;

      const novaNotificacao: Notification = {
        mensagemId,
        conteudoMensagem,
        status: 'AGUARDANDO_PROCESSAMENTO',
      };

      this.notificacoes.unshift(novaNotificacao); // Adiciona ao topo da lista
      this.form.reset();

      this.notificacaoService.enviarNotificacao({ mensagemId, conteudoMensagem }).subscribe({
        next: (response) => {
          console.log('Notificação enviada com sucesso', response);
          // Inicia o polling para esta notificação
          this.notificacaoService.startPolling(mensagemId, novaNotificacao.status).subscribe(updatedStatus => {
            const index = this.notificacoes.findIndex(n => n.mensagemId === mensagemId);
            if (index !== -1) {
              this.notificacoes = [
                ...this.notificacoes.slice(0, index),
                { ...this.notificacoes[index], status: updatedStatus },
                ...this.notificacoes.slice(index + 1)
              ];
            }
          });
        },
        error: (error) => {
          console.error('Erro ao enviar notificação', error);
          // Remover a notificação da lista ou marcar como erro
          this.notificacoes = this.notificacoes.filter(n => n.mensagemId !== mensagemId);
          alert('Erro ao enviar notificação. Tente novamente.');
        },
      });
    }
  }
}
