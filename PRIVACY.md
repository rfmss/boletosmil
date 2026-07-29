# Privacidade

## Princípio

Boletos Mil deve funcionar sem que a pessoa entregue seus dados domésticos ao projeto.

## O que o aplicativo armazena

Somente no dispositivo:

- nomes definidos pela pessoa usuária;
- valores, vencimentos e categorias;
- estado de pagamento;
- referências textuais de comprovantes;
- cronogramas de parcelamentos;
- preferências locais.

O estado principal usa `localStorage` na chave `boletosmil:v1`.

## O que o projeto não coleta

A distribuição oficial não contém:

- cadastro ou autenticação;
- telemetria ou analytics;
- publicidade;
- sincronização em nuvem;
- conexão bancária;
- leitura automática de mensagens ou notificações;
- upload de documentos;
- processamento remoto por inteligência artificial.

## Modo público

A versão pública começa vazia. Os registros do botão de demonstração são fictícios e existem apenas para explicar a interface.

A fonte pública não importa código, arquivos, histórico ou dados da aplicação privada que originou o projeto.

## Migração do endereço anterior

Quando a versão pública é aberta no mesmo endereço usado por uma versão anterior, o HTML remove namespaces antigos de `localStorage`, `sessionStorage` e Cache Storage antes de iniciar a aplicação.

O novo service worker também elimina caches antigos pertencentes a essa família de aplicações, sem apagar caches de outros projetos no mesmo domínio.

Essa limpeza depende de uma nova visita ao endereço. Ela não alcança arquivos baixados, screenshots, cópias externas nem dispositivos que não retornem ao site.

## Backup

A exportação gera um arquivo JSON legível. Quem obtiver esse arquivo poderá ler seu conteúdo. Guarde-o em local protegido e não o anexe a issues públicas.

Antes de limpar o navegador, decida conscientemente se precisa exportar um backup. Depois de apagados sem backup, os dados locais não podem ser recuperados pelo projeto.

## Auditoria

O comando `npm run privacy` bloqueia padrões comuns de dados pessoais, documentos, backups, credenciais e segredos. Ele reduz risco, mas não substitui revisão humana.

A metodologia e seus limites estão em [docs/PRIVACY_AUDIT.md](docs/PRIVACY_AUDIT.md).

## Relato de privacidade

Não publique dados pessoais em issues. Para relatar uma falha que exija exemplos sensíveis, siga o canal privado indicado em [SECURITY.md](SECURITY.md).
