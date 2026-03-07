import * as SQLite from 'expo-sqlite';
import { Cartao } from '@/tipos/Cartao';

export async function listarCartoes(banco: SQLite.SQLiteDatabase): Promise<Cartao[]> {
  return banco.getAllAsync<Cartao>('SELECT * FROM cartoes ORDER BY nome');
}

export async function buscarCartao(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<Cartao | null> {
  return banco.getFirstAsync<Cartao>('SELECT * FROM cartoes WHERE id = ?', [id]);
}

export async function criarCartao(
  banco: SQLite.SQLiteDatabase,
  dados: Omit<Cartao, 'id' | 'criado_em'>
): Promise<number> {
  const resultado = await banco.runAsync(
    'INSERT INTO cartoes (nome, limite_total, dia_vencimento, dia_fechamento) VALUES (?, ?, ?, ?)',
    [dados.nome, dados.limite_total, dados.dia_vencimento, dados.dia_fechamento]
  );
  return resultado.lastInsertRowId;
}

export async function atualizarCartao(
  banco: SQLite.SQLiteDatabase,
  id: number,
  dados: Omit<Cartao, 'id' | 'criado_em'>
): Promise<void> {
  await banco.runAsync(
    'UPDATE cartoes SET nome = ?, limite_total = ?, dia_vencimento = ?, dia_fechamento = ? WHERE id = ?',
    [dados.nome, dados.limite_total, dados.dia_vencimento, dados.dia_fechamento, id]
  );
}

export async function excluirCartao(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await banco.runAsync('DELETE FROM cartoes WHERE id = ?', [id]);
}

export async function buscarLimiteUsado(
  banco: SQLite.SQLiteDatabase,
  cartaoId: number
): Promise<number> {
  const resultado = await banco.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(valor), 0) as total FROM parcelas
     WHERE cartao_id = ? AND paga = 0`,
    [cartaoId]
  );
  return resultado?.total ?? 0;
}
