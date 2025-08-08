
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { HttpStatus } from '@nestjs/common';

// Mock do NotificationService
const mockNotificationService = {
  create: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Dado um payload válido, quando create é chamado, ele deve chamar notificationService.create e retornar o resultado', async () => {
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
