import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import { Cofrinho } from '@/tipos/Cofrinho';
import * as repo from '@/repositorios/RepositorioCofrinhos';

export function useCofrinhos() {
  const { banco } = useBancoDados();
  const [cofrinhos, setCofrinhos] = useState<Cofrinho[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!banco) return;
    setCarregando(true);
    const dados = await repo.listarCofrinhos(banco);
    setCofrinhos(dados);
    setCarregando(false);
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
    async (dados: Omit<Cofrinho, 'id' | 'criado_em'>) => {
      if (!banco) return;
      await repo.criarCofrinho(banco, dados);
      await carregar();
    },
    [banco, carregar]
  );

  const atualizar = useCallback(
    async (id: number, dados: Omit<Cofrinho, 'id' | 'criado_em'>) => {
      if (!banco) return;
      await repo.atualizarCofrinho(banco, id, dados);
      await carregar();
    },
    [banco, carregar]
  );

  const excluir = useCallback(
    async (id: number) => {
      if (!banco) return;
      await repo.excluirCofrinho(banco, id);
      await carregar();
    },
    [banco, carregar]
  );

  return { cofrinhos, carregando, criar, atualizar, excluir, recarregar: carregar };
}
