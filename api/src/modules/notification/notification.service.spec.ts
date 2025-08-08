
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { StoreService } from '../../shared/services/store.service';
import { RandomService } from '../../shared/services/random.service';

// Mocks
const mockEntradaClient = {
  emit: jest.fn(),
};
const mockStatusClient = {
  emit: jest.fn(),
};
const mockStoreService = {
  setStatus: jest.fn(),
  getStatus: jest.fn(),
};
const mockRandomService = {
  simulateDelay: jest.fn().mockResolvedValue(undefined),
  shouldFail: jest.fn().mockReturnValue(false),
};

describe('NotificationService', () => {
  let service: NotificationService;
  let entradaClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: 'NOTIFICATION_ENTRADA',
          useValue: mockEntradaClient,
        },
        {
          provide: 'NOTIFICATION_STATUS',
          useValue: mockStatusClient,
        },
        {
          provide: StoreService,
          useValue: mockStoreService,
        },
        {
          provide: RandomService,
          useValue: mockRandomService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    entradaClient = module.get<ClientProxy>('NOTIFICATION_ENTRADA');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Dado um payload válido, quando create é chamado, ele deve emitir uma mensagem e retornar uma mensagem de aceitação', async () => {
      // Arrange
      const createNotificationDto: CreateNotificationDto = {
        mensagemId: 'test-uuid',
        conteudoMensagem: 'This is a test message',
      };
      const expectedQueue = 'fila.notificacao.entrada.ANDERSON';
      const expectedResult = {
        mensagemId: 'test-uuid',
        message: 'Notificação em processamento.',
      };

      // Act
      const result = await service.create(createNotificationDto);

      // Assert
      expect(entradaClient.emit).toHaveBeenCalledWith(
        expectedQueue,
        expect.objectContaining({
          mensagemId: createNotificationDto.mensagemId,
          conteudoMensagem: createNotificationDto.conteudoMensagem,
          timestamp: expect.any(Date),
        }),
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
