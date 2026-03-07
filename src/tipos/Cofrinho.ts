export interface Cofrinho {
  id: number;
  nome: string;
  banco: string | null;
  valor_alocado: number;
  rentabilidade: number; // percentual mensal
  criado_em: string;
}
