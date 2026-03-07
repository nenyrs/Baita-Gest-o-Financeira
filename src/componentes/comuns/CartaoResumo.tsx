import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import CartaoVidro from '@/componentes/comuns/CartaoVidro';
import { CORES } from '@/utilitarios/constantes';

interface CartaoResumoProps {
  titulo: string;
  valor: string;
  corValor?: string;
  icone?: ReactNode;
  estiloContainer?: ViewStyle;
}

export default function CartaoResumo({
  titulo,
  valor,
  corValor = CORES.texto,
  icone,
  estiloContainer,
}: CartaoResumoProps) {
  return (
    <CartaoVidro estiloContainer={estiloContainer}>
      <View style={estilos.cabecalho}>
        {icone}
        <Text style={estilos.titulo}>{titulo}</Text>
      </View>
      <Text style={[estilos.valor, { color: corValor }]}>{valor}</Text>
    </CartaoVidro>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 14,
    color: CORES.textoSecundario,
    fontWeight: '500',
  },
  valor: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
