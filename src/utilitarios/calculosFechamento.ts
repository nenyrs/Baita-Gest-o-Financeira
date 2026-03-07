import { format, addMonths } from 'date-fns';

/**
 * Determina em qual mes a parcela cai na fatura do cartao.
 *
 * Regra: se a compra foi feita APOS o dia de fechamento,
 * a primeira parcela cai na fatura do mes seguinte.
 * Se foi feita ANTES ou NO dia de fechamento, cai no mes atual.
 *
 * @param dataCompra - Data da compra (Date)
 * @param diaFechamento - Dia de fechamento do cartao (1-31)
 * @param numeroParcela - Numero da parcela (1-based)
 * @returns string no formato 'YYYY-MM'
 */
export function calcularMesReferenciaParcela(
  dataCompra: Date,
  diaFechamento: number,
  numeroParcela: number
): string {
  const diaCompra = dataCompra.getDate();

  // Se comprou APOS o fechamento, primeira parcela vai pro mes seguinte
  let mesesAdicionais = numeroParcela - 1;
  if (diaCompra > diaFechamento) {
    mesesAdicionais += 1;
  }

  const mesFatura = addMonths(dataCompra, mesesAdicionais);
  return format(mesFatura, 'yyyy-MM');
}

/**
 * Gera a lista de parcelas com seus respectivos meses de referencia.
 */
export function gerarParcelas(
  saidaId: number,
  cartaoId: number,
  valorTotal: number,
  totalParcelas: number,
  dataCompra: Date,
  diaFechamento: number
): {
  saida_id: number;
  cartao_id: number;
  numero: number;
  valor: number;
  mes_referencia: string;
  paga: number;
}[] {
  const valorParcela = Math.round((valorTotal / totalParcelas) * 100) / 100;
  const parcelas = [];

  for (let i = 1; i <= totalParcelas; i++) {
    // Na ultima parcela, ajusta centavos para bater o total
    const valor = i === totalParcelas
      ? Math.round((valorTotal - valorParcela * (totalParcelas - 1)) * 100) / 100
      : valorParcela;

    parcelas.push({
      saida_id: saidaId,
      cartao_id: cartaoId,
      numero: i,
      valor,
      mes_referencia: calcularMesReferenciaParcela(dataCompra, diaFechamento, i),
      paga: 0,
    });
  }

  return parcelas;
}
