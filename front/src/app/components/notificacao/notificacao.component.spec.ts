import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacaoComponent } from './notificacao.component';
import { NotificacaoService } from './services/notificacao.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import * as uuid from 'uuid'; // Importa o módulo uuid inteiro

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let notificacaoService: NotificacaoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacaoComponent, ReactiveFormsModule],
      providers: [
        {
          provide: NotificacaoService,
          useValue: {
            enviarNotificacao: jasmine.createSpy('enviarNotificacao'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    notificacaoService = TestBed.inject(NotificacaoService);

    // Mock uuid.v4 aqui
    spyOn(uuid, 'v4').and.returnValue('mock-uuid');

    fixture.detectChanges();
  });

  it('deve ser definido', () => {
    expect(component).toBeDefined();
  });

  it('deve gerar um mensagemId e chamar o serviço ao enviar notificação', (done) => {
    const conteudoMensagem = 'Mensagem de teste';
    (notificacaoService.enviarNotificacao as jasmine.Spy).and.returnValue(of({
      mensagemId: 'mock-uuid',
      message: 'Notificação em processamento.',
    }));

    spyOn(uuidv4, 'v4' as any).and.returnValue('mock-uuid'); // Mock uuidv4

    component.form.controls['conteudoMensagem'].setValue(conteudoMensagem);
    component.enviarNotificacao();

    expect(notificacaoService.enviarNotificacao).toHaveBeenCalledWith({
      mensagemId: 'mock-uuid',
      conteudoMensagem,
    });
    expect(component.notificacoes.length).toBe(1);
    expect(component.notificacoes[0]).toEqual({
      mensagemId: 'mock-uuid',
      conteudoMensagem,
      status: 'AGUARDANDO_PROCESSAMENTO',
    });
    done();
  });

  it('deve exibir mensagem de erro se o envio falhar', (done) => {
    const errorMessage = 'Erro ao enviar';
    (notificacaoService.enviarNotificacao as jasmine.Spy).and.returnValue(throwError(() => new Error(errorMessage)));

    component.form.controls['conteudoMensagem'].setValue('Mensagem de teste');
    component.enviarNotificacao();

    expect(component.notificacoes.length).toBe(0); // Nenhuma notificação adicionada
    // Aqui você pode adicionar uma asserção para verificar se a mensagem de erro é exibida na UI
    // Por exemplo, expect(component.errorMessage).toBe(errorMessage);
    done();
  });

  it('o botão de envio deve estar desabilitado quando o formulário for inválido', () => {
    component.form.controls['conteudoMensagem'].setValue('');
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTrue();
  });

  it('o botão de envio deve estar habilitado quando o formulário for válido', () => {
    component.form.controls['conteudoMensagem'].setValue('Mensagem válida');
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalse();
  });
});