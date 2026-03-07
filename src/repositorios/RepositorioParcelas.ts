import * as SQLite from 'expo-sqlite';
import { Parcela } from '@/tipos/Saida';

export async function listarParcelasDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string,
  cartaoId?: number
): Promise<Parcela[]> {
  if (cartaoId) {
    return banco.getAllAsync<Parcela>(
      `SELECT * FROM parcelas
       WHERE mes_referencia = ? AND cartao_id = ?
       ORDER BY saida_id, numero`,
      [mesReferencia, cartaoId]
    );
  }
  return banco.getAllAsync<Parcela>(
    `SELECT * FROM parcelas
     WHERE mes_referencia = ?
     ORDER BY cartao_id, saida_id, numero`,
    [mesReferencia]
  );
}

export async function criarParcelas(
  banco: SQLite.SQLiteDatabase,
  parcelas: Omit<Parcela, 'id'>[]
): Promise<void> {
  for (const parcela of parcelas) {
    await banco.runAsync(
      `INSERT INTO parcelas (saida_id, cartao_id, numero, valor, mes_referencia, paga)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        parcela.saida_id,
        parcela.cartao_id,
        parcela.numero,
        parcela.valor,
        parcela.mes_referencia,
        parcela.paga,
      ]
    );
  }
}

export async function marcarParcelaPaga(
  banco: SQLite.SQLiteDatabase,
  id: number,
  paga: boolean
): Promise<void> {
  await banco.runAsync(
    'UPDATE parcelas SET paga = ? WHERE id = ?',
    [paga ? 1 : 0, id]
  );
}

export async function somarFaturaDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string,
  cartaoId?: number
): Promise<number> {
  if (cartaoId) {
    const resultado = await banco.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(valor), 0) as total FROM parcelas
       WHERE mes_referencia = ? AND cartao_id = ?`,
      [mesReferencia, cartaoId]
    );
    return resultado?.total ?? 0;
  }
  const resultado = await banco.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(valor), 0) as total FROM parcelas
     WHERE mes_referencia = ?`,
    [mesReferencia]
  );
  return resultado?.total ?? 0;
}

export async function excluirParcelasPorSaida(
  banco: SQLite.SQLiteDatabase,
  saidaId: number
): Promise<void> {
  await banco.runAsync('DELETE FROM parcelas WHERE saida_id = ?', [saidaId]);
}
