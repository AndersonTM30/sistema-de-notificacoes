import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  /**
   * Gera um número inteiro aleatório entre min e max (inclusive)
   * @param min Valor mínimo (inclusive)
   * @param max Valor máximo (inclusive)
   * @returns Número inteiro aleatório
   */
  getRandomIntInclusive(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

  /**
   * Retorna true com uma probabilidade específica
   * @param probability Probabilidade de retornar true (0-100)
   * @returns boolean
   */
  shouldFail(probability: number = 20): boolean {
    return this.getRandomIntInclusive(1, 100) <= probability;
  }

  /**
   * Simula delay aleatório entre 1-2 segundos
   * @returns Promise que resolve após o delay
   */
  async simulateDelay(): Promise<void> {
    const delayMs = this.getRandomIntInclusive(1000, 2000);
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
}