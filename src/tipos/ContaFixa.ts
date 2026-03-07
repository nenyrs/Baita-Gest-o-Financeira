import { MetodoPagamento } from './Saida';

export type TipoContaFixa = 'valor_exato' | 'valor_variavel';

export interface ContaFixa {
  id: number;
  titulo: string;
  tipo: TipoContaFixa;
  valor: number;
  dia_vencimento: number;
  categoria_id: number | null;
  metodo_pagamento: MetodoPagamento;
  cartao_id: number | null;
  ativa: number; // 0 ou 1
  criado_em: string;
}

export interface ContaFixaHistorico {
  id: number;
  conta_fixa_id: number;
  mes_referencia: string; // 'YYYY-MM'
  valor_real: number | null;
  valor_estimado: number;
  confirmado: number; // 0 ou 1
}
