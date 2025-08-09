# Usar Node.js 22 Alpine conforme especificação
FROM node:22-alpine

# Instalar dependências do sistema para compilação nativa
RUN apk update && apk add --no-cache python3 build-base

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Compilar aplicação TypeScript
RUN npm run build

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Alterar propriedade dos arquivos
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expor porta 3000 conforme especificação
EXPOSE 3000

# Comando para executar a aplicação
CMD ["node", "dist/main"]