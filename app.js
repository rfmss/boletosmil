import {
  addMonths,
  demoState,
  emptyState,
  formatMoney,
  generateMonthlySchedule,
  normalizeBackup,
  normalizeBill,
  normalizeLoan,
  summarizeBills,
  summarizeLoans,
} from "./src/domain.js";

const STORE_KEY = "boletosmil:v1";
const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const currentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabel = (key) => {
  const [year, month] = key.split("-").map(Number);
  return `${monthNames[month - 1]} de ${year}`;
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? normalizeBackup(raw) : emptyState(currentMonthKey());
  } catch {
    return emptyState(currentMonthKey());
  }
}

let state = loadState();
let guidedOpen = false;
let toastTimer;

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function updateState(next) {
  state = next;
  saveState();
  render();
}

function toast(message) {
  const node = document.querySelector("#toast");
  if (!node) return;
  node.textContent = message;
  node.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.add("hidden"), 3200);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function billMarkup(bill) {
  return `
    <article class="bill-row ${bill.paid ? "is-paid" : ""}" data-bill-id="${escapeHtml(bill.id)}">
      <span class="status-dot" aria-hidden="true"></span>
      <div>
        <div class="bill-name">${escapeHtml(bill.name)}</div>
        <div class="bill-meta">Vence dia ${bill.dueDay} · ${escapeHtml(bill.category)}${bill.receiptNote ? ` · ${escapeHtml(bill.receiptNote)}` : ""}</div>
      </div>
      <div class="bill-value">
        <strong>${formatMoney(bill.amount)}</strong>
        <div class="row-actions">
          <button type="button" data-action="toggle-paid">${bill.paid ? "Reabrir" : "Marcar paga"}</button>
          <button type="button" data-action="receipt">Comprovante</button>
          <button type="button" class="danger" data-action="delete-bill">Excluir</button>
        </div>
      </div>
    </article>
  `;
}

function loanMarkup(loan) {
  const labels = {
    active: "ativo",
    scheduled: "ainda não iniciado",
    warning: "termina no próximo mês",
    final: "última parcela prevista",
    confirm: "confirme se saiu",
    ended: "encerrado",
  };
  return `
    <article class="loan-row ${loan.status}" data-loan-id="${escapeHtml(loan.id)}">
      <div>
        <div class="loan-name">${escapeHtml(loan.lender)}</div>
        <div class="loan-meta">${escapeHtml(loan.identifier)} · ${loan.currentInstallment}/${loan.totalInstallments} · final previsto em ${escapeHtml(monthLabel(loan.finalMonth))}</div>
        <div class="loan-meta">${labels[loan.status]} · ${loan.remainingAfterCurrent} parcela(s) após este mês</div>
      </div>
      <div class="bill-value">
        <strong>${formatMoney(loan.amount)}</strong>
        <div class="row-actions">
          ${loan.status === "confirm" ? '<button type="button" data-action="confirm-loan">Confirmar fim</button>' : ""}
          ${loan.status === "ended" ? '<button type="button" data-action="reopen-loan">Reabrir</button>' : ""}
          <button type="button" class="danger" data-action="delete-loan">Excluir</button>
        </div>
      </div>
    </article>
  `;
}

function guidedMarkup(summary) {
  if (!guidedOpen) return "";
  const bill = summary.open[0];
  return `
    <div class="backdrop" data-action="close-guided">
      <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="guided-title" onclick="event.stopPropagation()">
        <div class="dialog-head">
          <div>
            <span class="eyebrow">Modo guiado</span>
            <h2 id="guided-title">Uma conta por vez</h2>
          </div>
          <button class="icon-button" type="button" data-action="close-guided" aria-label="Fechar">×</button>
        </div>
        ${bill ? `
          <p>Cuide desta conta com calma. Depois marque como paga e registre onde o comprovante ficou.</p>
          <div class="guided-bill">
            <strong>${escapeHtml(bill.name)}</strong>
            <span>${formatMoney(bill.amount)} · vence dia ${bill.dueDay}</span>
          </div>
          <div class="form-actions">
            <button class="primary" type="button" data-action="guided-paid" data-bill-id="${escapeHtml(bill.id)}">Marcar como paga</button>
            <button type="button" data-action="close-guided">Pausar</button>
          </div>
        ` : `
          <p>Não há contas abertas neste mês. O mês está em ordem.</p>
          <button class="primary" type="button" data-action="close-guided">Concluir</button>
        `}
      </section>
    </div>
  `;
}

