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

## Executar o Projeto

Para executar a aplicação completa (Backend API, RabbitMQ e Frontend), siga os passos abaixo:

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (`sistema_de_notificacoes/`) com as seguintes variáveis:

```dotenv
# Variáveis para o RabbitMQ e API
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/
QUEUE_SUFFIX=DEV

# Porta da API (usada pelo Docker)
PORT=3000
```

> **Nota:** O `QUEUE_SUFFIX` pode ser alterado para um valor único (ex: seu nome) para evitar conflitos de fila em ambientes compartilhados.

### 2. Iniciar a Infraestrutura (API e RabbitMQ com Docker Compose)

No diretório raiz do projeto (`sistema_de_notificacoes/`), execute o seguinte comando para construir as imagens e iniciar os containers:

```bash
docker compose up --build
```

Este comando irá:
- Construir a imagem Docker da API.
- Iniciar o container do RabbitMQ.
- Iniciar o container da API, que se conectará ao RabbitMQ.

Você pode acessar o painel de gerenciamento do RabbitMQ em `http://localhost:15672` (com as credenciais definidas no `.env`).

### 3. Iniciar o Frontend (Angular)

Em um **novo terminal**, navegue até o diretório do frontend (`front/`) e instale as dependências (se ainda não o fez):

```bash
cd front
npm install
```

Em seguida, inicie o servidor de desenvolvimento do Angular:

```bash
npm start
```

O frontend estará disponível em `http://localhost:4200`.

### 4. Testar a Aplicação

Com a API e o Frontend rodando, você pode:
- Acessar `http://localhost:4200` no seu navegador.
- Digitar uma mensagem no formulário e clicar em "Enviar Notificação".
- Observar a notificação aparecer na lista com o status "AGUARDANDO PROCESSAMENTO" e, em seguida, ser atualizada para "PROCESSADO_SUCESSO" ou "FALHA_PROCESSAMENTO" (devido ao polling).
- Você também pode verificar os logs dos containers Docker para ver o processamento das mensagens.


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

🚧 **Em desenvolvimento** - Fase de testes de integração