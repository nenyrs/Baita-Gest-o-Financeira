import * as SQLite from 'expo-sqlite';
import { Saida } from '@/tipos/Saida';

export async function listarSaidasDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string
): Promise<Saida[]> {
  return banco.getAllAsync<Saida>(
    `SELECT * FROM saidas
     WHERE strftime('%Y-%m', data) = ?
     ORDER BY data DESC`,
    [mesReferencia]
  );
}

export async function buscarSaida(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<Saida | null> {
  return banco.getFirstAsync<Saida>('SELECT * FROM saidas WHERE id = ?', [id]);
}

export async function criarSaida(
  banco: SQLite.SQLiteDatabase,
  dados: Omit<Saida, 'id' | 'criado_em'>
): Promise<number> {
  const resultado = await banco.runAsync(
    `INSERT INTO saidas (titulo, valor, data, categoria_id, metodo_pagamento, cartao_id, total_parcelas)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      dados.titulo,
      dados.valor,
      dados.data,
      dados.categoria_id,
      dados.metodo_pagamento,
      dados.cartao_id,
      dados.total_parcelas,
    ]
  );
  return resultado.lastInsertRowId;
}

export async function atualizarSaida(
  banco: SQLite.SQLiteDatabase,
  id: number,
  dados: Omit<Saida, 'id' | 'criado_em'>
): Promise<void> {
  await banco.runAsync(
    `UPDATE saidas SET titulo = ?, valor = ?, data = ?, categoria_id = ?,
     metodo_pagamento = ?, cartao_id = ?, total_parcelas = ? WHERE id = ?`,
    [
      dados.titulo,
      dados.valor,
      dados.data,
      dados.categoria_id,
      dados.metodo_pagamento,
      dados.cartao_id,
      dados.total_parcelas,
      id,
    ]
  );
}

export async function excluirSaida(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await banco.runAsync('DELETE FROM saidas WHERE id = ?', [id]);
}

export async function somarSaidasPixDebitoDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string
): Promise<number> {
  const resultado = await banco.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(valor), 0) as total FROM saidas
     WHERE strftime('%Y-%m', data) = ?
       AND metodo_pagamento IN ('pix', 'debito')`,
    [mesReferencia]
  );
  return resultado?.total ?? 0;
}

export interface GastoPorCategoria {
  nome: string;
  cor: string;
  valor: number;
}

export async function listarGastosPorCategoriaDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string
): Promise<GastoPorCategoria[]> {
  return banco.getAllAsync<GastoPorCategoria>(
    `SELECT
       COALESCE(c.nome, 'Sem Categoria') as nome,
       COALESCE(c.cor, '#90A4AE') as cor,
       SUM(s.valor) as valor
     FROM saidas s
     LEFT JOIN categorias c ON s.categoria_id = c.id
     WHERE strftime('%Y-%m', s.data) = ?
     GROUP BY s.categoria_id
     ORDER BY valor DESC`,
    [mesReferencia]
  );
}
