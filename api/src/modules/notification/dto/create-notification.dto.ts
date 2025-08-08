import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateNotificationDto {
  @IsString({ message: 'mensagemId deve ser uma string' })
  @IsNotEmpty({ message: 'mensagemId é obrigatório' })
  @Length(1, 255, { message: 'mensagemId deve ter entre 1 e 255 caracteres' })
  mensagemId: string;

  @IsString({ message: 'conteudoMensagem deve ser uma string' })
  @IsNotEmpty({ message: 'conteudoMensagem é obrigatório' })
  @Length(1, 1000, { message: 'conteudoMensagem deve ter entre 1 e 1000 caracteres' })
  conteudoMensagem: string;
}