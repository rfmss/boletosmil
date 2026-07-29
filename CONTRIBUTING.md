# Contribuindo

Obrigado por ajudar a tornar a organização doméstica mais simples e privada.

## Antes de começar

1. Leia `PRIVACY.md`, `SECURITY.md` e `AGENTS.md`.
2. Abra uma issue curta para mudanças de produto ou arquitetura.
3. Não use dados reais em testes, screenshots, commits ou discussões.
4. Prefira mudanças pequenas e revisáveis.

## Fluxo recomendado

```bash
git switch -c tipo/descricao-curta
npm run check
git commit -m "tipo: descrição objetiva"
```

Tipos comuns: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.

## Requisitos de pull request

- explicar o problema e a solução;
- registrar riscos de privacidade;
- incluir ou atualizar testes;
- passar `npm run check`;
- não adicionar dependência sem justificativa;
- manter o funcionamento offline.

## Dados de demonstração

Use somente nomes evidentemente fictícios, como “Energia”, “Instituição exemplo” e “Contrato demonstrativo”. Não adapte documentos ou valores de uma pessoa real.
