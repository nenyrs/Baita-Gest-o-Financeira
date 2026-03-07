import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import { useMesSelecionado } from '@/contextos/ContextoMesSelecionado';
import { Entrada, TemplateEntrada } from '@/tipos/Entrada';
import * as repo from '@/repositorios/RepositorioEntradas';

export function useEntradas() {
  const { banco } = useBancoDados();
  const { mesFormatado } = useMesSelecionado();
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!banco) return;
    setCarregando(true);
    const dados = await repo.listarEntradasDoMes(banco, mesFormatado);
    setEntradas(dados);
    setCarregando(false);
  }, [banco, mesFormatado]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const criar = useCallback(
    async (dados: Omit<Entrada, 'id' | 'criado_em'>) => {
      if (!banco) return;
      await repo.criarEntrada(banco, dados);
      await carregar();
    },
    [banco, carregar]
  );

  const atualizar = useCallback(
    async (id: number, dados: Omit<Entrada, 'id' | 'criado_em'>) => {
      if (!banco) return;
      await repo.atualizarEntrada(banco, id, dados);
      await carregar();
    },
    [banco, carregar]
  );

  const excluir = useCallback(
    async (id: number) => {
      if (!banco) return;
      await repo.excluirEntrada(banco, id);
      await carregar();
    },
    [banco, carregar]
  );

  return { entradas, carregando, criar, atualizar, excluir, recarregar: carregar };
}

export function useTemplatesEntrada() {
  const { banco } = useBancoDados();
  const [templates, setTemplates] = useState<TemplateEntrada[]>([]);

  const carregar = useCallback(async () => {
    if (!banco) return;
    const dados = await repo.listarTemplatesEntrada(banco);
    setTemplates(dados);
  }, [banco]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const criar = useCallback(
    async (dados: Omit<TemplateEntrada, 'id'>) => {
      if (!banco) return;
      await repo.criarTemplateEntrada(banco, dados);
      await carregar();
    },
    [banco, carregar]
  );

  const excluir = useCallback(
    async (id: number) => {
      if (!banco) return;
      await repo.excluirTemplateEntrada(banco, id);
      await carregar();
    },
    [banco, carregar]
  );

  return { templates, criar, excluir, recarregar: carregar };
}
