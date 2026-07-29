# Política de segurança

## Versões suportadas

Somente a versão mais recente da branch `main` recebe correções.

## Como relatar

Use o recurso **Security advisories** do repositório para relatar vulnerabilidades sem exposição pública. Não abra uma issue com dados reais, backups, documentos, tokens ou chaves.

Inclua:

- impacto observado;
- passos mínimos para reproduzir usando dados fictícios;
- navegador e sistema operacional;
- versão ou commit afetado;
- proposta de mitigação, quando houver.

## Fronteira de confiança

A versão pública é construída exclusivamente a partir de `rfmss/boletosmil`. A ponte que mantém o endereço legado deve fazer checkout deste repositório e publicar somente `dist/`.

Apontar o workflow para código privado, artefatos manuais ou branches não auditadas é uma falha de segurança e privacidade.

## Limites conhecidos

- `localStorage` não oferece criptografia própria;
- um perfil de navegador comprometido pode expor os dados;
- backups JSON são legíveis;
- a limpeza de dados legados depende de uma nova visita ao endereço atualizado;
- arquivos já baixados ou copiados não podem ser apagados remotamente;
- o aplicativo não executa pagamentos e não valida boletos;
- o projeto não substitui orientação financeira ou jurídica.

## Segredos e arquivos proibidos

Nunca faça commit de:

- chaves de assinatura;
- certificados privados;
- tokens de API;
- arquivos `.env` com valores reais;
- backups exportados;
- documentos ou comprovantes;
- bancos locais;
- screenshots com dados reais.

## Resposta a incidente

Se dados pessoais forem encontrados na distribuição pública:

1. interrompa a implantação ou reverta para o último commit limpo;
2. remova o material da árvore atual e revise o histórico alcançável;
3. invalide credenciais expostas, quando houver;
4. publique uma correção com o número de cache incrementado;
5. registre o incidente sem reproduzir os dados sensíveis;
6. solicite remoção de caches ou objetos históricos ao provedor quando necessário.
