import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import { useMesSelecionado } from '@/contextos/ContextoMesSelecionado';
import { Saida } from '@/tipos/Saida';
import * as repoSaidas from '@/repositorios/RepositorioSaidas';
import * as repoParcelas from '@/repositorios/RepositorioParcelas';
import * as repoCartoes from '@/repositorios/RepositorioCartoes';
import { gerarParcelas } from '@/utilitarios/calculosFechamento';
import { stringParaData } from '@/utilitarios/formatadores';

export function useSaidas() {
  const { banco } = useBancoDados();
  const { mesFormatado } = useMesSelecionado();
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!banco) return;
    setCarregando(true);
    const dados = await repoSaidas.listarSaidasDoMes(banco, mesFormatado);
    setSaidas(dados);
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
    async (dados: Omit<Saida, 'id' | 'criado_em'>) => {
      if (!banco) return;

      const saidaId = await repoSaidas.criarSaida(banco, dados);

      // Se for credito ou debito com cartao, gerar parcelas (debito = 1 parcela respeitando fechamento)
      if ((dados.metodo_pagamento === 'credito' || dados.metodo_pagamento === 'debito') && dados.cartao_id && dados.total_parcelas > 0) {
        const cartao = await repoCartoes.buscarCartao(banco, dados.cartao_id);
        if (cartao) {
          const parcelas = gerarParcelas(
            saidaId,
            dados.cartao_id,
            dados.valor,
            dados.total_parcelas,
            stringParaData(dados.data),
            cartao.dia_fechamento
          );
          await repoParcelas.criarParcelas(banco, parcelas);
        }
      }

      await carregar();
    },
    [banco, carregar]
  );

  const atualizar = useCallback(
    async (id: number, dados: Omit<Saida, 'id' | 'criado_em'>) => {
      if (!banco) return;

      // Remove parcelas antigas e recria se necessario
      await repoParcelas.excluirParcelasPorSaida(banco, id);
      await repoSaidas.atualizarSaida(banco, id, dados);

      if ((dados.metodo_pagamento === 'credito' || dados.metodo_pagamento === 'debito') && dados.cartao_id && dados.total_parcelas > 0) {
        const cartao = await repoCartoes.buscarCartao(banco, dados.cartao_id);
        if (cartao) {
          const parcelas = gerarParcelas(
            id,
            dados.cartao_id,
            dados.valor,
            dados.total_parcelas,
            stringParaData(dados.data),
            cartao.dia_fechamento
          );
          await repoParcelas.criarParcelas(banco, parcelas);
        }
      }

      await carregar();
    },
    [banco, carregar]
  );

  const excluir = useCallback(
    async (id: number) => {
      if (!banco) return;
      await repoParcelas.excluirParcelasPorSaida(banco, id);
      await repoSaidas.excluirSaida(banco, id);
      await carregar();
    },
    [banco, carregar]
  );

  return { saidas, carregando, criar, atualizar, excluir, recarregar: carregar };
}
