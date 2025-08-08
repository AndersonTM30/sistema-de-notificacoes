
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

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Dado um payload válido, quando o método create é chamado, ele deve emitir uma mensagem e retornar uma mensagem de aceitação', async () => {
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

  describe('handleMessage', () => {
    const messageData = {
      mensagemId: 'test-uuid-2',
      conteudoMensagem: 'Another test message',
    };

    it('Dada uma mensagem, quando processada com sucesso, deve persistir e publicar o status de sucesso', async () => {
      // Arrange
      mockRandomService.shouldFail.mockReturnValue(false);
      const expectedStatus = 'PROCESSADO_SUCESSO';
      const expectedStatusQueue = 'fila.notificacao.status.ANDERSON';

      // Act
      await service.handleMessage(messageData);

      // Assert
      expect(mockRandomService.simulateDelay).toHaveBeenCalled();
      expect(mockStoreService.setStatus).toHaveBeenCalledWith(messageData.mensagemId, expectedStatus);
      expect(mockStatusClient.emit).toHaveBeenCalledWith(
        expectedStatusQueue,
        expect.objectContaining({
          mensagemId: messageData.mensagemId,
          status: expectedStatus,
          timestamp: expect.any(Date),
        }),
      );
    });

    it('Dada uma mensagem, quando o processamento falha, deve persistir e publicar o status de falha', async () => {
      // Arrange
      mockRandomService.shouldFail.mockReturnValue(true);
      const expectedStatus = 'FALHA_PROCESSAMENTO';
      const expectedStatusQueue = 'fila.notificacao.status.ANDERSON';

      // Act
      await service.handleMessage(messageData);

      // Assert
      expect(mockRandomService.simulateDelay).toHaveBeenCalled();
      expect(mockStoreService.setStatus).toHaveBeenCalledWith(messageData.mensagemId, expectedStatus);
      expect(mockStatusClient.emit).toHaveBeenCalledWith(
        expectedStatusQueue,
        expect.objectContaining({
          mensagemId: messageData.mensagemId,
          status: expectedStatus,
          timestamp: expect.any(Date),
        }),
      );
    });
  });

  describe('getStatus', () => {
    it('Dado um mensagemId existente, quando getStatus é chamado, então deve retornar o status', () => {
      // Arrange
      const mensagemId = 'existing-id';
      const storedStatus = { mensagemId, status: 'PROCESSADO_SUCESSO' };
      mockStoreService.getStatus.mockReturnValue(storedStatus);

      // Act
      const result = service.getStatus(mensagemId);

      // Assert
      expect(mockStoreService.getStatus).toHaveBeenCalledWith(mensagemId);
      expect(result).toEqual(storedStatus);
    });

    it('Dado um mensagemId inexistente, quando getStatus é chamado, então deve retornar null', () => {
      // Arrange
      const mensagemId = 'non-existing-id';
      mockStoreService.getStatus.mockReturnValue(null);

      // Act
      const result = service.getStatus(mensagemId);

      // Assert
      expect(mockStoreService.getStatus).toHaveBeenCalledWith(mensagemId);
      expect(result).toBeNull();
    });
  });
});
