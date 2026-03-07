import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { CORES } from '@/utilitarios/constantes';

interface FundoAppProps {
  children: ReactNode;
}

export default function FundoApp({ children }: FundoAppProps) {
  return <View style={estilos.container}>{children}</View>;
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
});
