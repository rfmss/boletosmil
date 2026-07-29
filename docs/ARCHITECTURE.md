# Arquitetura

## Visão geral

Boletos Mil é uma aplicação web estática local-first.

```text
index.html
  └─ app.js
      ├─ src/domain.js
      └─ localStorage
```

## Camadas

### Domínio

`src/domain.js` concentra:

- competências mensais;
- geração de sequências;
- normalização de contas;
- projeção de parcelamentos;
- resumo financeiro;
- validação de backup.

As funções não dependem do DOM e são cobertas por testes nativos do Node.js.

### Interface

`app.js` renderiza a interface, liga eventos e persiste o estado local. A camada de interface não deve reimplementar cálculos do domínio.

### Persistência

A versão 0.1 usa `localStorage`. A chave pública é `boletosmil:v1`.

Migrações futuras devem:

1. manter leitura das versões anteriores;
2. nunca descartar dados silenciosamente;
3. oferecer exportação antes de mudanças destrutivas;
4. documentar o formato em `DATA_MODEL.md`.

### Offline

`sw.js` mantém um cache dos arquivos essenciais. O aplicativo não depende de API remota.

## Decisões

### Sem framework

A primeira versão usa plataforma web nativa para reduzir:

- superfície de dependências;
- custo de manutenção;
- tamanho da aplicação;
- risco de cadeia de suprimentos.

### Sem armazenamento de arquivos

Comprovantes são registrados por referência textual. Armazenar imagens no navegador exige limites, migração e proteção adicionais; isso fica fora do escopo inicial.

### Sem integração financeira

O aplicativo não lê contas bancárias, não valida códigos e não executa pagamentos.
