import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { CORES } from '@/utilitarios/constantes';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  desabilitado?: boolean;
  estiloContainer?: ViewStyle;
  estiloTexto?: TextStyle;
}

export default function Botao({
  titulo,
  onPress,
  variante = 'primario',
  desabilitado = false,
  estiloContainer,
  estiloTexto,
}: BotaoProps) {
  const corFundo = {
    primario: CORES.primaria,
    secundario: CORES.secundaria,
    perigo: CORES.erro,
  }[variante];

  return (
    <TouchableOpacity
      style={[estilos.container, { backgroundColor: corFundo }, desabilitado && estilos.desabilitado, estiloContainer]}
      onPress={onPress}
      disabled={desabilitado}
      activeOpacity={0.7}
    >
      <Text style={[estilos.texto, estiloTexto]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  desabilitado: {
    opacity: 0.5,
  },
});
