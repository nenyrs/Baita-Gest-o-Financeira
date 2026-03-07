import * as SQLite from 'expo-sqlite';
import { ContaFixa, ContaFixaHistorico } from '@/tipos/ContaFixa';

export async function listarContasFixas(banco: SQLite.SQLiteDatabase): Promise<ContaFixa[]> {
  return banco.getAllAsync<ContaFixa>(
    'SELECT * FROM contas_fixas WHERE ativa = 1 ORDER BY titulo'
  );
}

export async function buscarContaFixa(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<ContaFixa | null> {
  return banco.getFirstAsync<ContaFixa>('SELECT * FROM contas_fixas WHERE id = ?', [id]);
}

export async function criarContaFixa(
  banco: SQLite.SQLiteDatabase,
  dados: Omit<ContaFixa, 'id' | 'criado_em'>
): Promise<number> {
  const resultado = await banco.runAsync(
    `INSERT INTO contas_fixas (titulo, tipo, valor, dia_vencimento, categoria_id, metodo_pagamento, cartao_id, ativa)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dados.titulo,
      dados.tipo,
      dados.valor,
      dados.dia_vencimento,
      dados.categoria_id,
      dados.metodo_pagamento,
      dados.cartao_id,
      dados.ativa,
    ]
  );
  return resultado.lastInsertRowId;
}

export async function atualizarContaFixa(
  banco: SQLite.SQLiteDatabase,
  id: number,
  dados: Partial<ContaFixa>
): Promise<void> {
  const campos: string[] = [];
  const valores: (string | number | null)[] = [];

  if (dados.titulo !== undefined) { campos.push('titulo = ?'); valores.push(dados.titulo); }
  if (dados.tipo !== undefined) { campos.push('tipo = ?'); valores.push(dados.tipo); }
  if (dados.valor !== undefined) { campos.push('valor = ?'); valores.push(dados.valor); }
  if (dados.dia_vencimento !== undefined) { campos.push('dia_vencimento = ?'); valores.push(dados.dia_vencimento); }
  if (dados.categoria_id !== undefined) { campos.push('categoria_id = ?'); valores.push(dados.categoria_id); }
  if (dados.metodo_pagamento !== undefined) { campos.push('metodo_pagamento = ?'); valores.push(dados.metodo_pagamento); }
  if (dados.cartao_id !== undefined) { campos.push('cartao_id = ?'); valores.push(dados.cartao_id); }
  if (dados.ativa !== undefined) { campos.push('ativa = ?'); valores.push(dados.ativa); }

  if (campos.length > 0) {
    valores.push(id);
    await banco.runAsync(
      `UPDATE contas_fixas SET ${campos.join(', ')} WHERE id = ?`,
      valores
    );
  }
}

export async function excluirContaFixa(
  banco: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await banco.runAsync('DELETE FROM contas_fixas WHERE id = ?', [id]);
}

// Historico
export async function buscarHistoricoMes(
  banco: SQLite.SQLiteDatabase,
  contaFixaId: number,
  mesReferencia: string
): Promise<ContaFixaHistorico | null> {
  return banco.getFirstAsync<ContaFixaHistorico>(
    'SELECT * FROM contas_fixas_historico WHERE conta_fixa_id = ? AND mes_referencia = ?',
    [contaFixaId, mesReferencia]
  );
}

export async function criarHistorico(
  banco: SQLite.SQLiteDatabase,
  dados: Omit<ContaFixaHistorico, 'id'>
): Promise<number> {
  const resultado = await banco.runAsync(
    `INSERT INTO contas_fixas_historico (conta_fixa_id, mes_referencia, valor_real, valor_estimado, confirmado)
     VALUES (?, ?, ?, ?, ?)`,
    [dados.conta_fixa_id, dados.mes_referencia, dados.valor_real, dados.valor_estimado, dados.confirmado]
  );
  return resultado.lastInsertRowId;
}

export async function confirmarHistorico(
  banco: SQLite.SQLiteDatabase,
  id: number,
  valorReal: number
): Promise<void> {
  await banco.runAsync(
    'UPDATE contas_fixas_historico SET valor_real = ?, confirmado = 1 WHERE id = ?',
    [valorReal, id]
  );
}

export async function buscarUltimoValorConfirmado(
  banco: SQLite.SQLiteDatabase,
  contaFixaId: number
): Promise<number | null> {
  const resultado = await banco.getFirstAsync<{ valor_real: number }>(
    `SELECT valor_real FROM contas_fixas_historico
     WHERE conta_fixa_id = ? AND confirmado = 1
     ORDER BY mes_referencia DESC LIMIT 1`,
    [contaFixaId]
  );
  return resultado?.valor_real ?? null;
}

export async function listarHistoricoDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string
): Promise<(ContaFixaHistorico & { titulo: string; tipo: string })[]> {
  return banco.getAllAsync(
    `SELECT h.*, cf.titulo, cf.tipo FROM contas_fixas_historico h
     JOIN contas_fixas cf ON cf.id = h.conta_fixa_id
     WHERE h.mes_referencia = ?
     ORDER BY cf.titulo`,
    [mesReferencia]
  );
}

export async function somarContasFixasDoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string
): Promise<number> {
  const resultado = await banco.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(COALESCE(valor_real, valor_estimado)), 0) as total
     FROM contas_fixas_historico WHERE mes_referencia = ?`,
    [mesReferencia]
  );
  return resultado?.total ?? 0;
}

export async function gerarHistoricoContasFixas(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string
): Promise<void> {
  const contasAtivas = await listarContasFixas(banco);

  for (const conta of contasAtivas) {
    const existente = await buscarHistoricoMes(banco, conta.id, mesReferencia);
    if (!existente) {
      let valorEstimado = conta.valor;

      if (conta.tipo === 'valor_variavel') {
        const ultimoValor = await buscarUltimoValorConfirmado(banco, conta.id);
        if (ultimoValor !== null) {
          valorEstimado = ultimoValor;
        }
      }

      await criarHistorico(banco, {
        conta_fixa_id: conta.id,
        mes_referencia: mesReferencia,
        valor_real: conta.tipo === 'valor_exato' ? conta.valor : null,
        valor_estimado: valorEstimado,
        confirmado: conta.tipo === 'valor_exato' ? 1 : 0,
      });
    }
  }
}
