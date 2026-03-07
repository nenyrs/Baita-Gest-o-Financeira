export type MetodoPagamento = 'pix' | 'debito' | 'credito';

export interface Saida {
  id: number;
  titulo: string;
  valor: number;
  data: string;
  categoria_id: number | null;
  metodo_pagamento: MetodoPagamento;
  cartao_id: number | null;
  total_parcelas: number;
  criado_em: string;
}

export interface Parcela {
  id: number;
  saida_id: number;
  cartao_id: number;
  numero: number;
  valor: number;
  mes_referencia: string; // 'YYYY-MM'
  paga: number; // 0 ou 1
}
