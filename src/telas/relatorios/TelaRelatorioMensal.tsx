import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRelatorios } from '@/hooks/useRelatorios';
import { ResumoMes } from '@/utilitarios/calculosSaldo';
import { formatarMoeda } from '@/utilitarios/formatadores';
import { CORES } from '@/utilitarios/constantes';

export default function TelaRelatorioMensal() {
  const { compararMeses } = useRelatorios();
  const [mesBase, setMesBase] = useState(new Date());
  const [resumo1, setResumo1] = useState<ResumoMes | null>(null);
  const [resumo2, setResumo2] = useState<ResumoMes | null>(null);

  const mes1Str = format(subMonths(mesBase, 1), 'yyyy-MM');
  const mes2Str = format(mesBase, 'yyyy-MM');
  const mes1Label = format(subMonths(mesBase, 1), 'MMM/yy', { locale: ptBR });
  const mes2Label = format(mesBase, 'MMM/yy', { locale: ptBR });

  useEffect(() => {
    compararMeses(mes1Str, mes2Str).then(({ resumo1: r1, resumo2: r2 }) => {
      setResumo1(r1);
      setResumo2(r2);
    });
  }, [mes1Str, mes2Str, compararMeses]);

  const renderLinha = (label: string, val1: number, val2: number) => (
    <View style={estilos.linha} key={label}>
      <Text style={estilos.linhaLabel}>{label}</Text>
      <Text style={estilos.linhaValor}>{formatarMoeda(val1)}</Text>
      <Text style={estilos.linhaValor}>{formatarMoeda(val2)}</Text>
    </View>
  );

  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.navegacaoMes}>
        <TouchableOpacity onPress={() => setMesBase((d) => subMonths(d, 1))}>
          <Ionicons name="chevron-back" size={24} color={CORES.primaria} />
        </TouchableOpacity>
        <Text style={estilos.tituloMes}>{mes1Label} vs {mes2Label}</Text>
        <TouchableOpacity onPress={() => setMesBase((d) => addMonths(d, 1))}>
          <Ionicons name="chevron-forward" size={24} color={CORES.primaria} />
        </TouchableOpacity>
      </View>
      {resumo1 && resumo2 && (
        <View style={estilos.tabela}>
          <View style={estilos.cabecalho}>
            <Text style={[estilos.linhaLabel, { fontWeight: '700' }]}>Item</Text>
            <Text style={[estilos.linhaValor, { fontWeight: '700' }]}>{mes1Label}</Text>
            <Text style={[estilos.linhaValor, { fontWeight: '700' }]}>{mes2Label}</Text>
          </View>
          {renderLinha('Entradas', resumo1.totalEntradas, resumo2.totalEntradas)}
          {renderLinha('Saidas (Pix/Deb)', resumo1.totalSaidasPix, resumo2.totalSaidasPix)}
          {renderLinha('Faturas', resumo1.totalFaturas, resumo2.totalFaturas)}
          {renderLinha('Contas Fixas', resumo1.totalContasFixas, resumo2.totalContasFixas)}
          <View style={estilos.divisor} />
          {renderLinha('Total Saidas', resumo1.totalSaidas, resumo2.totalSaidas)}
          {renderLinha('Saldo', resumo1.saldo, resumo2.saldo)}
        </View>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
    padding: 16,
    paddingTop: 16,
  },
  navegacaoMes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloMes: {
    fontSize: 18,
    fontWeight: '600',
    color: CORES.texto,
    textTransform: 'capitalize',
  },
  tabela: {
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    padding: 16,
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cabecalho: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    marginBottom: 8,
  },
  linha: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  linhaLabel: {
    flex: 1.5,
    fontSize: 14,
    color: CORES.texto,
  },
  linhaValor: {
    flex: 1,
    fontSize: 14,
    color: CORES.texto,
    textAlign: 'right',
  },
  divisor: {
    height: 1,
    backgroundColor: CORES.borda,
    marginVertical: 8,
  },
});
