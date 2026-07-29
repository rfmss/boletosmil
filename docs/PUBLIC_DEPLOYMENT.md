# Implantação pública

## Fonte canônica

A branch `main` de `rfmss/boletosmil` é a única fonte autorizada da versão pública.

O projeto privado que originou a ideia pode continuar existindo como ferramenta pessoal, mas seu código, seus dados e seus artefatos não devem ser publicados.

## Endereços

A aplicação pode ser publicada em dois contextos:

- GitHub Pages do próprio repositório, no caminho do projeto;
- endereço público legado, mantido por um repositório-ponte que baixa este repositório e publica apenas o conteúdo de `dist/`.

Todos os caminhos usados pela aplicação são relativos. Por isso, o mesmo artefato funciona em subdiretórios sem alterar o código.

## Pipeline autorizado

1. Fazer checkout de `rfmss/boletosmil` na branch `main`.
2. Preparar Node.js 20 ou superior.
3. Executar `npm run check`.
4. Publicar somente o diretório `dist/`.
5. Interromper a implantação se qualquer auditoria, teste ou build falhar.

Exemplo mínimo:

```yaml
- uses: actions/checkout@v4
  with:
    repository: rfmss/boletosmil
    ref: main
- uses: actions/setup-node@v4
  with:
    node-version: 20
- run: npm run check
- uses: actions/upload-pages-artifact@v3
  with:
    path: dist
```

## Proibições

A ponte pública não deve:

- fazer checkout de branch do projeto privado;
- copiar diretórios de dados, documentos, comprovantes ou backups;
- executar build com segredos pessoais;
- publicar artefatos previamente gerados sem validar sua origem;
- manter duas fontes públicas divergentes.

## Migração do endereço legado

Na primeira visita após a troca, o HTML público remove namespaces antigos de `localStorage`, `sessionStorage` e Cache Storage associados à aplicação anterior. O novo service worker assume o subdiretório público e elimina apenas caches dessa família de aplicações.

Esse processo não apaga arquivos que já foram baixados nem alcança aparelhos que não voltem a acessar o endereço.

## Verificação após publicar

Em uma janela anônima:

1. Abra a aplicação e confirme que o estado inicial está vazio.
2. Confirme que somente os dados fictícios aparecem ao acionar a demonstração.
3. Abra as ferramentas do navegador e verifique ausência de requisições para analytics, anúncios, IA ou serviços financeiros.
4. Confira que o service worker está registrado no escopo do subdiretório da aplicação.
5. Execute uma recarga offline após o primeiro carregamento.
6. Confira o commit publicado no workflow de implantação.

## Rollback

Se a versão pública falhar, reverta o commit em `boletosmil/main` e execute novamente a ponte. Não aponte o workflow de volta para o código privado como forma de rollback.
