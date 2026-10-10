(function () {
  const SEED = [10,6,5,4,3,8,11,12,16,19,21,13,24,9,15,20,2,23,7,25,18,14,17,1,22];
  const HIT_BG = "#F7941E";
  const HIT_FG = "#06213F";
  const DIM = "0.4";
  const WIN = 15;
  const WIN_COLOR = "#22C55E";
  const KEY_SORTEIOS = "megasena.sorteios";
  const KEY_SELECAO = "megasena.selecao";
  const KEY_QTDE = "megasena.qtdeCartelas";
  const KEY_CARTELAS = "megasena.cartelas";
  const MAX_HIST = 50;
  const MAX_CARDS = 60;
  let PER_ROW = 5;

  function shuf(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function newCard() {
    return shuf([...Array(25).keys()]).slice(0, 20).map(function (i) { return SEED[i]; }).sort(function (a, b) { return a - b; });
  }
  function columnsForWidth(w) {
    if (w >= 1100) return 5;
    if (w >= 840) return 4;
    if (w >= 600) return 3;
    return 2;
  }

  const numSort = function (a, b) {
    return a.dataset.pencilName.localeCompare(b.dataset.pencilName, undefined, { numeric: true });
  };

  const style = document.createElement("style");
  style.textContent = [
    '[data-pencil-name="Btn Gerar"],[data-pencil-name="Btn Sortear"],[data-pencil-name="Btn Conferir"],[data-pencil-name="Btn Limpar"],[data-pencil-name="Btn WhatsApp"],[data-pencil-name="Btn Copiar"],[data-pencil-name="Qtde Menos"],[data-pencil-name="Qtde Mais"]{cursor:pointer;transition:filter .15s,transform .1s}',
    '[data-pencil-name="Btn WhatsApp"]:hover,[data-pencil-name="Btn Copiar"]:hover{filter:brightness(1.15)}',
    '[data-pencil-name="Btn WhatsApp"]:active,[data-pencil-name="Btn Copiar"]:active{transform:translateY(1px)}',
    '[data-pencil-name="Qtde Menos"]:hover,[data-pencil-name="Qtde Mais"]:hover{filter:brightness(1.3)}',
    '[data-pencil-name="Qtde Menos"]:active,[data-pencil-name="Qtde Mais"]:active{transform:scale(0.9)}',
    '[data-pencil-name="Btn Gerar"]:hover,[data-pencil-name="Btn Sortear"]:hover,[data-pencil-name="Btn Conferir"]:hover{filter:brightness(1.08)}',
    '[data-pencil-name="Btn Limpar"]:hover{filter:brightness(1.2)}',
    '[data-pencil-name="Btn Gerar"]:active,[data-pencil-name="Btn Sortear"]:active,[data-pencil-name="Btn Conferir"]:active,[data-pencil-name="Btn Limpar"]:active{transform:translateY(1px)}',
    '[data-pencil-name^="Célula"]{transition:background .2s,opacity .2s}',
    '[data-pencil-name^="Dezena "]{cursor:pointer;transition:background .15s,transform .1s,outline-color .15s}',
    '[data-pencil-name^="Dezena "]:hover{transform:scale(1.08)}',
    '[data-pencil-name^="Dezena "]:active{transform:scale(0.95)}',
    '.sorteio-item{display:flex;gap:14px;align-items:center;padding:11px 16px;background:#0A3B75;outline:1px solid #1A5CA0;outline-offset:-0.5px;border-radius:12px;cursor:pointer;transition:filter .15s}',
    '.sorteio-item:hover{filter:brightness(1.15)}',
    '.sorteio-item.active{outline:2px solid #F7941E}',
    '.sorteio-num{font-weight:700;color:#F7941E;min-width:44px;font-family:Inter,sans-serif}',
    '.sorteio-nums{color:#FFFFFF;font-family:"IBM Plex Mono",monospace;font-size:13px}',
    '.sorteio-wins{margin-left:auto;font-size:12px;font-weight:600;color:#A3C4EA;white-space:nowrap}',
    '[data-pencil-name="Painel - Competição"]{max-width:100vw}',
    '@media (max-width:1024px){',
    '  [data-pencil-name="Painel - Competição"]{width:100%!important;padding:24px 22px!important;gap:20px!important}',
    '  [data-pencil-name="Cabeçalho"]{flex-direction:column!important;align-items:stretch!important;gap:16px!important}',
    '  [data-pencil-name="Header Ações"]{flex-wrap:wrap!important;justify-content:flex-start!important;width:100%!important;max-width:100%!important}',
    '  [data-pencil-name="H1"]{font-size:26px!important;white-space:normal!important}',
    '  [data-pencil-name="Sub"]{font-size:13px!important;white-space:normal!important}',
    '  [data-pencil-name="Estatísticas"]{flex-wrap:wrap!important}',
    '  [data-pencil-name="Seed Valor"]{white-space:normal!important;font-size:12.5px!important;line-height:1.6!important}',
    '  [data-pencil-name="Conferência"]{flex-direction:column!important;align-items:stretch!important;gap:14px!important}',
    '  [data-pencil-name="Dezenas"]{flex-wrap:wrap!important;justify-content:center!important;gap:6px!important}',
    '  [data-pencil-name^="Dezena "]{width:38px!important;height:38px!important}',
    '  [data-pencil-name="Ações"]{flex-wrap:wrap!important;justify-content:center!important;width:100%!important;max-width:100%!important}',
    '  [data-pencil-name="Status"]{white-space:normal!important;text-align:center!important}',
    '  .sorteio-item{flex-wrap:wrap!important;gap:8px!important}',
    '  .sorteio-nums{white-space:normal!important;word-break:break-word;font-size:12px}',
    '  .sorteio-wins{margin-left:0!important}',
    '}',
    '@media (max-width:640px){',
    '  [data-pencil-name="Painel - Competição"]{padding:16px 12px!important;gap:16px!important}',
    '  [data-pencil-name="H1"]{font-size:21px!important}',
    '  [data-pencil-name="Grade"]{gap:12px!important}',
    '  [data-pencil-name^="Linha Grade"]{gap:12px!important}',
    '  [data-pencil-name^="Cartela "]{padding:10px!important;gap:8px!important}',
    '  [data-pencil-name^="Célula"]{height:34px!important;border-radius:8px!important}',
    '  [data-pencil-name^="Val "]{font-size:13px!important}',
    '  [data-pencil-name^="Dezena "]{width:32px!important;height:32px!important}',
    '  [data-pencil-name^="Dez Val "]{font-size:13px!important}',
    '  [data-pencil-name="Count"]{display:none!important}',
    '  [data-pencil-name="Label"]{font-size:10px!important;letter-spacing:.4px!important}',
    '  [data-pencil-name="Btn Gerar"],[data-pencil-name="Btn WhatsApp"],[data-pencil-name="Btn Copiar"],[data-pencil-name="Btn Sortear"],[data-pencil-name="Btn Conferir"],[data-pencil-name="Btn Limpar"]{padding:11px 14px!important}',
    '}'
  ].join("\n");
  document.head.appendChild(style);

  const grade = document.querySelector('[data-pencil-name="Grade"]');
  const cardNode = document.querySelector('[data-pencil-name="Cartela 01"]');
  const rowNode = document.querySelector('[data-pencil-name="Linha Grade 1"]');
  const cardTemplate = cardNode ? cardNode.cloneNode(true) : null;
  const rowTemplate = rowNode ? rowNode.cloneNode(true) : null;

  const selected = new Set();
  const chips = Array.from(document.querySelectorAll('[data-pencil-name^="Dezena "]')).map(function (chip) {
    const n = Number(chip.dataset.pencilName.split(" ")[1]);
    const val = chip.querySelector('[data-pencil-name^="Dez Val "]');
    return { el: chip, val: val, n: n };
  }).sort(function (a, b) { return a.n - b.n; });

  const status = document.querySelector('[data-pencil-name="Status"]');
  const pillGanhas = document.querySelector('[data-pencil-name="Pill Ganhas"]');
  const ganhasValor = document.querySelector('[data-pencil-name="Ganhas Valor"]');
  const sorteioNum = document.querySelector('[data-pencil-name="Sorteio Num"]');
  const histLista = document.querySelector('[data-pencil-name="Histórico Lista"]');
  const histVazio = document.querySelector('[data-pencil-name="Histórico Vazio"]');
  const qtdeValor = document.querySelector('[data-pencil-name="Qtde Valor"]');
  const qtdeMenos = document.querySelector('[data-pencil-name="Qtde Menos"]');
  const qtdeMais = document.querySelector('[data-pencil-name="Qtde Mais"]');
  const pillCartelas = document.querySelector('[data-pencil-name="Pill V Cartelas"]');

  function load(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function persistSelecao() {
    save(KEY_SELECAO, Array.from(selected).sort(function (a, b) { return a - b; }));
  }
  function pad2(n) { return String(n).padStart(2, "0"); }
  function numsLabel(nums) { return nums.map(pad2).join(" · "); }
  function cardKey(nums) { return nums.join(","); }
  function dupCount(list) {
    const seen = new Set();
    let d = 0;
    list.forEach(function (c) {
      const k = cardKey(c);
      if (seen.has(k)) d++; else seen.add(k);
    });
    return d;
  }

  let draws = load(KEY_SORTEIOS, []);
  let currentN = draws.length ? draws[draws.length - 1].n : 0;
  let activeDrawN = null;
  let qtde = Math.max(1, Math.min(MAX_CARDS, Number(load(KEY_QTDE, 20)) || 20));
  let cartelas = load(KEY_CARTELAS, null);
  let cards = [];

  function generateUniqueCards(n, existing) {
    const seen = new Set((existing || []).map(cardKey));
    const out = [];
    while (out.length < n) {
      const c = newCard();
      const k = cardKey(c);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(c);
    }
    return out;
  }

  function ensureCartelas() {
    if (!Array.isArray(cartelas)) cartelas = [];
    if (cartelas.length < qtde) {
      cartelas = cartelas.concat(generateUniqueCards(qtde - cartelas.length, cartelas));
    }
    if (cartelas.length > MAX_CARDS) cartelas = cartelas.slice(0, MAX_CARDS);
    save(KEY_CARTELAS, cartelas);
  }

  function dedupeCartelas() {
    if (!Array.isArray(cartelas)) return 0;
    const seen = new Set();
    let fixed = 0;
    for (let i = 0; i < cartelas.length; i++) {
      const k = cardKey(cartelas[i]);
      if (!seen.has(k)) { seen.add(k); continue; }
      let nc, nk;
      do { nc = newCard(); nk = cardKey(nc); } while (seen.has(nk));
      seen.add(nk);
      cartelas[i] = nc;
      fixed++;
    }
    if (fixed) save(KEY_CARTELAS, cartelas);
    return fixed;
  }

  function buildGrid() {
    if (!grade || !cardTemplate || !rowTemplate) return;
    grade.innerHTML = "";
    const rows = Math.ceil(qtde / PER_ROW);
    for (let r = 0; r < rows; r++) {
      const row = rowTemplate.cloneNode(false);
      row.setAttribute("data-pencil-name", "Linha Grade " + (r + 1));
      for (let c = 0; c < PER_ROW; c++) {
        const idx = r * PER_ROW + c;
        if (idx >= qtde) break;
        const cardEl = cardTemplate.cloneNode(true);
        cardEl.setAttribute("data-pencil-name", "Cartela " + pad2(idx + 1));
        const label = cardEl.querySelector('[data-pencil-name="Label"]');
        if (label) label.textContent = "CARTELA " + pad2(idx + 1);
        const vals = Array.from(cardEl.querySelectorAll('[data-pencil-name^="Val "]')).sort(numSort);
        const nums = cartelas[idx] || [];
        vals.forEach(function (v, i) { if (nums[i] != null) v.textContent = nums[i]; });
        const hits = cardEl.querySelector('[data-pencil-name="Hits"]');
        if (hits) { hits.textContent = "0 acertos"; hits.style.opacity = "0"; hits.style.color = ""; }
        row.appendChild(cardEl);
      }
      grade.appendChild(row);
    }
    cards = Array.from(grade.querySelectorAll('[data-pencil-name^="Cartela "]')).map(function (card, i) {
      return {
        el: card,
        idx: i,
        label: card.querySelector('[data-pencil-name="Label"]'),
        hits: card.querySelector('[data-pencil-name="Hits"]'),
        vals: Array.from(card.querySelectorAll('[data-pencil-name^="Val "]')).sort(numSort)
      };
    });
    if (qtdeValor) qtdeValor.textContent = qtde;
    if (pillCartelas) pillCartelas.textContent = qtde;
  }

  function hitsFor(nums) {
    const set = new Set(nums);
    let wins = 0, best = 0;
    cards.forEach(function (c) {
      let hits = 0;
      c.vals.forEach(function (v) { if (set.has(Number(v.textContent))) hits++; });
      if (hits > best) best = hits;
      if (hits >= WIN) wins++;
    });
    return { wins: wins, best: best };
  }

  function paintChip(c) {
    const on = selected.has(c.n);
    c.el.style.background = on ? HIT_BG : "";
    c.el.style.outline = on ? "2px solid #FFC46B" : "";
    if (c.val) c.val.style.color = on ? HIT_FG : "";
  }

  function updateBadge() {
    if (sorteioNum) sorteioNum.textContent = "#" + currentN;
  }

  function renderHistorico() {
    if (!histLista) return;
    Array.from(histLista.querySelectorAll(".sorteio-item")).forEach(function (el) { el.remove(); });
    if (histVazio) histVazio.style.display = draws.length ? "none" : "";
    draws.slice().reverse().forEach(function (d) {
      const item = document.createElement("div");
      item.className = "sorteio-item" + (d.n === activeDrawN ? " active" : "");
      const st = hitsFor(d.nums);
      item.innerHTML =
        '<span class="sorteio-num">#' + d.n + "</span>" +
        '<span class="sorteio-nums">' + numsLabel(d.nums) + "</span>" +
        '<span class="sorteio-wins">' + st.wins + (st.wins === 1 ? " ganha" : " ganhas") + " · melhor " + st.best + "</span>";
      item.addEventListener("click", function () {
        selected.clear();
        d.nums.forEach(function (n) { selected.add(n); });
        chips.forEach(paintChip);
        activeDrawN = d.n;
        persistSelecao();
        conferir();
        renderHistorico();
      });
      histLista.appendChild(item);
    });
  }

  function parseDraw() {
    return Array.from(selected).sort(function (a, b) { return a - b; });
  }

  function clearMarks(c) {
    c.vals.forEach(function (v) {
      v.parentElement.style.background = "";
      v.parentElement.style.opacity = "";
      v.style.color = "";
    });
    if (c.hits) {
      c.hits.style.opacity = "0";
      c.hits.style.color = "";
    }
    c.el.style.outline = "";
  }

  function conferir() {
    const draw = parseDraw();
    const set = new Set(draw);
    let best = { hits: -1, labels: [] };
    let wins = 0;
    cards.forEach(function (c) {
      let hits = 0;
      c.vals.forEach(function (v) {
        const n = Number(v.textContent);
        const cell = v.parentElement;
        if (set.has(n)) {
          hits++;
          cell.style.background = HIT_BG;
          cell.style.opacity = "1";
          v.style.color = HIT_FG;
        } else {
          cell.style.background = "";
          cell.style.opacity = draw.length ? DIM : "";
          v.style.color = "";
        }
      });
      const won = hits >= WIN;
      if (won) wins++;
      c.won = won;
      if (c.hits) {
        c.hits.textContent = won ? "GANHOU · " + hits : hits + (hits === 1 ? " acerto" : " acertos");
        c.hits.style.opacity = draw.length ? "1" : "0";
        c.hits.style.color = won ? WIN_COLOR : (hits ? "#F7941E" : "#A3C4EA");
      }
      if (hits > best.hits) best = { hits: hits, labels: [c.label.textContent] };
      else if (hits === best.hits) best.labels.push(c.label.textContent);
    });
    cards.forEach(function (c) {
      const isBest = draw.length && best.hits > 0 && !c.won && best.labels.indexOf(c.label.textContent) >= 0;
      c.el.style.outline = c.won ? "2px solid " + WIN_COLOR : (isBest ? "2px solid #F7941E" : "");
    });
    if (ganhasValor) {
      ganhasValor.textContent = wins + (wins === 1 ? " ganha" : " ganhas");
      ganhasValor.style.color = wins > 0 ? WIN_COLOR : "#A3C4EA";
    }
    if (pillGanhas) {
      pillGanhas.style.outline = wins > 0 ? "1px solid " + WIN_COLOR : "";
    }
    if (!status) return;
    if (!draw.length) {
      status.textContent = "Clique nas dezenas do sorteio para conferir";
      status.style.color = "#A3C4EA";
      return;
    }
    const shown = best.labels.length > 3 ? best.labels.slice(0, 3).join(", ") + "…" : best.labels.join(" e ");
    const bestText = best.hits > 0
      ? shown + " — " + best.hits + (best.hits === 1 ? " acerto" : " acertos")
      : "nenhum acerto";
    const winText = wins > 0 ? wins + (wins === 1 ? " GANHA" : " GANHAS") + " · " : "";
    const drawLabel = activeDrawN ? "Sorteio #" + activeDrawN + " · " : "";
    status.textContent = drawLabel + draw.length + " números · " + winText + "melhor cartela: " + bestText;
    status.style.color = wins > 0 ? WIN_COLOR : "#F7941E";
  }

  function sortear() {
    const nums = parseDraw();
    if (!nums.length) {
      if (status) {
        status.textContent = "Selecione as dezenas do sorteio antes de clicar em Sortear";
        status.style.color = "#F7941E";
      }
      return;
    }
    currentN++;
    draws.push({ n: currentN, nums: nums, ts: Date.now() });
    if (draws.length > MAX_HIST) draws = draws.slice(-MAX_HIST);
    save(KEY_SORTEIOS, draws);
    persistSelecao();
    activeDrawN = currentN;
    updateBadge();
    renderHistorico();
    conferir();
    if (sorteioNum && sorteioNum.animate) sorteioNum.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "ease-out" }
    );
  }

  function limpar() {
    selected.clear();
    activeDrawN = null;
    chips.forEach(paintChip);
    cards.forEach(clearMarks);
    persistSelecao();
    conferir();
    renderHistorico();
  }

  function regenerate() {
    cartelas = generateUniqueCards(qtde);
    save(KEY_CARTELAS, cartelas);
    cards.forEach(function (c) {
      const nums = cartelas[c.idx] || [];
      nums.forEach(function (n, i) { if (c.vals[i]) c.vals[i].textContent = n; });
      if (c.el.animate) c.el.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.975)" }, { transform: "scale(1)" }],
        { duration: 240, easing: "ease-out" }
      );
    });
    renderHistorico();
    conferir();
  }

  function changeQtde(delta) {
    const next = Math.max(1, Math.min(MAX_CARDS, qtde + delta));
    if (next === qtde) return;
    qtde = next;
    save(KEY_QTDE, qtde);
    ensureCartelas();
    buildGrid();
    renderHistorico();
    conferir();
  }

  chips.forEach(function (c) {
    c.el.addEventListener("click", function () {
      if (selected.has(c.n)) selected.delete(c.n);
      else selected.add(c.n);
      paintChip(c);
      persistSelecao();
      conferir();
    });
  });

  function exportText() {
    const list = cartelas.slice(0, qtde);
    const header = "MEGA-SENA · " + list.length + (list.length === 1 ? " cartela" : " cartelas") +
      (activeDrawN ? " · Sorteio #" + activeDrawN : "");
    const blocks = list.map(function (nums, i) {
      const rows = [];
      for (let r = 0; r < 4; r++) rows.push(nums.slice(r * 5, r * 5 + 5).map(pad2).join(" "));
      return "CARTELA " + pad2(i + 1) + "\n" + rows.join("\n");
    });
    return header + "\n\n" + blocks.join("\n\n");
  }

  function legacyCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }

  function copyText(text) {
    return new Promise(function (resolve) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { resolve(true); }, function () { resolve(legacyCopy(text)); });
      } else {
        resolve(legacyCopy(text));
      }
    });
  }

  const btnGerar = document.querySelector('[data-pencil-name="Btn Gerar"]');
  const btnSortear = document.querySelector('[data-pencil-name="Btn Sortear"]');
  const btnConferir = document.querySelector('[data-pencil-name="Btn Conferir"]');
  const btnLimpar = document.querySelector('[data-pencil-name="Btn Limpar"]');
  const btnWhats = document.querySelector('[data-pencil-name="Btn WhatsApp"]');
  const btnCopiar = document.querySelector('[data-pencil-name="Btn Copiar"]');
  const copiarLabel = document.querySelector('[data-pencil-name="Btn Copiar Label"]');
  if (btnGerar) btnGerar.addEventListener("click", regenerate);
  if (btnSortear) btnSortear.addEventListener("click", sortear);
  if (btnConferir) btnConferir.addEventListener("click", conferir);
  if (btnLimpar) btnLimpar.addEventListener("click", limpar);
  if (btnWhats) btnWhats.addEventListener("click", function () {
    window.open("https://wa.me/?text=" + encodeURIComponent(exportText()), "_blank");
  });
  if (btnCopiar) btnCopiar.addEventListener("click", function () {
    copyText(exportText()).then(function (ok) {
      if (!copiarLabel) return;
      copiarLabel.textContent = ok ? "Copiado!" : "Falhou :(";
      setTimeout(function () { copiarLabel.textContent = "Copiar"; }, 1600);
    });
  });
  if (qtdeMenos) qtdeMenos.addEventListener("click", function () { changeQtde(-1); });
  if (qtdeMais) qtdeMais.addEventListener("click", function () { changeQtde(1); });

  ensureCartelas();
  const dedupFixed = dedupeCartelas();
  PER_ROW = columnsForWidth(window.innerWidth || 1440);
  buildGrid();

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const next = columnsForWidth(window.innerWidth || 1440);
      if (next !== PER_ROW) {
        PER_ROW = next;
        buildGrid();
        conferir();
      }
    }, 180);
  });

  const savedSel = load(KEY_SELECAO, null);
  if (savedSel && savedSel.length) {
    savedSel.forEach(function (n) { selected.add(n); });
    if (draws.length) activeDrawN = draws[draws.length - 1].n;
  } else if (draws.length) {
    draws[draws.length - 1].nums.forEach(function (n) { selected.add(n); });
    activeDrawN = draws[draws.length - 1].n;
  }
  chips.forEach(paintChip);
  updateBadge();
  renderHistorico();
  conferir();

  window.megaDebug = {
    cartelas: function () { return cartelas.slice(0, qtde); },
    texto: function () { return exportText(); },
    duplicadas: function () { return dupCount(cartelas.slice(0, qtde)); },
    repetidasDetalhe: function () {
      const seen = new Map(), out = [];
      cartelas.slice(0, qtde).forEach(function (c, i) {
        const k = cardKey(c);
        if (seen.has(k)) out.push({ cartela: i + 1, igualA: seen.get(k) + 1 });
        else seen.set(k, i + 1);
      });
      return out;
    }
  };
  console.log("[Cartelas] ativas: " + qtde + " · duplicadas: " + window.megaDebug.duplicadas() +
    (dedupFixed ? " (corrigidas " + dedupFixed + ")" : ""));
  if (dedupFixed && status) {
    status.textContent = "Atenção: " + dedupFixed + " cartela(s) repetida(s) foram regeneradas automaticamente";
    status.style.color = "#F7941E";
    setTimeout(conferir, 4500);
  }
})();
