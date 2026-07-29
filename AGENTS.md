# Instruções para agentes e automações

## Ordem de leitura

1. `README.md`
2. `PRIVACY.md`
3. `SECURITY.md`
4. `docs/PRIVACY_AUDIT.md`
5. `docs/PUBLIC_DEPLOYMENT.md`
6. `docs/ARCHITECTURE.md`
7. `docs/DATA_MODEL.md`
8. `docs/PUBLIC_RELEASE_CHECKLIST.md`

## Regras inegociáveis

- Este é um produto público e genérico.
- Não copiar histórico, arquivos, artefatos ou dados de projetos privados.
- Não inserir pessoas, documentos, endereços, instituições ou contratos reais.
- Não adicionar login, telemetria, anúncios ou nuvem por padrão.
- Não introduzir rede em recursos que podem funcionar localmente.
- Não versionar backups, chaves, certificados, bancos locais ou arquivos de ambiente reais.
- A implantação pública deve fazer checkout de `rfmss/boletosmil` e publicar somente `dist/`.
- Nunca apontar a ponte pública para uma branch ou repositório privado.
- Toda alteração deve passar `npm run check`.

## Arquitetura

- HTML, CSS e JavaScript nativos.
- Sem dependências de produção.
- `src/domain.js` contém regras puras e testáveis.
- `app.js` contém interface e persistência local.
- `index.html` executa a migração de namespaces legados antes do aplicativo.
- `sw.js` gerencia somente caches da própria família de aplicações.
- `scripts/privacy-scan.mjs` é um gate obrigatório, não uma garantia absoluta.

## Política de mudanças

- PRs pequenos e revisáveis.
- Testes para regras de cálculo.
- Documentação atualizada junto da mudança.
- Dependências novas exigem justificativa de segurança, manutenção e impacto offline.
- Mudanças no armazenamento ou no service worker exigem incremento de versão de cache e nota no changelog.
- Incidentes de privacidade devem seguir `SECURITY.md` sem reproduzir dados sensíveis.
