import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { CORES } from '@/utilitarios/constantes';

interface CampoTextoProps extends TextInputProps {
  rotulo: string;
  erro?: string;
}

export default function CampoTexto({ rotulo, erro, style, ...props }: CampoTextoProps) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        style={[estilos.input, erro && estilos.inputErro, style]}
        placeholderTextColor={CORES.textoSecundario}
        {...props}
      />
      {erro && <Text style={estilos.textoErro}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: CORES.texto,
  },
  inputErro: {
    borderColor: CORES.erro,
  },
  textoErro: {
    fontSize: 12,
    color: CORES.erro,
    marginTop: 4,
  },
});
