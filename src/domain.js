export const APP_SCHEMA_VERSION = 1;

const MONTH_KEY_RE = /^(\d{4})-(\d{2})$/;

export function parseMonthKey(key) {
  const match = String(key ?? "").match(MONTH_KEY_RE);
  if (!match) throw new Error("competencia-invalida");
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) throw new Error("competencia-invalida");
  return { year, month };
}

export function monthIndex(key) {
  const { year, month } = parseMonthKey(key);
  return year * 12 + month - 1;
}

export function addMonths(key, offset) {
  const index = monthIndex(key) + Number(offset || 0);
  const year = Math.floor(index / 12);
  const month = ((index % 12) + 12) % 12;
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function monthsBetween(fromKey, toKey) {
  return monthIndex(toKey) - monthIndex(fromKey);
}

export function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
}

export function normalizeBill(input) {
  const name = String(input?.name || "").trim();
  const amount = Number(input?.amount);
  const dueDay = Number(input?.dueDay);
  if (!name) throw new Error("conta-sem-nome");
  if (!Number.isFinite(amount) || amount < 0) throw new Error("valor-invalido");
  if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31) throw new Error("vencimento-invalido");
  return {
    id: String(input?.id || crypto.randomUUID()),
    name,
    amount,
    dueDay,
    category: String(input?.category || "Outros"),
    paid: Boolean(input?.paid),
    receiptNote: String(input?.receiptNote || ""),
    monthKey: String(input?.monthKey || ""),
    source: String(input?.source || "manual"),
  };
}

export function summarizeBills(bills, monthKey) {
  const visible = (bills || []).filter((bill) => bill.monthKey === monthKey);
  const open = visible.filter((bill) => !bill.paid);
  const paid = visible.filter((bill) => bill.paid);
  const sum = (items) => items.reduce((total, item) => total + Number(item.amount || 0), 0);
  const nextDue = open.slice().sort((a, b) => a.dueDay - b.dueDay || a.name.localeCompare(b.name))[0] || null;
  return {
    visible,
    open,
    paid,
    openAmount: sum(open),
    paidAmount: sum(paid),
    totalAmount: sum(visible),
    nextDue,
  };
}

export function generateMonthlySchedule({ name, amount, dueDay, startMonth, months = 12, category = "Casa" }) {
  parseMonthKey(startMonth);
  const count = Number(months);
  if (!Number.isInteger(count) || count < 1 || count > 60) throw new Error("quantidade-invalida");
  const template = normalizeBill({ name, amount, dueDay, category, monthKey: startMonth, source: "schedule" });
  return Array.from({ length: count }, (_, index) => ({
    ...template,
    id: `${template.id}-${index + 1}`,
    monthKey: addMonths(startMonth, index),
    paid: false,
    receiptNote: "",
  }));
}

export function normalizeLoan(input) {
  const lender = String(input?.lender || "").trim();
  const identifier = String(input?.identifier || "").trim();
  const amount = Number(input?.amount);
  const baseMonth = String(input?.baseMonth || "");
  const baseInstallment = Number(input?.baseInstallment);
  const totalInstallments = Number(input?.totalInstallments);
  parseMonthKey(baseMonth);
  if (!lender || !identifier) throw new Error("parcelamento-invalido");
  if (!Number.isFinite(amount) || amount < 0) throw new Error("valor-invalido");
  if (!Number.isInteger(baseInstallment) || baseInstallment < 1) throw new Error("parcela-invalida");
  if (!Number.isInteger(totalInstallments) || totalInstallments < baseInstallment) throw new Error("total-invalido");
  return {
    id: String(input?.id || crypto.randomUUID()),
    lender,
    identifier,
    amount,
    baseMonth,
    baseInstallment,
    totalInstallments,
    confirmedEnded: Boolean(input?.confirmedEnded),
  };
}

export function projectLoan(input, currentMonth) {
  const loan = normalizeLoan(input);
  const offset = monthsBetween(loan.baseMonth, currentMonth);
  const finalMonth = addMonths(loan.baseMonth, loan.totalInstallments - loan.baseInstallment);
  const warningMonth = addMonths(finalMonth, -1);
  const currentInstallment = Math.min(
    loan.totalInstallments,
    Math.max(0, loan.baseInstallment + offset),
  );
  const remainingAfterCurrent = Math.max(0, loan.totalInstallments - currentInstallment);
  let status = "active";
  if (offset < 0) status = "scheduled";
  else if (loan.confirmedEnded) status = "ended";
  else if (currentMonth === warningMonth) status = "warning";
  else if (currentMonth === finalMonth) status = "final";
  else if (monthIndex(currentMonth) > monthIndex(finalMonth)) status = "confirm";
  return {
    ...loan,
    currentMonth,
    currentInstallment,
    remainingAfterCurrent,
    finalMonth,
    warningMonth,
    status,
  };
}

export function summarizeLoans(loans, currentMonth) {
  const projections = (loans || []).map((loan) => projectLoan(loan, currentMonth));
  const active = projections.filter((loan) => ["active", "warning", "final"].includes(loan.status));
  const warnings = projections.filter((loan) => loan.status === "warning");
  const finals = projections.filter((loan) => loan.status === "final");
  const confirmations = projections.filter((loan) => loan.status === "confirm");
  const sum = (items) => items.reduce((total, item) => total + item.amount, 0);
  return {
    projections,
    active,
    warnings,
    finals,
    confirmations,
    activeAmount: sum(active),
    warningAmount: sum(warnings),
    finalAmount: sum(finals),
  };
}

export function emptyState(monthKey) {
  parseMonthKey(monthKey);
  return {
    version: APP_SCHEMA_VERSION,
    monthKey,
    bills: [],
    loans: [],
    preferences: {
      guidedMode: true,
      demoLoaded: false,
    },
  };
}

export function demoState(monthKey) {
  const state = emptyState(monthKey);
  state.preferences.demoLoaded = true;
  state.bills = [
    normalizeBill({ id: "demo-energia", name: "Energia", amount: 146.8, dueDay: 8, category: "Casa", monthKey }),
    normalizeBill({ id: "demo-internet", name: "Internet", amount: 99.9, dueDay: 12, category: "Serviços", monthKey }),
    normalizeBill({ id: "demo-mercado", name: "Compras do mês", amount: 420, dueDay: 20, category: "Mercado", monthKey, paid: true, receiptNote: "Comprovante guardado" }),
  ];
  state.loans = [
    normalizeLoan({
      id: "demo-parcelamento",
      lender: "Instituição exemplo",
      identifier: "Contrato demonstrativo",
      amount: 180,
      baseMonth: monthKey,
      baseInstallment: 10,
      totalInstallments: 24,
    }),
  ];
  return state;
}

export function normalizeBackup(payload) {
  const input = typeof payload === "string" ? JSON.parse(payload) : payload;
  if (!input || input.version !== APP_SCHEMA_VERSION) throw new Error("backup-incompativel");
  parseMonthKey(input.monthKey);
  return {
    version: APP_SCHEMA_VERSION,
    monthKey: input.monthKey,
    bills: (input.bills || []).map(normalizeBill),
    loans: (input.loans || []).map(normalizeLoan),
    preferences: {
      guidedMode: input.preferences?.guidedMode !== false,
      demoLoaded: Boolean(input.preferences?.demoLoaded),
    },
  };
}
