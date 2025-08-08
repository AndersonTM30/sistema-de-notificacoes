# Sistema de Notificações Assíncronas

Sistema de envio de notificações assíncronas utilizando Angular (frontend), NestJS (backend) e RabbitMQ para processamento de filas.

## Arquitetura

```
Angular Frontend → NestJS API → RabbitMQ (Filas de entrada e status)
```

## Tecnologias

### Backend (api/)
- **Node.js**: 22-alpine
- **NestJS**: ^11.0.1
- **TypeScript**: ^5.7
- **RabbitMQ**: Transport.RMQ
- **Testes**: Jest ^29.7

### Frontend (front/)
- **Angular**: ^19.2
- **TypeScript**: ~5.7.2
- **RxJS**: ~7.8
- **Testes**: Karma/Jasmine

## Estrutura do Projeto

```
sistema_de_notificacoes/
├── api/                    # Backend NestJS
│   ├── src/
│   │   ├── config/         # Configurações (RabbitMQ, etc.)
│   │   ├── modules/
│   │   │   └── notification/  # Módulo de notificações
│   │   └── shared/         # Serviços compartilhados
│   └── test/               # Testes
├── front/                  # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Componentes por feature
│   │   │   └── shared/     # Interfaces e serviços compartilhados
│   │   └── environments/   # Configurações de ambiente
└── docker-compose.yml      # Orquestração dos serviços
```

## Funcionalidades

### API Endpoints
- `POST /api/notificar` - Envio de notificação
- `GET /api/notificacao/status/:mensagemId` - Consulta de status

### Filas RabbitMQ
- **Fila de entrada**: `fila.notificacao.entrada.<SUFIXO>`
- **Fila de status**: `fila.notificacao.status.<SUFIXO>`

### Status de Processamento
- `AGUARDANDO PROCESSAMENTO` (inicial)
- `PROCESSADO_SUCESSO` (sucesso)
- `FALHA_PROCESSAMENTO` (falha - 20% probabilidade)

## Configuração do Ambiente

### Variáveis de Ambiente
```bash
# API
PORT=3000
RABBITMQ_USER=RABBITMQ_USER
RABBITMQ_PASS=RABBITMQ_PASS
RABBITMQ_HOST=RABBITMQ_HOST
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/
QUEUE_SUFFIX=QUEUE_SUFFIX

# Frontend
API_URL=http://localhost:3000/api
```

### Portas
- **API**: 3000
- **RabbitMQ**: 5672 (broker), 15672 (management)
- **Frontend**: 4200

## Desenvolvimento

### Pré-requisitos
- Node.js 22+
- Docker e Docker Compose
- npm ou yarn

### Executar o projeto
```bash
# Subir infraestrutura (RabbitMQ + API)
docker-compose up --build

# Frontend (em outro terminal)
cd front
npm start
```

### Testes
```bash
# Backend
cd api
npm test

# Frontend
cd front
npm test
```

## Status do Projeto

🚧 **Em desenvolvimento** - Fase de configuração do ambiente