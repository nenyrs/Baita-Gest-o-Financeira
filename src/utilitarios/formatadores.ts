import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatarData(data: string): string {
  const dataObj = parse(data, 'yyyy-MM-dd', new Date());
  return format(dataObj, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatarMesAno(data: Date): string {
  return format(data, 'MMMM yyyy', { locale: ptBR });
}

export function formatarMesAnoCurto(data: Date): string {
  return format(data, 'MMM/yy', { locale: ptBR });
}

export function formatarPorcentagem(valor: number): string {
  return `${valor.toFixed(2)}%`;
}

export function dataParaString(data: Date): string {
  return format(data, 'yyyy-MM-dd');
}

export function stringParaData(data: string): Date {
  return parse(data, 'yyyy-MM-dd', new Date());
}
