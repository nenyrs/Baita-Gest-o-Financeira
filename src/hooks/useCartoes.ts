import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import { Cartao } from '@/tipos/Cartao';
import * as repo from '@/repositorios/RepositorioCartoes';

export function useCartoes() {
  const { banco } = useBancoDados();
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!banco) return;
    setCarregando(true);
    const dados = await repo.listarCartoes(banco);
    setCartoes(dados);
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
    async (dados: Omit<Cartao, 'id' | 'criado_em'>) => {
      if (!banco) return;
      await repo.criarCartao(banco, dados);
      await carregar();
    },
    [banco, carregar]
  );

  const atualizar = useCallback(
    async (id: number, dados: Omit<Cartao, 'id' | 'criado_em'>) => {
      if (!banco) return;
      await repo.atualizarCartao(banco, id, dados);
      await carregar();
    },
    [banco, carregar]
  );

  const excluir = useCallback(
    async (id: number) => {
      if (!banco) return;
      await repo.excluirCartao(banco, id);
      await carregar();
    },
    [banco, carregar]
  );

  return { cartoes, carregando, criar, atualizar, excluir, recarregar: carregar };
}
