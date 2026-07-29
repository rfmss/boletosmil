import test from "node:test";
import assert from "node:assert/strict";
import {
  addMonths,
  demoState,
  generateMonthlySchedule,
  normalizeBackup,
  projectLoan,
  summarizeBills,
} from "../src/domain.js";

test("adiciona meses atravessando o ano", () => {
  assert.equal(addMonths("2026-12", 1), "2027-01");
  assert.equal(addMonths("2027-01", -1), "2026-12");
});

test("gera calendário mensal neutro", () => {
  const bills = generateMonthlySchedule({
    name: "Seguro residencial",
    amount: 55,
    dueDay: 15,
    startMonth: "2026-07",
    months: 12,
  });
  assert.equal(bills.length, 12);
  assert.equal(bills[0].monthKey, "2026-07");
  assert.equal(bills.at(-1).monthKey, "2027-06");
});

test("resume contas abertas e pagas", () => {
  const state = demoState("2026-07");
  const summary = summarizeBills(state.bills, "2026-07");
  assert.equal(summary.visible.length, 3);
  assert.equal(summary.open.length, 2);
  assert.equal(summary.paid.length, 1);
});

test("avisa um mês antes do fim de um parcelamento", () => {
  const loan = {
    lender: "Instituição exemplo",
    identifier: "ABC-001",
    amount: 100,
    baseMonth: "2026-07",
    baseInstallment: 10,
    totalInstallments: 12,
  };
  assert.equal(projectLoan(loan, "2026-08").status, "warning");
  assert.equal(projectLoan(loan, "2026-09").status, "final");
  assert.equal(projectLoan(loan, "2026-10").status, "confirm");
});

test("restaura apenas o formato público suportado", () => {
  const state = demoState("2026-07");
  assert.deepEqual(normalizeBackup(JSON.stringify(state)), state);
  assert.throws(() => normalizeBackup({ version: 999 }), /backup-incompativel/);
});
