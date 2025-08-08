import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile, Subject, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Notification } from '../../../shared/interfaces/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  private apiUrl = `${environment.apiUrl}/notificar`;
  private statusApiUrl = `${environment.apiUrl}/notificacao/status`;

  constructor(private http: HttpClient) {}

  enviarNotificacao(payload: { mensagemId: string; conteudoMensagem: string }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  startPolling(mensagemId: string, initialStatus: Notification['status']): Observable<Notification['status']> {
    const statusSubject = new Subject<Notification['status']>();
    let currentStatus = initialStatus;

    interval(5000) // Polling a cada 5 segundos
      .pipe(
        takeWhile(() => currentStatus === 'AGUARDANDO_PROCESSAMENTO'),
        switchMap(() => this.http.get<Notification>(`${this.statusApiUrl}/${mensagemId}`).pipe(
          catchError(error => {
            // Se a notificação não for encontrada (404), paramos o polling
            if (error.status === 404) {
              currentStatus = 'FALHA_PROCESSAMENTO'; // Ou outro status para indicar que não foi encontrada
              statusSubject.next(currentStatus);
              statusSubject.complete();
            }
            return of(null); // Retorna um observable vazio para não quebrar o stream
          })
        ))
      )
      .subscribe(response => {
        if (response && response.status && response.status !== currentStatus) {
          currentStatus = response.status;
          statusSubject.next(currentStatus);
          if (currentStatus !== 'AGUARDANDO_PROCESSAMENTO') {
            statusSubject.complete(); // Completa o subject quando o status final é alcançado
          }
        }
      });

    return statusSubject.asObservable();
  }
}
