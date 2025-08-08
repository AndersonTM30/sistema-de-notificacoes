export interface Notification {
  mensagemId: string;
  conteudoMensagem: string;
  status: 'AGUARDANDO_PROCESSAMENTO' | 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO';
}