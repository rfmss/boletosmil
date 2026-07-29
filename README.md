# Boletos Mil

**Mil contas. Uma casa só.**

Boletos Mil é um organizador doméstico local-first para contas, sequências mensais, parcelamentos e referências de comprovantes. Funciona no navegador, pode ser instalado como PWA e não exige cadastro, servidor ou sincronização automática.

## Estado público

Este repositório é a fonte canônica da versão pública. O estado inicial é vazio e a demonstração contém somente dados fictícios.

A aplicação privada que originou a ideia não é dependência, não é copiada durante o build e não pode ser usada pela ponte de implantação. O endereço legado publica exclusivamente o artefato gerado por `boletosmil/main`.

## Por que existe

Aplicativos financeiros costumam começar pedindo conta, integração bancária ou acesso a dados que não são necessários para organizar a rotina doméstica. Este projeto segue o caminho oposto:

- os dados ficam no dispositivo;
- o uso básico funciona offline;
- backups são arquivos controlados pela pessoa usuária;
- nenhuma conta bancária é conectada;
- nenhuma informação é enviada para analytics, anúncios ou IA.

## Recursos da versão 0.2.0

- contas mensais com valor, categoria e vencimento;
- marcação de pagamento e referência textual de comprovante;
- criação de sequências de até 60 competências;
- parcelamentos com projeção automática e aviso um mês antes do fim;
- modo guiado para cuidar de uma conta por vez;
- demonstração com dados fictícios;
- exportação e restauração em JSON;
- PWA offline-first;
- limpeza de namespaces antigos no primeiro acesso ao endereço migrado;
- auditoria automática de dados pessoais, documentos e segredos;
- acessibilidade básica e suporte a movimento reduzido.

## Privacidade por construção

O armazenamento usa `localStorage` sob a chave `boletosmil:v1`. Isso é adequado para uma ferramenta doméstica simples, mas não substitui criptografia de dispositivo, backup do sistema ou um cofre de senhas.

A inicialização pública remove namespaces antigos de armazenamento e cache ligados à aplicação anterior quando o mesmo navegador volta ao endereço atualizado. Essa migração não consegue apagar backups baixados nem dados de aparelhos que nunca retornem ao site.

Leia [PRIVACY.md](PRIVACY.md), [SECURITY.md](SECURITY.md) e a [auditoria de privacidade](docs/PRIVACY_AUDIT.md) antes de usar dados reais.

## Executar localmente

O projeto não possui dependências de produção.

```bash
npm run check
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

Não abra `index.html` diretamente pelo sistema de arquivos: módulos JavaScript e service workers exigem um servidor HTTP local.

## Comandos

```bash
npm test        # testes de domínio
npm run privacy # auditoria de dados, documentos e segredos
npm run syntax  # validação sintática
npm run build   # gera dist/
npm run check   # privacidade + sintaxe + testes + build
```

## Estrutura

```text
index.html                  entrada e migração do navegador
app.js                      interface e persistência local
src/domain.js               regras de domínio puras
sw.js                       cache offline e limpeza de caches gerenciados
scripts/privacy-scan.mjs     gate de privacidade
scripts/build.mjs            build estático reproduzível
docs/                        arquitetura, dados, auditoria e publicação
```

## Publicação

A distribuição oficial deve ser construída pela CI e publicar somente `dist/`. A ponte do endereço legado deve fazer checkout deste repositório, nunca de uma branch privada.

Consulte [Implantação pública](docs/PUBLIC_DEPLOYMENT.md) e [Checklist de publicação](docs/PUBLIC_RELEASE_CHECKLIST.md).

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Modelo de dados](docs/DATA_MODEL.md)
- [Auditoria de privacidade](docs/PRIVACY_AUDIT.md)
- [Implantação pública](docs/PUBLIC_DEPLOYMENT.md)
- [Checklist de publicação](docs/PUBLIC_RELEASE_CHECKLIST.md)
- [Roadmap](docs/ROADMAP.md)
- [Como contribuir](CONTRIBUTING.md)

## Limites

Boletos Mil organiza informações. Ele não executa pagamentos, não valida boletos, não oferece aconselhamento financeiro e não protege o navegador contra acesso físico ou malware.

## Licença

Código distribuído sob a licença [MIT](LICENSE).
