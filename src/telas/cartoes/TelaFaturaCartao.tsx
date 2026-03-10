import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import * as repoParcelas from '@/repositorios/RepositorioParcelas';
import * as repoSaidas from '@/repositorios/RepositorioSaidas';
import { Parcela } from '@/tipos/Saida';
import { AbaCartoesParams } from '@/tipos/Navegacao';
import { formatarMoeda } from '@/utilitarios/formatadores';
import { CORES } from '@/utilitarios/constantes';

type RotaFatura = RouteProp<AbaCartoesParams, 'TelaFaturaCartao'>;

interface ParcelaComTitulo extends Parcela {
  tituloSaida: string;
  totalParcelas: number;
}

export default function TelaFaturaCartao() {
  const rota = useRoute<RotaFatura>();
  const { cartaoId, mesReferencia } = rota.params;
  const { banco } = useBancoDados();
  const [parcelas, setParcelas] = useState<ParcelaComTitulo[]>([]);
  const [totalFatura, setTotalFatura] = useState(0);

  const carregar = useCallback(async () => {
    if (!banco) return;
    const parcelasBase = await repoParcelas.listarParcelasDoMes(banco, mesReferencia, cartaoId);
    const comTitulo: ParcelaComTitulo[] = [];
    for (const p of parcelasBase) {
      const saida = await repoSaidas.buscarSaida(banco, p.saida_id);
      comTitulo.push({ ...p, tituloSaida: saida?.titulo ?? 'Desconhecido', totalParcelas: saida?.total_parcelas ?? 1 });
    }
    setParcelas(comTitulo);
    const total = await repoParcelas.somarFaturaDoMes(banco, mesReferencia, cartaoId);
    setTotalFatura(total);
  }, [banco, cartaoId, mesReferencia]);

  useEffect(() => { carregar(); }, [carregar]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalhoFatura}>
        <Text style={estilos.labelTotal}>Total da Fatura</Text>
        <Text style={estilos.valorTotal}>{formatarMoeda(totalFatura)}</Text>
        <Text style={estilos.mesRef}>{mesReferencia}</Text>
      </View>
      <FlatList
        data={parcelas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhuma parcela neste mes</Text>}
        renderItem={({ item }) => (
          <View style={estilos.itemParcela}>
            <View>
              <Text style={estilos.tituloParcela}>{item.tituloSaida}</Text>
              <Text style={estilos.infoParcela}>Parcela {item.numero}/{item.totalParcelas}</Text>
            </View>
            <Text style={estilos.valorParcela}>{formatarMoeda(item.valor)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  cabecalhoFatura: {
    backgroundColor: CORES.primaria,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  labelTotal: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  valorTotal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  mesRef: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  textoVazio: {
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: 40,
  },
  itemParcela: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tituloParcela: {
    fontSize: 16,
    fontWeight: '500',
    color: CORES.texto,
  },
  infoParcela: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  valorParcela: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.saidaCor,
  },
});
