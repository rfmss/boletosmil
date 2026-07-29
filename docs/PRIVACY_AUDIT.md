# Auditoria de privacidade da versão pública

Data da revisão: 29 de julho de 2026.

## Objetivo

Confirmar que a distribuição pública do Boletos Mil não incorpora dados de uma residência, pessoa, contrato, instituição financeira ou documento real.

## Escopo revisado

- código-fonte e dados demonstrativos;
- HTML, manifesto e service worker;
- arquivos de documentação e colaboração;
- scripts de build e validação;
- arquivos rastreados no repositório público;
- fluxo que publica a aplicação no endereço público legado.

## Estratégia de separação

O Boletos Mil é uma implementação pública e genérica. O código da aplicação privada que inspirou o produto não é copiado, importado, empacotado nem publicado por este repositório.

O endereço público legado funciona somente como ponte de implantação: o workflow responsável baixa a branch `main` deste repositório, executa as validações e publica o diretório `dist/` produzido pelo build público.

## Controles aplicados

1. O estado inicial é vazio.
2. O modo demonstração usa nomes e valores fictícios.
3. Não existem documentos, imagens de comprovantes, backups, arquivos de ambiente ou bancos locais versionados.
4. Não existem login, analytics, anúncios, conexão bancária, upload remoto ou processamento por IA.
5. O script `npm run privacy` bloqueia padrões comuns de CPF, CNPJ, CEP, telefone, e-mail real, linha digitável, payload Pix, tokens e chaves.
6. Extensões de documentos, imagens, arquivos compactados, bancos locais e certificados são bloqueadas na auditoria.
7. A inicialização pública remove namespaces antigos de armazenamento local, sessão e cache quando a pessoa volta ao mesmo endereço no navegador.
8. O service worker remove apenas caches pertencentes a esta família de aplicações; caches de outros projetos no mesmo domínio não são apagados.

## Validação reproduzível

```bash
npm run privacy
npm run syntax
npm test
npm run build
```

O comando agregado é:

```bash
npm run check
```

A integração contínua executa o mesmo gate em pull requests e em cada push para `main`.

## Limites da afirmação de exclusão

A aplicação pode apagar dados antigos armazenados no navegador somente quando esse navegador visita novamente o endereço atualizado. O projeto não consegue apagar remotamente:

- backups já baixados;
- screenshots ou documentos guardados pela pessoa;
- dados em aparelhos que nunca voltarem ao endereço;
- caches intermediários controlados por terceiros fora do GitHub Pages e do navegador.

Por isso, “versão pública limpa” significa que o servidor deixa de distribuir o aplicativo privado e que a distribuição atual não contém dados pessoais incorporados. Não significa destruição remota de todas as cópias já existentes.

## Resultado esperado para publicação

A versão pode ser considerada apta para uso público quando:

- `npm run check` estiver aprovado;
- o workflow de qualidade estiver verde;
- o workflow da ponte pública tiver publicado exclusivamente o artefato deste repositório;
- uma visita em janela anônima mostrar estado vazio e nenhuma requisição de terceiros.
