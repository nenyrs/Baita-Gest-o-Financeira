import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from '@/utilitarios/constantes';

export default function BadgeEstimativa() {
  return (
    <View style={estilos.container}>
      <Ionicons name="alert-circle" size={14} color={CORES.estimativaCor} />
      <Text style={estilos.texto}>Estimativa</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  texto: {
    fontSize: 11,
    color: CORES.estimativaCor,
    fontWeight: '600',
  },
});
