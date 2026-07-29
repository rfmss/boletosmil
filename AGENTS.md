# Instruções para agentes e automações

## Ordem de leitura

1. `README.md`
2. `PRIVACY.md`
3. `SECURITY.md`
4. `docs/ARCHITECTURE.md`
5. `docs/DATA_MODEL.md`
6. `docs/PUBLIC_RELEASE_CHECKLIST.md`

## Regras inegociáveis

- Este é um produto público e genérico.
- Não copiar histórico, arquivos ou dados de projetos privados.
- Não inserir pessoas, documentos, endereços, instituições ou contratos reais.
- Não adicionar login, telemetria, anúncios ou nuvem por padrão.
- Não introduzir rede em recursos que podem funcionar localmente.
- Não versionar backups, chaves, certificados ou arquivos de ambiente reais.
- Toda alteração deve passar `npm run check`.

## Arquitetura

- HTML, CSS e JavaScript nativos.
- Sem dependências de produção.
- `src/domain.js` contém regras puras e testáveis.
- `app.js` contém interface e persistência local.
- `scripts/privacy-scan.mjs` é um gate obrigatório, não uma garantia absoluta.

## Política de mudanças

- PRs pequenos.
- Testes para regras de cálculo.
- Documentação atualizada junto da mudança.
- Dependências novas exigem justificativa de segurança, manutenção e impacto offline.