function render() {
  const bills = summarizeBills(state.bills, state.monthKey);
  const loans = summarizeLoans(state.loans, state.monthKey);
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <img class="brand-mark" src="./icons/icon.svg" alt="" />
          <div>
            <h1>Boletos Mil</h1>
            <p>Mil contas. Uma casa só.</p>
          </div>
        </div>
        <div class="top-actions">
          <button type="button" data-action="demo" title="Carregar dados demonstrativos"><span>Ver demonstração</span> ✦</button>
          <button type="button" data-action="export" title="Exportar backup"><span>Backup</span> ↓</button>
          <label class="file-button" title="Importar backup"><span>Restaurar</span> ↑<input id="import-file" class="hidden" type="file" accept="application/json,.json" /></label>
        </div>
      </header>

      <main id="conteudo">
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-copy">
            <span class="eyebrow">Local-first · sem cadastro</span>
            <h2 id="hero-title">Organize o mês sem entregar a casa para a nuvem.</h2>
            <p>Contas, parcelamentos e referências de comprovantes ficam neste dispositivo. Você pode usar offline, exportar um backup e apagar tudo quando quiser.</p>
            <div class="hero-actions">
              <button class="primary" type="button" data-action="focus-add">Adicionar primeira conta</button>
              <button type="button" data-action="demo">Abrir modo demonstração</button>
            </div>
          </div>
          <aside class="privacy-card" aria-label="Compromissos de privacidade">
            <div>
              <span class="eyebrow">Privacidade por padrão</span>
              <h3>Seus dados não saem daqui.</h3>
              <p>O projeto não possui login, analytics, anúncios, sincronização automática nem integrações financeiras.</p>
            </div>
            <div class="privacy-list">
              <span>✓ Funciona offline</span>
              <span>✓ Dados no navegador</span>
              <span>✓ Backup sob seu controle</span>
            </div>
          </aside>
        </section>

        <nav class="month-nav" aria-label="Navegação entre meses">
          <button class="icon-button" type="button" data-action="prev-month" aria-label="Mês anterior">←</button>
          <div class="month-title"><span>Competência</span><strong>${escapeHtml(monthLabel(state.monthKey))}</strong></div>
          <button class="icon-button" type="button" data-action="next-month" aria-label="Próximo mês">→</button>
        </nav>

        <section class="summary-grid" aria-label="Resumo do mês">
          <article class="summary-card"><span>Em aberto</span><strong>${formatMoney(bills.openAmount)}</strong><small>${bills.open.length} conta(s)</small></article>
          <article class="summary-card"><span>Pagas</span><strong>${formatMoney(bills.paidAmount)}</strong><small>${bills.paid.length} concluída(s)</small></article>
          <article class="summary-card"><span>Próximo vencimento</span><strong>${bills.nextDue ? `dia ${bills.nextDue.dueDay}` : "—"}</strong><small>${bills.nextDue ? escapeHtml(bills.nextDue.name) : "nenhuma conta aberta"}</small></article>
          <article class="summary-card ${loans.warnings.length || loans.finals.length || loans.confirmations.length ? "alert" : ""}"><span>Avisos de parcelas</span><strong>${loans.warnings.length + loans.finals.length + loans.confirmations.length}</strong><small>${formatMoney(loans.activeAmount)} ativos</small></article>
        </section>

        <div class="layout">
          <div class="column">
            <section class="panel" aria-labelledby="bills-title">
              <div class="panel-head">
                <div><h3 id="bills-title">Contas do mês</h3><p>Marque o pagamento e guarde uma referência do comprovante.</p></div>
              </div>
              <div class="bill-list">
                ${bills.visible.length ? bills.visible.slice().sort((a, b) => a.dueDay - b.dueDay).map(billMarkup).join("") : '<div class="empty-state"><strong>Nenhuma conta neste mês</strong>Comece com uma conta manual ou gere uma sequência mensal.</div>'}
              </div>
            </section>

            <section class="panel" aria-labelledby="loans-title">
              <div class="panel-head"><div><h3 id="loans-title">Parcelamentos</h3><p>O aviso aparece um mês antes da última parcela prevista.</p></div></div>
              ${loans.warnings.length ? `<div class="alert-box"><strong>${loans.warnings.length} parcelamento(s) termina(m) no próximo mês</strong><p>Liberação estimada: ${formatMoney(loans.warningAmount)} por mês, após confirmação.</p></div>` : ""}
              ${loans.finals.length ? `<div class="alert-box"><strong>Última parcela prevista neste mês</strong><p>${formatMoney(loans.finalAmount)} pode deixar de ser descontado na próxima competência.</p></div>` : ""}
              <div class="loan-list">
                ${loans.projections.length ? loans.projections.sort((a, b) => a.finalMonth.localeCompare(b.finalMonth)).map(loanMarkup).join("") : '<div class="empty-state"><strong>Nenhum parcelamento</strong>Cadastre apenas os dados necessários para calcular o encerramento.</div>'}
              </div>
            </section>
          </div>

          <aside class="column">
            <section class="panel" aria-labelledby="add-title">
              <div class="panel-head"><div><h3 id="add-title">Adicionar conta</h3><p>Uma conta para a competência atual.</p></div></div>
              <form id="bill-form">
                <label>Nome da conta<input name="name" required maxlength="80" placeholder="Ex.: Energia" /></label>
                <div class="form-grid">
                  <label>Valor<input name="amount" required type="number" min="0" step="0.01" placeholder="0,00" /></label>
                  <label>Vencimento<input name="dueDay" required type="number" min="1" max="31" value="10" /></label>
                </div>
                <label>Categoria<select name="category"><option>Casa</option><option>Serviços</option><option>Mercado</option><option>Saúde</option><option>Dívida</option><option>Outros</option></select></label>
                <button class="primary" type="submit">Adicionar conta</button>
              </form>
            </section>

            <section class="panel" aria-labelledby="schedule-title">
              <div class="panel-head"><div><h3 id="schedule-title">Sequência mensal</h3><p>Crie até 60 competências de uma vez.</p></div></div>
              <form id="schedule-form">
                <label>Nome<input name="name" required maxlength="80" placeholder="Ex.: Seguro residencial" /></label>
                <div class="form-grid">
                  <label>Valor<input name="amount" required type="number" min="0" step="0.01" /></label>
                  <label>Dia<input name="dueDay" required type="number" min="1" max="31" value="15" /></label>
                  <label>Primeiro mês<input name="startMonth" required type="month" value="${state.monthKey}" /></label>
                  <label>Quantidade<input name="months" required type="number" min="1" max="60" value="12" /></label>
                </div>
                <button type="submit">Gerar sequência</button>
              </form>
            </section>

            <section class="panel" aria-labelledby="loan-form-title">
              <div class="panel-head"><div><h3 id="loan-form-title">Adicionar parcelamento</h3><p>Use nomes e identificadores que façam sentido só para você.</p></div></div>
              <form id="loan-form">
                <label>Instituição ou origem<input name="lender" required maxlength="80" placeholder="Ex.: Instituição exemplo" /></label>
                <label>Identificador<input name="identifier" required maxlength="80" placeholder="Ex.: Contrato 001" /></label>
                <div class="form-grid">
                  <label>Valor mensal<input name="amount" required type="number" min="0" step="0.01" /></label>
                  <label>Competência-base<input name="baseMonth" required type="month" value="${state.monthKey}" /></label>
                  <label>Parcela atual<input name="baseInstallment" required type="number" min="1" value="1" /></label>
                  <label>Total<input name="totalInstallments" required type="number" min="1" value="12" /></label>
                </div>
                <button type="submit">Adicionar parcelamento</button>
              </form>
            </section>

            <section class="panel">
              <div class="panel-head"><div><h3>Controle local</h3><p>Exporte antes de limpar este navegador.</p></div></div>
              <div class="form-actions">
                <button type="button" data-action="export">Exportar backup</button>
                <button class="danger" type="button" data-action="clear">Apagar dados locais</button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <footer class="site-footer">Boletos Mil é um projeto aberto, sem vínculo com bancos, governos ou empresas de cobrança. Ele organiza informações; não executa pagamentos nem oferece aconselhamento financeiro.</footer>
      <button class="floating-guided" type="button" data-action="guided"><span>Modo guiado</span> ◎</button>
      <div id="toast" class="toast hidden" role="status" aria-live="polite"></div>
      ${guidedMarkup(bills)}
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((node) => node.addEventListener("click", handleAction));
  document.querySelector("#bill-form")?.addEventListener("submit", submitBill);
  document.querySelector("#schedule-form")?.addEventListener("submit", submitSchedule);
  document.querySelector("#loan-form")?.addEventListener("submit", submitLoan);
  document.querySelector("#import-file")?.addEventListener("change", importBackup);
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  const row = event.currentTarget.closest("[data-bill-id], [data-loan-id]");
  if (action === "prev-month") updateState({ ...state, monthKey: addMonths(state.monthKey, -1) });
  if (action === "next-month") updateState({ ...state, monthKey: addMonths(state.monthKey, 1) });
  if (action === "focus-add") document.querySelector("#bill-form input[name=name]")?.focus();
  if (action === "demo") {
    if (state.bills.length || state.loans.length) {
      if (!confirm("Substituir os dados locais por uma demonstração neutra?")) return;
    }
    updateState(demoState(state.monthKey));
    toast("Demonstração carregada.");
  }
  if (action === "export") {
    downloadJson(`boletosmil-backup-${state.monthKey}.json`, state);
    toast("Backup exportado.");
  }
  if (action === "clear") {
    if (!confirm("Apagar todas as contas e parcelamentos deste navegador?")) return;
    updateState(emptyState(currentMonthKey()));
    toast("Dados locais apagados.");
  }
  if (action === "guided") { guidedOpen = true; render(); }
  if (action === "close-guided") { guidedOpen = false; render(); }
  if (action === "guided-paid") {
    const id = event.currentTarget.dataset.billId;
    state.bills = state.bills.map((bill) => bill.id === id ? { ...bill, paid: true } : bill);
    guidedOpen = true;
    updateState({ ...state });
    toast("Conta marcada como paga.");
  }
  if (action === "toggle-paid" && row?.dataset.billId) {
    state.bills = state.bills.map((bill) => bill.id === row.dataset.billId ? { ...bill, paid: !bill.paid } : bill);
    updateState({ ...state });
  }
  if (action === "receipt" && row?.dataset.billId) {
    const bill = state.bills.find((item) => item.id === row.dataset.billId);
    const note = prompt("Onde o comprovante ficou guardado?", bill?.receiptNote || "");
    if (note === null) return;
    state.bills = state.bills.map((item) => item.id === row.dataset.billId ? { ...item, receiptNote: note.trim() } : item);
    updateState({ ...state });
  }
  if (action === "delete-bill" && row?.dataset.billId) {
    if (!confirm("Excluir esta conta?")) return;
    updateState({ ...state, bills: state.bills.filter((bill) => bill.id !== row.dataset.billId) });
  }
  if (action === "confirm-loan" && row?.dataset.loanId) {
    state.loans = state.loans.map((loan) => loan.id === row.dataset.loanId ? { ...loan, confirmedEnded: true } : loan);
    updateState({ ...state });
  }
  if (action === "reopen-loan" && row?.dataset.loanId) {
    state.loans = state.loans.map((loan) => loan.id === row.dataset.loanId ? { ...loan, confirmedEnded: false } : loan);
    updateState({ ...state });
  }
  if (action === "delete-loan" && row?.dataset.loanId) {
    if (!confirm("Excluir este parcelamento?")) return;
    updateState({ ...state, loans: state.loans.filter((loan) => loan.id !== row.dataset.loanId) });
  }
}

function submitBill(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  try {
    const bill = normalizeBill({ ...values, monthKey: state.monthKey });
    updateState({ ...state, bills: [...state.bills, bill] });
    event.currentTarget.reset();
    toast("Conta adicionada.");
  } catch {
    toast("Revise os dados da conta.");
  }
}

function submitSchedule(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  try {
    const sequence = generateMonthlySchedule(values);
    updateState({ ...state, bills: [...state.bills, ...sequence] });
    event.currentTarget.reset();
    toast(`${sequence.length} competências criadas.`);
  } catch {
    toast("Revise os dados da sequência.");
  }
}

function submitLoan(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  try {
    const loan = normalizeLoan(values);
    updateState({ ...state, loans: [...state.loans, loan] });
    event.currentTarget.reset();
    toast("Parcelamento adicionado.");
  } catch {
    toast("Revise os dados do parcelamento.");
  }
}

async function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const restored = normalizeBackup(await file.text());
    if (!confirm("Substituir os dados locais pelo backup selecionado?")) return;
    updateState(restored);
    toast("Backup restaurado.");
  } catch {
    toast("Backup incompatível ou corrompido.");
  } finally {
    event.target.value = "";
  }
}

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
