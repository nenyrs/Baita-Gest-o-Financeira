import { useState, useCallback } from 'react';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import { calcularResumoMes, ResumoMes } from '@/utilitarios/calculosSaldo';

interface GastoCategoria {
  nome: string;
  cor: string;
  total: number;
}

export function useRelatorios() {
  const { banco } = useBancoDados();

  const compararMeses = useCallback(
    async (mes1: string, mes2: string): Promise<{ resumo1: ResumoMes; resumo2: ResumoMes }> => {
      if (!banco) throw new Error('Banco nao inicializado');
      const [resumo1, resumo2] = await Promise.all([
        calcularResumoMes(banco, mes1),
        calcularResumoMes(banco, mes2),
      ]);
      return { resumo1, resumo2 };
    },
    [banco]
  );

  const gastosPorCategoria = useCallback(
    async (mesReferencia: string): Promise<GastoCategoria[]> => {
      if (!banco) return [];
      const dados = await banco.getAllAsync<GastoCategoria>(
        `SELECT c.nome, c.cor, COALESCE(SUM(s.valor), 0) as total
         FROM saidas s
         LEFT JOIN categorias c ON c.id = s.categoria_id
         WHERE strftime('%Y-%m', s.data) = ?
         GROUP BY s.categoria_id
         HAVING total > 0
         ORDER BY total DESC`,
        [mesReferencia]
      );
      return dados;
    },
    [banco]
  );

  const resumoAnual = useCallback(
    async (ano: string): Promise<{ mes: string; entradas: number; saidas: number }[]> => {
      if (!banco) return [];
      const meses = [];
      for (let m = 1; m <= 12; m++) {
        const mesStr = `${ano}-${m.toString().padStart(2, '0')}`;
        const resumo = await calcularResumoMes(banco, mesStr);
        meses.push({
          mes: mesStr,
          entradas: resumo.totalEntradas,
          saidas: resumo.totalSaidas,
        });
      }
      return meses;
    },
    [banco]
  );

  return { compararMeses, gastosPorCategoria, resumoAnual };
}
