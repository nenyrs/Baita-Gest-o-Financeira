import * as SQLite from 'expo-sqlite';
import { executarMigracoes } from './migracoes';

const NOME_BANCO = 'gestao_financeira.db';

let bancoInstancia: SQLite.SQLiteDatabase | null = null;

export async function abrirBanco(): Promise<SQLite.SQLiteDatabase> {
  if (bancoInstancia) {
    return bancoInstancia;
  }

  const banco = await SQLite.openDatabaseAsync(NOME_BANCO);

  // Habilitar WAL mode para melhor performance
  await banco.execAsync('PRAGMA journal_mode = WAL;');
  // Habilitar foreign keys
  await banco.execAsync('PRAGMA foreign_keys = ON;');

  await executarMigracoes(banco);

  bancoInstancia = banco;
  return banco;
}
