import * as SQLite from 'expo-sqlite';
import { Cofrinho } from '@/tipos/Cofrinho';

export async function listarCofrinhos(banco: SQLite.SQLiteDatabase): Promise<Cofrinho[]> {
  return banco.getAllAsync<Cofrinho>('SELECT * FROM cofrinhos ORDER BY nome');
}

export async function buscarCofrinho(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<Cofrinho | null> {
  return banco.getFirstAsync<Cofrinho>('SELECT * FROM cofrinhos WHERE id = ?', [id]);
}

export async function criarCofrinho(
  banco: SQLite.SQLiteDatabase,
  dados: Omit<Cofrinho, 'id' | 'criado_em'>
): Promise<number> {
  const resultado = await banco.runAsync(
    'INSERT INTO cofrinhos (nome, banco, valor_alocado, rentabilidade) VALUES (?, ?, ?, ?)',
    [dados.nome, dados.banco, dados.valor_alocado, dados.rentabilidade]
  );
  return resultado.lastInsertRowId;
}

export async function atualizarCofrinho(
  banco: SQLite.SQLiteDatabase,
  id: number,
  dados: Omit<Cofrinho, 'id' | 'criado_em'>
): Promise<void> {
  await banco.runAsync(
    'UPDATE cofrinhos SET nome = ?, banco = ?, valor_alocado = ?, rentabilidade = ? WHERE id = ?',
    [dados.nome, dados.banco, dados.valor_alocado, dados.rentabilidade, id]
  );
}

export async function excluirCofrinho(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await banco.runAsync('DELETE FROM cofrinhos WHERE id = ?', [id]);
}

export async function somarTotalCofrinhos(
  banco: SQLite.SQLiteDatabase
): Promise<number> {
  const resultado = await banco.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(valor_alocado), 0) as total FROM cofrinhos'
  );
  return resultado?.total ?? 0;
}
