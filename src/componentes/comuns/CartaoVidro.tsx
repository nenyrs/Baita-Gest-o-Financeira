import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { CORES } from '@/utilitarios/constantes';

interface CartaoVidroProps {
  children: ReactNode;
  intensidade?: number;
  estiloContainer?: ViewStyle;
}

export default function CartaoVidro({
  children,
  intensidade,
  estiloContainer,
}: CartaoVidroProps) {
  return (
    <View style={[estilos.container, estiloContainer]}>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
});
