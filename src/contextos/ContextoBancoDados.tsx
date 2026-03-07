import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { abrirBanco } from '@/banco/conexao';

interface ContextoBancoDadosType {
  banco: SQLite.SQLiteDatabase | null;
  carregando: boolean;
  erro: string | null;
}

const ContextoBancoDados = createContext<ContextoBancoDadosType>({
  banco: null,
  carregando: true,
  erro: null,
});

export function ProvedorBancoDados({ children }: { children: ReactNode }) {
  const [banco, setBanco] = useState<SQLite.SQLiteDatabase | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function inicializar() {
      try {
        const db = await abrirBanco();
        setBanco(db);
      } catch (e) {
        console.error('Erro ao abrir banco de dados:', e);
        setErro(e instanceof Error ? e.message : 'Erro desconhecido');
      } finally {
        setCarregando(false);
      }
    }
    inicializar();
  }, []);

  return (
    <ContextoBancoDados.Provider value={{ banco, carregando, erro }}>
      {children}
    </ContextoBancoDados.Provider>
  );
}

export function useBancoDados(): ContextoBancoDadosType {
  return useContext(ContextoBancoDados);
}
