import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRelatorios } from '@/hooks/useRelatorios';
import { formatarMoeda } from '@/utilitarios/formatadores';
import { CORES } from '@/utilitarios/constantes';

export default function TelaRelatorioAnual() {
  const { resumoAnual } = useRelatorios();
  const [ano, setAno] = useState(new Date().getFullYear());
  const [dados, setDados] = useState<{ mes: string; entradas: number; saidas: number }[]>([]);

  useEffect(() => {
    resumoAnual(ano.toString()).then(setDados);
  }, [ano, resumoAnual]);

  const totalEntradas = dados.reduce((s, d) => s + d.entradas, 0);
  const totalSaidas = dados.reduce((s, d) => s + d.saidas, 0);

  const nomeMes = (mesStr: string) => {
    const [a, m] = mesStr.split('-');
    const data = new Date(parseInt(a), parseInt(m) - 1, 1);
    return format(data, 'MMMM', { locale: ptBR });
  };

  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.navegacaoAno}>
        <TouchableOpacity onPress={() => setAno((a) => a - 1)}>
          <Ionicons name="chevron-back" size={24} color={CORES.primaria} />
        </TouchableOpacity>
        <Text style={estilos.tituloAno}>{ano}</Text>
        <TouchableOpacity onPress={() => setAno((a) => a + 1)}>
          <Ionicons name="chevron-forward" size={24} color={CORES.primaria} />
        </TouchableOpacity>
      </View>
      <View style={estilos.resumoAnual}>
        <View style={estilos.resumoItem}>
          <Text style={estilos.resumoLabel}>Total Entradas</Text>
          <Text style={[estilos.resumoValor, { color: CORES.entradaCor }]}>{formatarMoeda(totalEntradas)}</Text>
        </View>
        <View style={estilos.resumoItem}>
          <Text style={estilos.resumoLabel}>Total Saidas</Text>
          <Text style={[estilos.resumoValor, { color: CORES.saidaCor }]}>{formatarMoeda(totalSaidas)}</Text>
        </View>
        <View style={estilos.resumoItem}>
          <Text style={estilos.resumoLabel}>Saldo Anual</Text>
          <Text style={[estilos.resumoValor, { color: totalEntradas - totalSaidas >= 0 ? CORES.entradaCor : CORES.saidaCor }]}>
            {formatarMoeda(totalEntradas - totalSaidas)}
          </Text>
        </View>
      </View>
      <View style={estilos.tabela}>
        <View style={estilos.cabecalho}>
          <Text style={[estilos.colMes, { fontWeight: '700' }]}>Mes</Text>
          <Text style={[estilos.colValor, { fontWeight: '700', color: CORES.texto }]}>Entradas</Text>
          <Text style={[estilos.colValor, { fontWeight: '700', color: CORES.texto }]}>Saidas</Text>
          <Text style={[estilos.colValor, { fontWeight: '700', color: CORES.texto }]}>Saldo</Text>
        </View>
        {dados.map((item) => (
          <View key={item.mes} style={estilos.linha}>
            <Text style={[estilos.colMes, { textTransform: 'capitalize' }]}>{nomeMes(item.mes)}</Text>
            <Text style={[estilos.colValor, { color: CORES.entradaCor }]}>{formatarMoeda(item.entradas)}</Text>
            <Text style={[estilos.colValor, { color: CORES.saidaCor }]}>{formatarMoeda(item.saidas)}</Text>
            <Text style={[estilos.colValor, { color: item.entradas - item.saidas >= 0 ? CORES.entradaCor : CORES.saidaCor }]}>
              {formatarMoeda(item.entradas - item.saidas)}
            </Text>
          </View>
        ))}
      </View>
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
  navegacaoAno: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloAno: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  resumoAnual: {
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  resumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumoLabel: {
    fontSize: 15,
    color: CORES.textoSecundario,
  },
  resumoValor: {
    fontSize: 16,
    fontWeight: '700',
  },
  tabela: {
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    padding: 16,
  },
  cabecalho: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    marginBottom: 4,
  },
  linha: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  colMes: {
    flex: 1.2,
    fontSize: 13,
    color: CORES.texto,
  },
  colValor: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
  },
});
