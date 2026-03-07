import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMesSelecionado } from '@/contextos/ContextoMesSelecionado';
import { formatarMesAno } from '@/utilitarios/formatadores';
import { CORES } from '@/utilitarios/constantes';

interface SeletorMesProps {
  variante?: 'padrao' | 'claro';
}

export default function SeletorMes({ variante = 'padrao' }: SeletorMesProps) {
  const { mesSelecionado, voltarMes, avancarMes } = useMesSelecionado();
  const isClaro = variante === 'claro';

  return (
    <View style={[estilos.container, isClaro && estilos.containerClaro]}>
      <TouchableOpacity onPress={voltarMes} style={estilos.botao}>
        <Ionicons
          name="chevron-back"
          size={22}
          color={isClaro ? '#FFFFFF' : CORES.primaria}
        />
      </TouchableOpacity>
      <Text style={[estilos.texto, isClaro && estilos.textoClaro]}>
        {formatarMesAno(mesSelecionado)}
      </Text>
      <TouchableOpacity onPress={avancarMes} style={estilos.botao}>
        <Ionicons
          name="chevron-forward"
          size={22}
          color={isClaro ? '#FFFFFF' : CORES.primaria}
        />
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  containerClaro: {
    borderBottomWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginHorizontal: 0,
    paddingVertical: 8,
  },
  botao: {
    padding: 8,
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.texto,
    textTransform: 'capitalize',
  },
  textoClaro: {
    color: '#FFFFFF',
  },
});
