import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from '@/utilitarios/constantes';
import { formatarMoeda } from '@/utilitarios/formatadores';
import Svg, { G, Path, Circle } from 'react-native-svg';

interface DadoCategoria {
  nome: string;
  cor: string;
  valor: number;
}

interface GraficoCategoriasProps {
  dados: DadoCategoria[];
}

function gerarCaminhoFatia(
  cx: number, cy: number, r: number,
  anguloInicio: number, anguloFim: number
): string {
  const inicioRad = (anguloInicio - 90) * (Math.PI / 180);
  const fimRad = (anguloFim - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(inicioRad);
  const y1 = cy + r * Math.sin(inicioRad);
  const x2 = cx + r * Math.cos(fimRad);
  const y2 = cy + r * Math.sin(fimRad);
  const arcoGrande = anguloFim - anguloInicio > 180 ? 1 : 0;

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${arcoGrande} 1 ${x2} ${y2} Z`;
}

export default function GraficoCategorias({ dados }: GraficoCategoriasProps) {
  const [modalVisivel, setModalVisivel] = useState(false);

  if (dados.length === 0) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Gastos por Categoria</Text>
        <Text style={estilos.textoVazio}>Nenhum dado disponivel</Text>
      </View>
    );
  }

  const total = dados.reduce((s, d) => s + d.valor, 0);
  const tamanho = 160;
  const cx = tamanho / 2;
  const cy = tamanho / 2;
  const raio = 70;
  const raioInterno = 42;

  let anguloAcumulado = 0;
  const fatias = dados.map((item) => {
    const angulo = total > 0 ? (item.valor / total) * 360 : 0;
    const inicio = anguloAcumulado;
    anguloAcumulado += angulo;
    return { ...item, inicio, fim: anguloAcumulado };
  });

  return (
    <>
      <TouchableOpacity
        style={estilos.container}
        onPress={() => setModalVisivel(true)}
        activeOpacity={0.7}
      >
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Gastos por Categoria</Text>
          <Ionicons name="chevron-forward" size={18} color={CORES.textoSecundario} />
        </View>

        <View style={estilos.graficoPizzaContainer}>
          {/* Grafico Pizza (Donut) */}
          <Svg width={tamanho} height={tamanho}>
            <G>
              {fatias.map((fatia) => {
                if (fatia.fim - fatia.inicio < 0.5) return null;
                return (
                  <Path
                    key={fatia.nome}
                    d={gerarCaminhoFatia(cx, cy, raio, fatia.inicio, fatia.fim)}
                    fill={fatia.cor}
                  />
                );
              })}
              {/* Circulo interno para efeito donut */}
              <Circle cx={cx} cy={cy} r={raioInterno} fill="#FFFFFF" />
            </G>
          </Svg>

          {/* Total no centro */}
          <View style={estilos.totalCentro}>
            <Text style={estilos.totalLabel}>Total</Text>
            <Text style={estilos.totalValor}>{formatarMoeda(total)}</Text>
          </View>
        </View>

        {/* Legenda resumida */}
        <View style={estilos.legendaResumo}>
          {dados.slice(0, 3).map((item) => (
            <View key={item.nome} style={estilos.legendaItem}>
              <View style={[estilos.legendaCor, { backgroundColor: item.cor }]} />
              <Text style={estilos.legendaNome} numberOfLines={1}>{item.nome}</Text>
            </View>
          ))}
          {dados.length > 3 && (
            <Text style={estilos.legendaMais}>+{dados.length - 3}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Modal Detalhado */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalConteudo}>
            <View style={estilos.modalCabecalho}>
              <Text style={estilos.modalTitulo}>Gastos por Categoria</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={24} color={CORES.texto} />
              </TouchableOpacity>
            </View>

            <View style={estilos.modalTotalContainer}>
              <Text style={estilos.modalTotalLabel}>Total de Gastos</Text>
              <Text style={estilos.modalTotalValor}>{formatarMoeda(total)}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {dados.map((item) => {
                const percentual = total > 0 ? ((item.valor / total) * 100).toFixed(1) : '0.0';
                return (
                  <View key={item.nome} style={estilos.modalItem}>
                    <View style={estilos.modalItemEsquerda}>
                      <View style={[estilos.modalItemCor, { backgroundColor: item.cor }]} />
                      <View>
                        <Text style={estilos.modalItemNome}>{item.nome}</Text>
                        <Text style={estilos.modalItemPercentual}>{percentual}%</Text>
                      </View>
                    </View>
                    <Text style={estilos.modalItemValor}>{formatarMoeda(item.valor)}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '700',
    color: CORES.texto,
  },
  textoVazio: {
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: 'center',
    paddingVertical: 16,
  },
  graficoPizzaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  totalCentro: {
    position: 'absolute',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: CORES.textoSecundario,
  },
  totalValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  legendaResumo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendaCor: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendaNome: {
    fontSize: 13,
    color: CORES.texto,
    fontWeight: '500',
  },
  legendaMais: {
    fontSize: 13,
    color: CORES.textoSecundario,
    fontWeight: '600',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
  },
  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  modalTotalContainer: {
    alignItems: 'center',
    backgroundColor: CORES.fundo,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  modalTotalLabel: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginBottom: 4,
  },
  modalTotalValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CORES.saidaCor,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  modalItemEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalItemCor: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  modalItemNome: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.texto,
  },
  modalItemPercentual: {
    fontSize: 12,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  modalItemValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CORES.texto,
  },
});
