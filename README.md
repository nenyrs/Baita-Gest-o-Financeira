# Baita Gestão Financeira

Aplicativo de gestão financeira pessoal desenvolvido pela **Baita Dev**.

## Download

- **Baixar APK Android:** [Expo Build](https://expo.dev/accounts/nenyrs/projects/baita-gestao-financeira/builds/8571064f-c871-4628-ae27-bd9f4abe4c15)

## Stack

| Tecnologia | Uso |
|---|---|
| React Native | Framework mobile |
| Expo SDK 54 | Plataforma/tooling |
| TypeScript | Tipagem estática |
| SQLite (expo-sqlite) | Banco de dados local |
| React Navigation | Navegação (tabs + stacks) |
| expo-linear-gradient | UI com gradientes |
| react-native-svg | Gráfico de pizza |

## Funcionalidades

- Dashboard com saldo, entradas, saídas e gráfico por categoria
- Cadastro de entradas e saídas com categorias separadas
- Cartões de crédito/débito com controle de fatura e parcelas
- Contas fixas com histórico mensal
- Cofrinhos (metas de poupança)
- Templates de entrada rápida
- Tela de configurações (categorias, templates, notificações)
- Relatórios mensal e anual
- Dados 100% offline (SQLite local)

## Como rodar localmente

```bash
npm install
npx expo start
```

## Build

```bash
# APK (instalação direta)
eas build --platform android --profile preview

# AAB (Google Play)
eas build --platform android --profile production

# Atualização OTA (sem rebuild)
eas update --branch preview --message "descrição"
```

## Desenvolvido por

**Baita Dev** - 2026
