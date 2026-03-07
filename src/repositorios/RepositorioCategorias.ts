import * as SQLite from 'expo-sqlite';
import { Categoria, TipoCategoria } from '@/tipos/Categoria';

export async function listarCategorias(banco: SQLite.SQLiteDatabase, tipo?: TipoCategoria): Promise<Categoria[]> {
  if (tipo) {
    return banco.getAllAsync<Categoria>('SELECT * FROM categorias WHERE tipo = ? ORDER BY nome', [tipo]);
  }
  return banco.getAllAsync<Categoria>('SELECT * FROM categorias ORDER BY nome');
}

export async function buscarCategoria(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<Categoria | null> {
  return banco.getFirstAsync<Categoria>('SELECT * FROM categorias WHERE id = ?', [id]);
}

export async function criarCategoria(
  banco: SQLite.SQLiteDatabase,
  dados: { nome: string; cor: string; icone?: string; tipo?: TipoCategoria }
): Promise<number> {
  const resultado = await banco.runAsync(
    'INSERT INTO categorias (nome, cor, icone, tipo) VALUES (?, ?, ?, ?)',
    [dados.nome, dados.cor, dados.icone ?? null, dados.tipo ?? 'saida']
  );
  return resultado.lastInsertRowId;
}

export async function atualizarCategoria(
  banco: SQLite.SQLiteDatabase,
  id: number,
  dados: { nome: string; cor: string; icone?: string }
): Promise<void> {
  await banco.runAsync(
    'UPDATE categorias SET nome = ?, cor = ?, icone = ? WHERE id = ?',
    [dados.nome, dados.cor, dados.icone ?? null, id]
  );
}

export async function excluirCategoria(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await banco.runAsync('DELETE FROM categorias WHERE id = ?', [id]);
}
