
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController, NotificationStatusController } from './notification.controller';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { HttpStatus, NotFoundException } from '@nestjs/common';

// Mock do NotificationService
const mockNotificationService = {
  create: jest.fn(),
  getStatus: jest.fn(),
};

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Dado um payload válido, quando o método create é chamado, ele deve chamar o notificationService.create e retornar o resultado', async () => {
      // Arrange
      const createNotificationDto: CreateNotificationDto = {
        mensagemId: 'test-uuid',
        conteudoMensagem: 'This is a test message',
      };
      const expectedResult = {
        mensagemId: 'test-uuid',
        message: 'Notificação em processamento.',
      };
      mockNotificationService.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createNotificationDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createNotificationDto);
      expect(result).toEqual(expectedResult);
    });
  });
});

describe('NotificationStatusController', () => {
  let controller: NotificationStatusController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationStatusController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationStatusController>(NotificationStatusController);
    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getStatus', () => {
    it('Dado um mensagemId existente, quando getStatus é chamado, então deve retornar o status', () => {
      // Arrange
      const mensagemId = 'existing-id';
      const expectedStatus = { mensagemId, status: 'PROCESSADO_SUCESSO' };
      mockNotificationService.getStatus.mockReturnValue(expectedStatus);

      // Act
      const result = controller.getStatus(mensagemId);

      // Assert
      expect(service.getStatus).toHaveBeenCalledWith(mensagemId);
      expect(result).toEqual(expectedStatus);
    });

    it('Dado um mensagemId inexistente, quando getStatus é chamado, então deve lançar NotFoundException', () => {
      // Arrange
      const mensagemId = 'non-existing-id';
      mockNotificationService.getStatus.mockReturnValue(null);

      // Act & Assert
      expect(() => controller.getStatus(mensagemId)).toThrow(NotFoundException);
      expect(service.getStatus).toHaveBeenCalledWith(mensagemId);
    });
  });
});
