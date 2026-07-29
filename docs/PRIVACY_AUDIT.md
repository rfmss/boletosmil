# Auditoria de privacidade da versão pública

Data da preparação: 2026-07-29.

## Método

A versão pública foi construída em um repositório vazio, sem importar histórico Git, arquivos ou branches de projetos privados.

Foram executadas as seguintes verificações:

- revisão dos dados demonstrativos;
- busca por nomes, identificadores e marcas provenientes de configurações privadas;
- busca por CPF, e-mail, telefone e caminhos absolutos;
- busca por tokens e blocos de chave privada;
- bloqueio de documentos, imagens pessoais, backups e chaves de assinatura;
- execução dos testes de domínio;
- geração do build estático.

## Resultado

Nenhum dado de uma pessoa ou residência real foi incluído. Os únicos registros pré-carregados são exemplos explicitamente fictícios e podem ser substituídos ou apagados no navegador.

## Limite da auditoria

Automação reduz risco, mas não substitui revisão humana. Toda contribuição futura deve passar pelo checklist público e pela CI.
