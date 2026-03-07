export type AbaDashboardParams = {
  TelaDashboard: undefined;
  TelaConfiguracoes: undefined;
};

export type AbaEntradasParams = {
  TelaListaEntradas: undefined;
  TelaFormEntrada: { id?: number } | undefined;
  TelaTemplatesEntrada: undefined;
};

export type AbaSaidasParams = {
  TelaListaSaidas: undefined;
  TelaFormSaida: { id?: number } | undefined;
  TelaContasFixas: undefined;
};

export type AbaCartoesParams = {
  TelaListaCartoes: undefined;
  TelaFormCartao: { id?: number } | undefined;
  TelaFaturaCartao: { cartaoId: number; mesReferencia: string };
};

export type AbaMaisParams = {
  TelaListaCofrinhos: undefined;
  TelaFormCofrinho: { id?: number } | undefined;
  TelaRelatorioMensal: undefined;
  TelaRelatorioAnual: undefined;
};

export type TabParams = {
  AbaDashboard: undefined;
  AbaEntradas: undefined;
  AbaSaidas: undefined;
  AbaCartoes: undefined;
  AbaMais: undefined;
};
