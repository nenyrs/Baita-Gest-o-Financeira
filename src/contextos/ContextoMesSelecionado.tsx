import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { format, addMonths, subMonths } from 'date-fns';

interface ContextoMesSelecionadoType {
  mesSelecionado: Date;
  mesFormatado: string; // 'YYYY-MM'
  avancarMes: () => void;
  voltarMes: () => void;
  irParaMes: (data: Date) => void;
}

const ContextoMesSelecionado = createContext<ContextoMesSelecionadoType>({
  mesSelecionado: new Date(),
  mesFormatado: format(new Date(), 'yyyy-MM'),
  avancarMes: () => {},
  voltarMes: () => {},
  irParaMes: () => {},
});

export function ProvedorMesSelecionado({ children }: { children: ReactNode }) {
  const [mesSelecionado, setMesSelecionado] = useState(new Date());

  const avancarMes = useCallback(() => {
    setMesSelecionado((atual) => addMonths(atual, 1));
  }, []);

  const voltarMes = useCallback(() => {
    setMesSelecionado((atual) => subMonths(atual, 1));
  }, []);

  const irParaMes = useCallback((data: Date) => {
    setMesSelecionado(data);
  }, []);

  const mesFormatado = format(mesSelecionado, 'yyyy-MM');

  return (
    <ContextoMesSelecionado.Provider
      value={{ mesSelecionado, mesFormatado, avancarMes, voltarMes, irParaMes }}
    >
      {children}
    </ContextoMesSelecionado.Provider>
  );
}

export function useMesSelecionado(): ContextoMesSelecionadoType {
  return useContext(ContextoMesSelecionado);
}
