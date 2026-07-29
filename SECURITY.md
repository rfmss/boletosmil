# Política de segurança

## Versões suportadas

Somente a versão mais recente da branch `main` recebe correções.

## Como relatar

Use o recurso **Security advisories** do repositório para relatar vulnerabilidades sem exposição pública. Não abra uma issue com dados reais, backups, documentos, tokens ou chaves.

Inclua:

- impacto observado;
- passos mínimos para reproduzir;
- navegador e sistema operacional;
- versão ou commit afetado;
- proposta de mitigação, quando houver.

## Limites conhecidos

- `localStorage` não oferece criptografia própria;
- um perfil de navegador comprometido pode expor os dados;
- backups JSON são legíveis;
- o aplicativo não executa pagamentos e não valida boletos;
- o projeto não substitui orientação financeira ou jurídica.

## Segredos proibidos

Nunca faça commit de:

- chaves de assinatura;
- certificados privados;
- tokens de API;
- arquivos `.env` com valores reais;
- backups exportados;
- documentos ou comprovantes.
