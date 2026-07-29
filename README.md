# Boletos Mil

**Mil contas. Uma casa só.**

Boletos Mil é um organizador doméstico local-first para contas, sequências mensais, parcelamentos e referências de comprovantes. Funciona no navegador, pode ser instalado como PWA e não exige cadastro, servidor ou sincronização automática.

## Por que existe

Aplicativos financeiros costumam começar pedindo conta, integração bancária ou acesso a dados que não são necessários para organizar a rotina doméstica. Este projeto segue o caminho oposto:

- os dados ficam no dispositivo;
- o uso básico funciona offline;
- backups são arquivos controlados pela pessoa usuária;
- nenhuma conta bancária é conectada;
- nenhuma informação é enviada para analytics, anúncios ou IA.

## Recursos da versão 0.1.0

- contas mensais com valor, categoria e vencimento;
- marcação de pagamento e referência de comprovante;
- criação de sequências de até 60 competências;
- parcelamentos com projeção automática e aviso um mês antes do fim;
- modo guiado para cuidar de uma conta por vez;
- demonstração com dados fictícios;
- exportação e restauração em JSON;
- PWA offline-first;
- acessibilidade básica e suporte a movimento reduzido.

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
npm test       # testes de domínio
npm run privacy # auditoria de dados e segredos
npm run build  # gera dist/
npm run check  # privacidade + testes + build
```

## Modelo de privacidade

O armazenamento usa `localStorage` sob a chave `boletosmil:v1`. Isso é adequado para uma ferramenta doméstica simples, mas não substitui criptografia de dispositivo, backup do sistema ou um cofre de senhas.

Leia [PRIVACY.md](PRIVACY.md) e [SECURITY.md](SECURITY.md) antes de usar dados reais.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Modelo de dados](docs/DATA_MODEL.md)
- [Checklist de publicação](docs/PUBLIC_RELEASE_CHECKLIST.md)
- [Roadmap](docs/ROADMAP.md)
- [Como contribuir](CONTRIBUTING.md)

## Estado do projeto

A versão pública é deliberadamente genérica. Ela não contém documentos, contas, contratos, instituições, endereços, credenciais ou configurações de nenhuma casa real. A CI bloqueia padrões comuns de dados pessoais e segredos antes de aceitar mudanças.

## Licença

Código distribuído sob a licença [MIT](LICENSE).
