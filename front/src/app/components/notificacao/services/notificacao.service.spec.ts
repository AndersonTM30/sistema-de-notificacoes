import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NotificacaoService } from './notificacao.service';
import { environment } from '../../../../environments/environment';

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
});