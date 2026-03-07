export interface Entrada {
  id: number;
  titulo: string;
  valor: number;
  data: string;
  recorrente: number; // 0 = avulsa, 1 = recorrente
  categoria_id: number | null;
  criado_em: string;
}

export interface TemplateEntrada {
  id: number;
  descricao: string;
  valor: number;
  categoria_id: number | null;
}
