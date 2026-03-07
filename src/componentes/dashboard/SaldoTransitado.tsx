import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatarMoeda } from '@/utilitarios/formatadores';
import { CORES } from '@/utilitarios/constantes';

interface SaldoTransitadoProps {
  valor: number;
}

export default function SaldoTransitado({ valor }: SaldoTransitadoProps) {
  const positivo = valor >= 0;

  return (
    <View style={estilos.container}>
      <View style={estilos.iconeContainer}>
        <View style={[estilos.icone, { backgroundColor: positivo ? 'rgba(76,175,80,0.1)' : 'rgba(239,83,80,0.1)' }]}>
          <Ionicons
            name={positivo ? 'trending-up' : 'trending-down'}
            size={20}
            color={positivo ? CORES.entradaCor : CORES.saidaCor}
          />
        </View>
      </View>
      <View style={estilos.info}>
        <Text style={estilos.label}>Saldo do Mes Anterior</Text>
        <Text style={[estilos.valor, { color: positivo ? CORES.entradaCor : CORES.saidaCor }]}>
          {formatarMoeda(valor)}
        </Text>
      </View>
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
    marginTop: 2,
  },
});
