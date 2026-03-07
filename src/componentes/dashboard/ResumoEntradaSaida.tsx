import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatarMoeda } from '@/utilitarios/formatadores';

interface ResumoEntradaSaidaProps {
  totalEntradas: number;
  totalSaidas: number;
}

export default function ResumoEntradaSaida({
  totalEntradas,
  totalSaidas,
}: ResumoEntradaSaidaProps) {
  return (
    <View style={estilos.container}>
      {/* Card Entradas */}
      <LinearGradient
        colors={['#1565C0', '#2196F3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={estilos.cartao}
      >
        <View style={estilos.cartaoIconeContainer}>
          <View style={estilos.cartaoIcone}>
            <Ionicons name="arrow-up" size={18} color="#1565C0" />
          </View>
        </View>
        <Text style={estilos.cartaoLabel}>Entradas</Text>
        <Text style={estilos.cartaoValor}>{formatarMoeda(totalEntradas)}</Text>
      </LinearGradient>

      {/* Card Saidas */}
      <LinearGradient
        colors={['#7B1FA2', '#BA68C8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={estilos.cartao}
      >
        <View style={estilos.cartaoIconeContainer}>
          <View style={estilos.cartaoIcone}>
            <Ionicons name="arrow-down" size={18} color="#7B1FA2" />
          </View>
        </View>
        <Text style={estilos.cartaoLabel}>Saidas</Text>
        <Text style={estilos.cartaoValor}>{formatarMoeda(totalSaidas)}</Text>
      </LinearGradient>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  cartao: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cartaoIconeContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cartaoIcone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartaoLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  cartaoValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
});
