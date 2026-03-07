import * as SQLite from 'expo-sqlite';
import { somarEntradasDoMes } from '@/repositorios/RepositorioEntradas';
import { somarSaidasPixDebitoDoMes } from '@/repositorios/RepositorioSaidas';
import { somarFaturaDoMes } from '@/repositorios/RepositorioParcelas';
import { somarContasFixasDoMes } from '@/repositorios/RepositorioContasFixas';
import { format, subMonths } from 'date-fns';

export interface ResumoMes {
  totalEntradas: number;
  totalSaidasPix: number;
  totalFaturas: number;
  totalContasFixas: number;
  totalSaidas: number;
  saldo: number;
}

export async function calcularResumoMes(
  banco: SQLite.SQLiteDatabase,
  mesReferencia: string
): Promise<ResumoMes> {
  const [totalEntradas, totalSaidasPix, totalFaturas, totalContasFixas] = await Promise.all([
    somarEntradasDoMes(banco, mesReferencia),
    somarSaidasPixDebitoDoMes(banco, mesReferencia),
    somarFaturaDoMes(banco, mesReferencia),
    somarContasFixasDoMes(banco, mesReferencia),
  ]);

  const totalSaidas = totalSaidasPix + totalFaturas + totalContasFixas;
  const saldo = totalEntradas - totalSaidas;

  return {
    totalEntradas,
    totalSaidasPix,
    totalFaturas,
    totalContasFixas,
    totalSaidas,
    saldo,
  };
}

export async function calcularSaldoTransitado(
  banco: SQLite.SQLiteDatabase,
  mesSelecionado: Date
): Promise<number> {
  const mesAnterior = subMonths(mesSelecionado, 1);
  const mesAnteriorStr = format(mesAnterior, 'yyyy-MM');
  const resumo = await calcularResumoMes(banco, mesAnteriorStr);
  return resumo.saldo;
}
