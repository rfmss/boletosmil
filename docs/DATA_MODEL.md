# Modelo de dados

## Estado principal

```json
{
  "version": 1,
  "monthKey": "2026-07",
  "bills": [],
  "loans": [],
  "preferences": {
    "guidedMode": true,
    "demoLoaded": false
  }
}
```

## Conta

```json
{
  "id": "identificador-local",
  "name": "Energia",
  "amount": 146.8,
  "dueDay": 8,
  "category": "Casa",
  "paid": false,
  "receiptNote": "",
  "monthKey": "2026-07",
  "source": "manual"
}
```

## Parcelamento

```json
{
  "id": "identificador-local",
  "lender": "Instituição exemplo",
  "identifier": "Contrato demonstrativo",
  "amount": 180,
  "baseMonth": "2026-07",
  "baseInstallment": 10,
  "totalInstallments": 24,
  "confirmedEnded": false
}
```

## Regras

- `monthKey` usa `AAAA-MM`.
- Valores são números em reais, nunca strings formatadas.
- A parcela da competência-base já está incluída no contador.
- O mês final é calculado por `totalInstallments - baseInstallment` meses após a base.
- O aviso ocorre exatamente um mês antes do mês final.
- Após o mês final, o aplicativo pede confirmação manual.

## Compatibilidade

O campo `version` é obrigatório. Backups de versões desconhecidas são rejeitados para impedir restauração parcial silenciosa.
