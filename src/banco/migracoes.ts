import * as SQLite from 'expo-sqlite';

interface Migracao {
  versao: number;
  sql: string[];
}

const migracoes: Migracao[] = [
  {
    versao: 1,
    sql: [
      // Tabela de controle de migracoes
      `CREATE TABLE IF NOT EXISTS _migracoes (
        versao INTEGER PRIMARY KEY
      )`,

      // Categorias
      `CREATE TABLE IF NOT EXISTS categorias (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        nome      TEXT    NOT NULL UNIQUE,
        cor       TEXT    NOT NULL DEFAULT '#808080',
        icone     TEXT,
        criado_em TEXT    NOT NULL DEFAULT (datetime('now'))
      )`,

      // Categorias padrao
      `INSERT OR IGNORE INTO categorias (nome, cor, icone) VALUES
        ('Alimentacao', '#FF6B6B', 'fast-food'),
        ('Transporte', '#4ECDC4', 'car'),
        ('Moradia', '#45B7D1', 'home'),
        ('Lazer', '#96CEB4', 'game-controller'),
        ('Saude', '#FF8A65', 'medkit'),
        ('Educacao', '#7C4DFF', 'school'),
        ('Vestuario', '#F06292', 'shirt'),
        ('Servicos', '#FFD93D', 'construct'),
        ('Outros', '#90A4AE', 'ellipsis-horizontal')`,

      // Entradas
      `CREATE TABLE IF NOT EXISTS entradas (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo        TEXT    NOT NULL,
        valor         REAL    NOT NULL,
        data          TEXT    NOT NULL,
        recorrente    INTEGER NOT NULL DEFAULT 0,
        categoria_id  INTEGER,
        criado_em     TEXT    NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
      )`,

      // Templates de entrada
      `CREATE TABLE IF NOT EXISTS templates_entrada (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao     TEXT    NOT NULL,
        valor         REAL    NOT NULL,
        categoria_id  INTEGER,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
      )`,

      // Cartoes de credito
      `CREATE TABLE IF NOT EXISTS cartoes (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        nome            TEXT    NOT NULL,
        limite_total    REAL    NOT NULL,
        dia_vencimento  INTEGER NOT NULL,
        dia_fechamento  INTEGER NOT NULL,
        criado_em       TEXT    NOT NULL DEFAULT (datetime('now'))
      )`,

      // Saidas
      `CREATE TABLE IF NOT EXISTS saidas (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo            TEXT    NOT NULL,
        valor             REAL    NOT NULL,
        data              TEXT    NOT NULL,
        categoria_id      INTEGER,
        metodo_pagamento  TEXT    NOT NULL,
        cartao_id         INTEGER,
        total_parcelas    INTEGER NOT NULL DEFAULT 1,
        criado_em         TEXT    NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (categoria_id) REFERENCES categorias(id),
        FOREIGN KEY (cartao_id)    REFERENCES cartoes(id)
      )`,

      // Parcelas
      `CREATE TABLE IF NOT EXISTS parcelas (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        saida_id        INTEGER NOT NULL,
        cartao_id       INTEGER NOT NULL,
        numero          INTEGER NOT NULL,
        valor           REAL    NOT NULL,
        mes_referencia  TEXT    NOT NULL,
        paga            INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (saida_id)  REFERENCES saidas(id) ON DELETE CASCADE,
        FOREIGN KEY (cartao_id) REFERENCES cartoes(id)
      )`,

      // Contas fixas
      `CREATE TABLE IF NOT EXISTS contas_fixas (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo            TEXT    NOT NULL,
        tipo              TEXT    NOT NULL,
        valor             REAL    NOT NULL,
        dia_vencimento    INTEGER NOT NULL,
        categoria_id      INTEGER,
        metodo_pagamento  TEXT    NOT NULL DEFAULT 'pix',
        cartao_id         INTEGER,
        ativa             INTEGER NOT NULL DEFAULT 1,
        criado_em         TEXT    NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (categoria_id) REFERENCES categorias(id),
        FOREIGN KEY (cartao_id)    REFERENCES cartoes(id)
      )`,

      // Historico de contas fixas
      `CREATE TABLE IF NOT EXISTS contas_fixas_historico (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        conta_fixa_id   INTEGER NOT NULL,
        mes_referencia  TEXT    NOT NULL,
        valor_real      REAL,
        valor_estimado  REAL    NOT NULL,
        confirmado      INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (conta_fixa_id) REFERENCES contas_fixas(id) ON DELETE CASCADE
      )`,

      // Cofrinhos
      `CREATE TABLE IF NOT EXISTS cofrinhos (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        nome            TEXT    NOT NULL,
        banco           TEXT,
        valor_alocado   REAL    NOT NULL DEFAULT 0,
        rentabilidade   REAL    NOT NULL DEFAULT 0,
        criado_em       TEXT    NOT NULL DEFAULT (datetime('now'))
      )`,
    ],
  },
  {
    versao: 2,
    sql: [
      `ALTER TABLE categorias ADD COLUMN tipo TEXT NOT NULL DEFAULT 'saida'`,

      `INSERT OR IGNORE INTO categorias (nome, cor, icone, tipo) VALUES
        ('Salario', '#4CAF50', 'cash', 'entrada'),
        ('Freelance', '#66BB6A', 'briefcase', 'entrada'),
        ('Investimentos', '#2E7D32', 'trending-up', 'entrada'),
        ('Vendas', '#43A047', 'pricetag', 'entrada'),
        ('Outros Recebimentos', '#81C784', 'ellipsis-horizontal', 'entrada')`,
    ],
  },
];

export async function executarMigracoes(banco: SQLite.SQLiteDatabase): Promise<void> {
  // Garantir que a tabela de migracoes existe
  await banco.execAsync(
    `CREATE TABLE IF NOT EXISTS _migracoes (versao INTEGER PRIMARY KEY)`
  );

  // Buscar versao atual
  const resultado = await banco.getFirstAsync<{ versao: number }>(
    'SELECT MAX(versao) as versao FROM _migracoes'
  );
  const versaoAtual = resultado?.versao ?? 0;

  // Executar migracoes pendentes
  for (const migracao of migracoes) {
    if (migracao.versao > versaoAtual) {
      await banco.withTransactionAsync(async () => {
        for (const sql of migracao.sql) {
          await banco.execAsync(sql);
        }
        await banco.runAsync(
          'INSERT INTO _migracoes (versao) VALUES (?)',
          [migracao.versao]
        );
      });
      console.log(`Migracao ${migracao.versao} executada com sucesso`);
    }
  }
}
