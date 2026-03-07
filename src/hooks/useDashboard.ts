import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import { useMesSelecionado } from '@/contextos/ContextoMesSelecionado';
import { calcularResumoMes, calcularSaldoTransitado, ResumoMes } from '@/utilitarios/calculosSaldo';
import { gerarHistoricoContasFixas } from '@/repositorios/RepositorioContasFixas';
import { listarGastosPorCategoriaDoMes, GastoPorCategoria } from '@/repositorios/RepositorioSaidas';

export function useDashboard() {
  const { banco } = useBancoDados();
  const { mesFormatado, mesSelecionado } = useMesSelecionado();
  const [resumo, setResumo] = useState<ResumoMes | null>(null);
  const [saldoTransitado, setSaldoTransitado] = useState(0);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<GastoPorCategoria[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!banco) return;
    setCarregando(true);

    await gerarHistoricoContasFixas(banco, mesFormatado);

    const [resumoMes, saldoAnterior, gastos] = await Promise.all([
      calcularResumoMes(banco, mesFormatado),
      calcularSaldoTransitado(banco, mesSelecionado),
      listarGastosPorCategoriaDoMes(banco, mesFormatado),
    ]);

    setResumo(resumoMes);
    setSaldoTransitado(saldoAnterior);
    setGastosPorCategoria(gastos);
    setCarregando(false);
  }, [banco, mesFormatado, mesSelecionado]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return { resumo, saldoTransitado, gastosPorCategoria, carregando, recarregar: carregar };
}
