import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  private apiUrl = `${environment.apiUrl}/notificar`;

  constructor(private http: HttpClient) {}

  enviarNotificacao(payload: { mensagemId: string; conteudoMensagem: string }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
