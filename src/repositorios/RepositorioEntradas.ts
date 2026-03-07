import * as SQLite from 'expo-sqlite';
import { Entrada, TemplateEntrada } from '@/tipos/Entrada';

export async function listarEntradasDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string // 'YYYY-MM'
): Promise<Entrada[]> {
  return banco.getAllAsync<Entrada>(
    `SELECT * FROM entradas
     WHERE (recorrente = 0 AND strftime('%Y-%m', data) = ?)
        OR (recorrente = 1 AND data <= ? || '-31')
     ORDER BY data DESC`,
    [mesReferencia, mesReferencia]
  );
}

export async function buscarEntrada(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<Entrada | null> {
  return banco.getFirstAsync<Entrada>('SELECT * FROM entradas WHERE id = ?', [id]);
}

export async function criarEntrada(
  banco: SQLite.SQLiteDatabase,
  dados: Omit<Entrada, 'id' | 'criado_em'>
): Promise<number> {
  const resultado = await banco.runAsync(
    'INSERT INTO entradas (titulo, valor, data, recorrente, categoria_id) VALUES (?, ?, ?, ?, ?)',
    [dados.titulo, dados.valor, dados.data, dados.recorrente, dados.categoria_id]
  );
  return resultado.lastInsertRowId;
}

export async function atualizarEntrada(
  banco: SQLite.SQLiteDatabase,
  id: number,
  dados: Omit<Entrada, 'id' | 'criado_em'>
): Promise<void> {
  await banco.runAsync(
    'UPDATE entradas SET titulo = ?, valor = ?, data = ?, recorrente = ?, categoria_id = ? WHERE id = ?',
    [dados.titulo, dados.valor, dados.data, dados.recorrente, dados.categoria_id, id]
  );
}

export async function excluirEntrada(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await banco.runAsync('DELETE FROM entradas WHERE id = ?', [id]);
}

export async function somarEntradasDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string
): Promise<number> {
  const resultado = await banco.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(valor), 0) as total FROM entradas
     WHERE (recorrente = 0 AND strftime('%Y-%m', data) = ?)
        OR (recorrente = 1 AND data <= ? || '-31')`,
    [mesReferencia, mesReferencia]
  );
  return resultado?.total ?? 0;
}

// Templates
export async function listarTemplatesEntrada(
  banco: SQLite.SQLiteDatabase
): Promise<TemplateEntrada[]> {
  return banco.getAllAsync<TemplateEntrada>('SELECT * FROM templates_entrada ORDER BY descricao');
}

export async function criarTemplateEntrada(
  banco: SQLite.SQLiteDatabase,
  dados: Omit<TemplateEntrada, 'id'>
): Promise<number> {
  const resultado = await banco.runAsync(
    'INSERT INTO templates_entrada (descricao, valor, categoria_id) VALUES (?, ?, ?)',
    [dados.descricao, dados.valor, dados.categoria_id]
  );
  return resultado.lastInsertRowId;
}

export async function excluirTemplateEntrada(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await banco.runAsync('DELETE FROM templates_entrada WHERE id = ?', [id]);
}
