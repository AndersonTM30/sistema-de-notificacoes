import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NotificacaoService } from './notificacao.service';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';

describe('NotificacaoService', () => {
  let service: NotificacaoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificacaoService],
    });
    service = TestBed.inject(NotificacaoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve enviar uma notificação via POST para a API', (done) => {
    const mockPayload = {
      mensagemId: 'test-uuid',
      conteudoMensagem: 'Mensagem de teste',
    };
    const mockResponse = {
      mensagemId: 'test-uuid',
      message: 'Notificação em processamento.',
    };

    service.enviarNotificacao(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/notificar`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('deve iniciar o polling para uma notificação e atualizar seu status', fakeAsync(() => {
    const mensagemId = 'polling-id';
    const initialStatus = 'AGUARDANDO_PROCESSAMENTO';
    const finalStatus = 'PROCESSADO_SUCESSO';

    // Simula a notificação inicial
    const notificationSubject = service.startPolling(mensagemId, initialStatus);
    let currentStatus: string | undefined;
    notificationSubject.subscribe(status => currentStatus = status);

    // Primeira requisição de polling (após 0ms)
    const req1 = httpTestingController.expectOne(`${environment.apiUrl}/notificacao/status/${mensagemId}`);
    req1.flush({ mensagemId, status: initialStatus });
    tick(5000); // Avança o tempo para a próxima requisição (intervalo de 5s)

    // Segunda requisição de polling (após 5s)
    const req2 = httpTestingController.expectOne(`${environment.apiUrl}/notificacao/status/${mensagemId}`);
    req2.flush({ mensagemId, status: finalStatus });
    tick(5000); // Avança o tempo para a próxima requisição

    expect(currentStatus).toBe(finalStatus);

    // Nenhuma requisição adicional deve ser feita após o status final
    httpTestingController.expectNone(`${environment.apiUrl}/notificacao/status/${mensagemId}`);
  }));

  it('deve parar o polling se a notificação não for encontrada (404)', fakeAsync(() => {
    const mensagemId = 'not-found-id';
    const initialStatus = 'AGUARDANDO_PROCESSAMENTO';

    const notificationSubject = service.startPolling(mensagemId, initialStatus);
    let currentStatus: string | undefined;
    notificationSubject.subscribe(status => currentStatus = status);

    // Primeira requisição de polling
    const req1 = httpTestingController.expectOne(`${environment.apiUrl}/notificacao/status/${mensagemId}`);
    req1.flush(null, { status: 404, statusText: 'Not Found' });
    tick(5000); // Avança o tempo

    expect(currentStatus).toBe(initialStatus); // Status não deve mudar
    httpTestingController.expectNone(`${environment.apiUrl}/notificacao/status/${mensagemId}`); // Polling deve parar
  }));
});