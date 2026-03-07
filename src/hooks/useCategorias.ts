import { useState, useEffect, useCallback } from 'react';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import { Categoria, TipoCategoria } from '@/tipos/Categoria';
import * as repo from '@/repositorios/RepositorioCategorias';

export function useCategorias(tipo?: TipoCategoria) {
  const { banco } = useBancoDados();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!banco) return;
    setCarregando(true);
    const dados = await repo.listarCategorias(banco, tipo);
    setCategorias(dados);
    setCarregando(false);
  }, [banco, tipo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const criar = useCallback(async (dados: { nome: string; cor: string; icone?: string; tipo?: TipoCategoria }) => {
    if (!banco) return;
    await repo.criarCategoria(banco, dados);
    await carregar();
  }, [banco, carregar]);

  const atualizar = useCallback(async (id: number, dados: { nome: string; cor: string; icone?: string }) => {
    if (!banco) return;
    await repo.atualizarCategoria(banco, id, dados);
    await carregar();
  }, [banco, carregar]);

  const excluir = useCallback(async (id: number) => {
    if (!banco) return;
    await repo.excluirCategoria(banco, id);
    await carregar();
  }, [banco, carregar]);

  return { categorias, carregando, recarregar: carregar, criar, atualizar, excluir };
}
