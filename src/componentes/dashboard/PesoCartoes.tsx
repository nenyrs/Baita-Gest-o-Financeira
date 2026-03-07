import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatarMoeda } from '@/utilitarios/formatadores';
import { CORES } from '@/utilitarios/constantes';

interface PesoCartoesProps {
  totalFaturas: number;
}

export default function PesoCartoes({ totalFaturas }: PesoCartoesProps) {
  return (
    <View style={estilos.container}>
      <View style={estilos.iconeContainer}>
        <View style={estilos.icone}>
          <Ionicons name="card" size={20} color={CORES.primaria} />
        </View>
      </View>
      <View style={estilos.info}>
        <Text style={estilos.label}>Faturas dos Cartoes</Text>
        <Text style={estilos.valor}>{formatarMoeda(totalFaturas)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={CORES.textoSecundario} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconeContainer: {
    marginRight: 14,
  },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(33,150,243,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: CORES.textoSecundario,
    fontWeight: '500',
  },
  valor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES.saidaCor,
    marginTop: 2,
  },
});
