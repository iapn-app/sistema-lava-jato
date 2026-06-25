// ==========================================
// ESTADO DO SISTEMA (localStorage)
// ==========================================
let state = {
  cars: [],
  transactions: [],
  inventory: []
};

// Dados semente para inicialização do sistema caso esteja vazio
const seedData = {
  cars: [
    {
      id: "car-1",
      model: "Civic",
      plate: "LHK4J12",
      owner: "Carlos Eduardo",
      service: "Lavagem Completa",
      price: 70.00,
      status: "Na Fila",
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: "car-2",
      model: "Corolla",
      plate: "ONX9A88",
      owner: "Ana Souza",
      service: "Lavagem & Cera",
      price: 95.00,
      status: "Lavando",
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: "car-3",
      model: "Compass",
      plate: "ABC1234",
      owner: "Roberto Lima",
      service: "Polimento & Higienização",
      price: 280.00,
      status: "Concluído",
      date: new Date().toISOString().split('T')[0]
    }
  ],
  transactions: [
    {
      id: "trans-1",
      description: "Lavagem Civic - LHK4J12",
      type: "Receita",
      value: 70.00,
      category: "Serviços",
      date: new Date().toISOString().split('T')[0],
      status: "Pendente"
    },
    {
      id: "trans-2",
      description: "Lavagem Corolla - ONX9A88",
      type: "Receita",
      value: 95.00,
      category: "Serviços",
      date: new Date().toISOString().split('T')[0],
      status: "Confirmado"
    },
    {
      id: "trans-3",
      description: "Lavagem Compass - ABC1234",
      type: "Receita",
      value: 280.00,
      category: "Serviços",
      date: new Date().toISOString().split('T')[0],
      status: "Confirmado"
    },
    {
      id: "trans-4",
      description: "Sabão Automotivo Concentrado 20L",
      type: "Despesa",
      value: 120.00,
      category: "Insumos",
      date: new Date().toISOString().split('T')[0],
      status: "Confirmado"
    },
    {
      id: "trans-5",
      description: "Conta de Água Sabesp",
      type: "Despesa",
      value: 350.00,
      category: "Infraestrutura",
      date: new Date().toISOString().split('T')[0],
      status: "Pendente"
    }
  ],
  inventory: [
    {
      id: "inv-1",
      name: "Shampoo Automotivo Concentrado",
      quantity: 12.0,
      unit: "Litros",
      consumption: 3.0 // Consumo médio diário
    },
    {
      id: "inv-2",
      name: "Cera de Carnaúba Líquida",
      quantity: 8.0,
      unit: "Litros",
      consumption: 1.2
    },
    {
      id: "inv-3",
      name: "Pretinho Especial para Pneus",
      quantity: 1.5,
      unit: "Litros",
      consumption: 0.5
    },
    {
      id: "inv-4",
      name: "Panos de Microfibra",
      quantity: 30.0,
      unit: "Unidades",
      consumption: 2.0
    }
  ]
};

// Inicialização do localStorage
function initStorage() {
  const storedCars = localStorage.getItem("bubblewash_cars");
  const storedTransactions = localStorage.getItem("bubblewash_transactions");
  const storedInventory = localStorage.getItem("bubblewash_inventory");

  if (!storedCars || !storedTransactions || !storedInventory) {
    state.cars = seedData.cars;
    state.transactions = seedData.transactions;
    state.inventory = seedData.inventory;
    saveState();
  } else {
    state.cars = JSON.parse(storedCars);
    state.transactions = JSON.parse(storedTransactions);
    state.inventory = JSON.parse(storedInventory);
  }
}

function saveState() {
  localStorage.setItem("bubblewash_cars", JSON.stringify(state.cars));
  localStorage.setItem("bubblewash_transactions", JSON.stringify(state.transactions));
  localStorage.setItem("bubblewash_inventory", JSON.stringify(state.inventory));
}

// ==========================================
// ROTEAMENTO DA SPA (INTERFACES E EXIBIÇÃO)
// ==========================================
let currentView = "dashboard";

function switchView(viewName) {
  currentView = viewName;
  
  // Atualizar visibilidade das seções
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.add("hidden");
  });
  const activeSection = document.getElementById(`view-${viewName}`);
  if (activeSection) {
    activeSection.classList.remove("hidden");
  }

  // Atualizar botões de navegação lateral (Desktop)
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.className = "nav-btn w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-slate-100";
  });
  const activeBtn = document.getElementById(`nav-${viewName}`);
  if (activeBtn) {
    activeBtn.className = "nav-btn w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 bg-brand-600 text-white shadow-lg shadow-brand-500/20";
  }

  // Atualizar botões no Menu Mobile
  document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
    btn.className = "mobile-nav-btn w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-xl";
  });
  
  // Atualizar Títulos da Página
  const titles = {
    dashboard: { title: "Painel Inicial", sub: "Fluxo operacional e métricas rápidas" },
    vehicles: { title: "Controle da Fila", sub: "Status e listagem de lavagens ativas" },
    cashflow: { title: "Fluxo de Caixa", sub: "Gestão de contas a pagar e a receber" },
    inventory: { title: "Estoque Inteligente", sub: "Autonomia de insumos e alertas automáticos" }
  };
  
  document.getElementById("page-title").textContent = titles[viewName].title;
  document.getElementById("page-subtitle").textContent = titles[viewName].sub;

  // Renderizar a tela apropriada
  renderView();
}

function renderView() {
  // Renderizar alertas do cabeçalho que persistem em todas as abas
  checkCriticalStockAlert();

  if (currentView === "dashboard") {
    renderDashboard();
  } else if (currentView === "vehicles") {
    renderVehiclesList();
  } else if (currentView === "cashflow") {
    renderCashFlowList();
  } else if (currentView === "inventory") {
    renderInventoryList();
  }
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuBtn && mobileMenuClose && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => mobileMenu.classList.remove("hidden"));
  mobileMenuClose.addEventListener("click", () => mobileMenu.classList.add("hidden"));
}
function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.add("hidden");
}

// ==========================================
// TOAST NOTIFICATIONS (ALERTAS DE INTERAÇÃO)
// ==========================================
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `flex items-center p-4 w-full max-w-xs text-slate-100 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-2 opacity-0 `;
  
  if (type === "success") {
    toast.className += "bg-slate-900 border-emerald-500/30 text-emerald-400";
  } else if (type === "error") {
    toast.className += "bg-slate-900 border-rose-500/30 text-rose-400";
  } else {
    toast.className += "bg-slate-900 border-amber-500/30 text-amber-400";
  }

  // Icon HTML based on type
  const icon = type === "success" 
    ? `<svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`
    : `<svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;

  toast.innerHTML = `
    <div class="flex items-center">
      ${icon}
      <div class="text-xs font-semibold text-slate-200">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// ==========================================
// CONTROLE INTELIGENTE DE ALERTA DE ESTOQUE
// ==========================================
function checkCriticalStockAlert() {
  // Procura produtos com autonomia menor que 5 dias
  const criticalItems = state.inventory.filter(item => {
    if (item.consumption <= 0) return false;
    const autonomy = item.quantity / item.consumption;
    return autonomy < 5;
  });

  const headerAlert = document.getElementById("header-stock-alert");
  if (headerAlert) {
    if (criticalItems.length > 0) {
      headerAlert.classList.remove("hidden");
      headerAlert.querySelector("span").nextSibling.textContent = ` ${criticalItems.length} Insumo(s) Acabando!`;
    } else {
      headerAlert.classList.add("hidden");
    }
  }

  // Atualiza painel do Dashboard se disponível
  const dashStockText = document.getElementById("dash-stat-stock");
  const dashStockContainer = document.getElementById("dash-stat-stock-container");
  const dashStockIcon = document.getElementById("dash-stat-stock-icon");

  if (dashStockText && dashStockContainer) {
    if (criticalItems.length > 0) {
      dashStockText.textContent = `${criticalItems.length} Críticos`;
      dashStockText.className = "text-2xl font-bold text-rose-400";
      dashStockContainer.className = "p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 animate-pulse";
      dashStockIcon.className = "h-6 w-6 text-rose-400";
      dashStockIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />`;
    } else {
      dashStockText.textContent = "Estoque Seguro";
      dashStockText.className = "text-2xl font-bold text-emerald-400";
      dashStockContainer.className = "p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20";
      dashStockIcon.className = "h-6 w-6 text-emerald-400";
      dashStockIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />`;
    }
  }

  // Atualiza banner crítico do estoque se disponível
  const criticalBanner = document.getElementById("inventory-critical-banner");
  if (criticalBanner) {
    if (criticalItems.length > 0) {
      criticalBanner.classList.remove("hidden");
    } else {
      criticalBanner.classList.add("hidden");
    }
  }
}

// ==========================================
// VIEW 1: LÓGICA DO PAINEL INICIAL (DASHBOARD)
// ==========================================
function renderDashboard() {
  // 1. Filtrar carros da fila de hoje
  const activeCars = state.cars.filter(c => c.status !== "Entregue");
  
  const fila = activeCars.filter(c => c.status === "Na Fila");
  const lavando = activeCars.filter(c => c.status === "Lavando");
  const concluido = activeCars.filter(c => c.status === "Concluído");

  // Atualizar Estatísticas Rápidas
  document.getElementById("dash-stat-queue").textContent = fila.length;
  document.getElementById("dash-stat-washing").textContent = lavando.length;
  
  // Calcular receita do dia (receitas de lavagens confirmadas)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRevenue = state.transactions
    .filter(t => t.type === "Receita" && t.status === "Confirmado" && t.date === todayStr)
    .reduce((sum, t) => sum + parseFloat(t.value), 0);

  document.getElementById("dash-stat-revenue").textContent = `R$ ${todayRevenue.toFixed(2)}`;

  // Atualizar contadores das colunas
  document.getElementById("badge-count-fila").textContent = fila.length;
  document.getElementById("badge-count-lavando").textContent = lavando.length;
  document.getElementById("badge-count-concluido").textContent = concluido.length;

  // Renderizar Cards
  renderKanbanColumn("col-fila", fila, "fila");
  renderKanbanColumn("col-lavando", lavando, "lavando");
  renderKanbanColumn("col-concluido", concluido, "concluido");
}

function renderKanbanColumn(containerId, cars, columnType) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (cars.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
        <span class="text-xs">Nenhum veículo</span>
      </div>
    `;
    return;
  }

  cars.forEach(car => {
    const card = document.createElement("div");
    card.className = "glass-card rounded-xl p-4 space-y-3 hover:border-slate-600 transition duration-150 shadow-md group relative";
    
    // Status border color
    let statusClass = "border-l-2 border-l-blue-500";
    if (columnType === "lavando") statusClass = "border-l-2 border-l-amber-500";
    if (columnType === "concluido") statusClass = "border-l-2 border-l-emerald-500";
    
    card.className += ` ${statusClass}`;

    // Ações rápidas dependendo da coluna
    let actionButtons = "";
    if (columnType === "fila") {
      actionButtons = `
        <button onclick="advanceCarStatus('${car.id}', 'Lavando')" class="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-semibold rounded-lg text-xs transition duration-150 flex items-center justify-center">
          Iniciar Lavagem
          <svg class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>
      `;
    } else if (columnType === "lavando") {
      actionButtons = `
        <button onclick="advanceCarStatus('${car.id}', 'Concluído')" class="w-full py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-semibold rounded-lg text-xs transition duration-150 flex items-center justify-center">
          Concluir Lavagem
          <svg class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </button>
      `;
    } else if (columnType === "concluido") {
      actionButtons = `
        <button onclick="deliverVehicle('${car.id}')" class="w-full py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs transition duration-150 flex items-center justify-center">
          Entregar & Receber
          <svg class="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </button>
      `;
    }

    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-bold text-slate-100 text-sm group-hover:text-brand-400 transition">${car.model}</h4>
          <p class="text-xs text-slate-400 font-medium">${car.owner}</p>
        </div>
        <span class="text-xs font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-lg shadow-sm">${car.plate}</span>
      </div>
      
      <div class="flex justify-between items-center py-1.5 border-t border-b border-slate-800/40 text-xs">
        <span class="text-slate-400">${car.service}</span>
        <span class="font-bold text-slate-100">R$ ${car.price.toFixed(2)}</span>
      </div>
      
      <div class="pt-1 flex items-center space-x-2">
        ${actionButtons}
        <button onclick="openCarModal('${car.id}')" title="Editar Veículo" class="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition duration-150">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function advanceCarStatus(carId, newStatus) {
  const carIndex = state.cars.findIndex(c => c.id === carId);
  if (carIndex === -1) return;

  const car = state.cars[carIndex];
  car.status = newStatus;
  
  // Ao passar para Concluído, avisa o usuário
  if (newStatus === "Concluído") {
    showToast(`Lavagem do ${car.model} concluída! Pronto para entrega.`, "success");
    // Vincula ou atualiza a transação para o caixa como pendente se ainda não confirmada
    const trans = state.transactions.find(t => t.description.includes(car.plate));
    if (trans && trans.status === "Pendente") {
      // Deixa pendente até a entrega física do carro
    }
  } else if (newStatus === "Lavando") {
    showToast(`${car.model} entrou no box de lavagem.`, "info");
  }

  saveState();
  renderView();
}

function deliverVehicle(carId) {
  const carIndex = state.cars.findIndex(c => c.id === carId);
  if (carIndex === -1) return;

  const car = state.cars[carIndex];
  car.status = "Entregue";

  // Buscar transação financeira correspondente para marcar como confirmada
  const transIndex = state.transactions.findIndex(t => t.description.includes(car.plate));
  if (transIndex !== -1) {
    state.transactions[transIndex].status = "Confirmado";
    state.transactions[transIndex].date = new Date().toISOString().split('T')[0];
  } else {
    // Registra nova transação caso não exista
    state.transactions.push({
      id: "trans-" + Date.now(),
      description: `Lavagem ${car.model} - ${car.plate} (Entrega Direta)`,
      type: "Receita",
      value: car.price,
      category: "Serviços",
      date: new Date().toISOString().split('T')[0],
      status: "Confirmado"
    });
  }

  showToast(`Veículo ${car.model} entregue! Recebimento de R$ ${car.price.toFixed(2)} confirmado.`, "success");
  saveState();
  renderView();
}

// ==========================================
// VIEW 2: LÓGICA DA LISTAGEM DE VEÍCULOS
// ==========================================
function renderVehiclesList() {
  const tableBody = document.getElementById("vehicles-table-body");
  const emptyState = document.getElementById("vehicles-empty-state");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  
  const filterStatus = document.getElementById("filter-vehicle-status").value;
  
  // Filtrar veículos com base na seleção
  const filteredCars = state.cars.filter(car => {
    if (filterStatus === "todos") return true;
    return car.status === filterStatus;
  });

  if (filteredCars.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  filteredCars.forEach(car => {
    const row = document.createElement("tr");
    row.className = "hover:bg-slate-900/30 transition border-b border-slate-800/40 text-slate-300";

    // Badges de status
    let badgeClass = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    if (car.status === "Lavando") badgeClass = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    if (car.status === "Concluído") badgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (car.status === "Entregue") badgeClass = "bg-slate-800 text-slate-400 border border-slate-700";

    row.innerHTML = `
      <td class="px-6 py-4 font-semibold text-slate-100">
        <div class="flex items-center space-x-2">
          <span>${car.model}</span>
          <span class="text-[10px] font-mono bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400 uppercase">${car.plate}</span>
        </div>
      </td>
      <td class="px-6 py-4">${car.owner}</td>
      <td class="px-6 py-4">
        <div class="text-xs text-slate-400">${car.service}</div>
        <div class="font-bold text-slate-200">R$ ${car.price.toFixed(2)}</div>
      </td>
      <td class="px-6 py-4">
        <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${badgeClass}">
          ${car.status}
        </span>
      </td>
      <td class="px-6 py-4 text-xs text-slate-400">${formatDateString(car.date)}</td>
      <td class="px-6 py-4 text-right space-x-1.5">
        <button onclick="openCarModal('${car.id}')" class="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-lg transition duration-150">
          Editar
        </button>
        <button onclick="deleteCar('${car.id}')" class="text-xs px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 border border-rose-500/20 font-semibold rounded-lg transition duration-150">
          Excluir
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function deleteCar(id) {
  if (confirm("Tem certeza que deseja remover este veículo da fila?")) {
    state.cars = state.cars.filter(c => c.id !== id);
    showToast("Veículo removido com sucesso.", "info");
    saveState();
    renderView();
  }
}

// ==========================================
// VIEW 3: LÓGICA DO FLUXO DE CAIXA
// ==========================================
function renderCashFlowList() {
  const tableBody = document.getElementById("cashflow-table-body");
  const emptyState = document.getElementById("cashflow-empty-state");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const filterType = document.getElementById("filter-cash-type").value;

  // Filtrar Lançamentos
  const filteredTrans = state.transactions.filter(t => {
    if (filterType === "todos") return true;
    if (filterType === "Receita" || filterType === "Despesa") return t.type === filterType;
    return t.status === filterType; // Confirmado ou Pendente
  });

  // Ordenar mais recentes primeiro
  filteredTrans.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calcular Estatísticas
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  let pendingIncome = 0;
  let pendingExpense = 0;

  state.transactions.forEach(t => {
    const val = parseFloat(t.value);
    if (t.type === "Receita") {
      totalIncome += val;
      if (t.status === "Pendente") pendingIncome += val;
      if (t.status === "Confirmado") totalBalance += val;
    } else {
      totalExpense += val;
      if (t.status === "Pendente") pendingExpense += val;
      if (t.status === "Confirmado") totalBalance -= val;
    }
  });

  // Atualizar cards de estatísticas financeiras
  document.getElementById("cash-stat-total-balance").textContent = `R$ ${totalBalance.toFixed(2)}`;
  document.getElementById("cash-stat-total-balance").className = `text-2xl font-black mt-1 ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
  document.getElementById("cash-stat-total-income").textContent = `R$ ${totalIncome.toFixed(2)}`;
  document.getElementById("cash-stat-total-expense").textContent = `R$ ${totalExpense.toFixed(2)}`;
  document.getElementById("cash-stat-pending-income").textContent = `R$ ${pendingIncome.toFixed(2)} pendente`;
  document.getElementById("cash-stat-pending-expense").textContent = `R$ ${pendingExpense.toFixed(2)} pendente`;

  if (filteredTrans.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  filteredTrans.forEach(t => {
    const row = document.createElement("tr");
    row.className = "hover:bg-slate-900/30 transition border-b border-slate-800/40 text-slate-300";

    const typeBadge = t.type === "Receita" 
      ? `<span class="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>Receita</span>`
      : `<span class="inline-flex items-center text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5"></span>Despesa</span>`;

    const statusBadge = t.status === "Confirmado"
      ? `<span class="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-semibold">Confirmado</span>`
      : `<span class="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">Pendente</span>`;

    const valueClass = t.type === "Receita" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold";
    const valuePrefix = t.type === "Receita" ? "+" : "-";

    // Ações para lançamentos pendentes
    const payAction = t.status === "Pendente" 
      ? `<button onclick="confirmTransaction('${t.id}')" class="text-xs px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition duration-150">Confirmar</button>`
      : "";

    row.innerHTML = `
      <td class="px-6 py-4 font-semibold text-slate-100">${t.description}</td>
      <td class="px-6 py-4">${t.category}</td>
      <td class="px-6 py-4 text-xs text-slate-400">${formatDateString(t.date)}</td>
      <td class="px-6 py-4">${typeBadge}</td>
      <td class="px-6 py-4 ${valueClass}">${valuePrefix} R$ ${parseFloat(t.value).toFixed(2)}</td>
      <td class="px-6 py-4">${statusBadge}</td>
      <td class="px-6 py-4 text-right space-x-1.5">
        ${payAction}
        <button onclick="openCashModal('${t.id}')" class="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-lg transition duration-150">
          Editar
        </button>
        <button onclick="deleteTransaction('${t.id}')" class="text-xs px-2 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 border border-rose-500/20 font-semibold rounded-lg transition duration-150">
          Excluir
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function confirmTransaction(id) {
  const transIndex = state.transactions.findIndex(t => t.id === id);
  if (transIndex === -1) return;

  state.transactions[transIndex].status = "Confirmado";
  state.transactions[transIndex].date = new Date().toISOString().split('T')[0];

  // Se for associado a um carro Concluído, marcar carro como Entregue
  const trans = state.transactions[transIndex];
  const carIndex = state.cars.findIndex(c => trans.description.includes(c.plate) && c.status === "Concluído");
  if (carIndex !== -1) {
    state.cars[carIndex].status = "Entregue";
  }

  showToast("Transação confirmada no caixa!", "success");
  saveState();
  renderView();
}

function deleteTransaction(id) {
  if (confirm("Remover esta transação financeira?")) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    showToast("Transação excluída.", "info");
    saveState();
    renderView();
  }
}

// ==========================================
// VIEW 4: LÓGICA DO ESTOQUE INTELIGENTE
// ==========================================
function renderInventoryList() {
  const grid = document.getElementById("inventory-grid");
  const emptyState = document.getElementById("inventory-empty-state");
  if (!grid) return;

  grid.innerHTML = "";

  const filterStatus = document.getElementById("filter-inventory-status").value;

  const filteredItems = state.inventory.filter(item => {
    if (filterStatus === "todos") return true;
    const autonomy = item.consumption > 0 ? (item.quantity / item.consumption) : 999;
    if (filterStatus === "critico") return autonomy < 5;
    return autonomy >= 5;
  });

  // Atualizar Stats
  document.getElementById("inventory-stat-total-items").textContent = state.inventory.length;
  
  const criticalCount = state.inventory.filter(item => {
    if (item.consumption <= 0) return false;
    return (item.quantity / item.consumption) < 5;
  }).length;
  
  document.getElementById("inventory-stat-critical-items").textContent = criticalCount;

  if (filteredItems.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  filteredItems.forEach(item => {
    const card = document.createElement("div");
    
    // Cálculo da autonomia estimada
    const autonomy = item.consumption > 0 ? (item.quantity / item.consumption) : 0;
    const isCritical = item.consumption > 0 && autonomy < 5;

    // Card border e background dependendo do perigo
    let cardStyle = "glass-card border-slate-800/80";
    let badgeHTML = "";

    if (isCritical) {
      cardStyle = "bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50 shadow-rose-950/10";
      badgeHTML = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
          ⚠️ Material Acabando
        </span>
      `;
    } else {
      badgeHTML = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Estoque Seguro
        </span>
      `;
    }

    card.className = `p-5 rounded-2xl border transition duration-200 relative flex flex-col justify-between h-56 ${cardStyle}`;

    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-start">
          <h4 class="font-bold text-slate-100 text-sm md:text-base group-hover:text-brand-400 pr-2">${item.name}</h4>
          ${badgeHTML}
        </div>
        
        <div class="flex items-baseline space-x-1.5 py-1">
          <span class="text-3xl font-black text-slate-100">${item.quantity}</span>
          <span class="text-xs text-slate-400 font-medium">${item.unit}</span>
        </div>
      </div>

      <div class="border-t border-slate-800/50 pt-3 space-y-2">
        <div class="flex justify-between text-xs text-slate-400">
          <span>Consumo Médio:</span>
          <span class="font-semibold text-slate-200">${item.consumption.toFixed(1)} ${item.unit}/dia</span>
        </div>
        
        <div class="flex justify-between text-xs text-slate-400">
          <span>Autonomia Estimada:</span>
          <span class="font-bold ${isCritical ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}">
            ${item.consumption > 0 ? `${autonomy.toFixed(1)} dias` : 'Sem consumo'}
          </span>
        </div>
      </div>

      <div class="pt-3 flex items-center justify-between gap-1 border-t border-slate-800/30">
        <div class="flex space-x-1">
          <button onclick="quickStockAdd('${item.id}', 5)" title="Abastecer +5" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 rounded-lg transition">+5</button>
          <button onclick="quickStockAdd('${item.id}', 10)" title="Abastecer +10" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 rounded-lg transition">+10</button>
        </div>
        
        <div class="flex space-x-1">
          <button onclick="openInventoryModal('${item.id}')" title="Editar" class="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button onclick="deleteInventoryItem('${item.id}')" title="Remover" class="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function quickStockAdd(id, val) {
  const itemIndex = state.inventory.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  state.inventory[itemIndex].quantity = parseFloat((state.inventory[itemIndex].quantity + val).toFixed(2));
  
  // Registra a transação de despesa do produto de forma simulada no caixa
  const item = state.inventory[itemIndex];
  const totalCost = val * 8.5; // Custo estimado por unidade R$ 8.50
  state.transactions.push({
    id: "trans-" + Date.now(),
    description: `Reabastecimento: +${val}${item.unit.charAt(0)} de ${item.name}`,
    type: "Despesa",
    value: totalCost,
    category: "Insumos",
    date: new Date().toISOString().split('T')[0],
    status: "Confirmado"
  });

  showToast(`Abastecido +${val} ${item.unit} de ${item.name}. Custo estimado: R$ ${totalCost.toFixed(2)}`, "success");
  saveState();
  renderView();
}

function deleteInventoryItem(id) {
  if (confirm("Remover este produto do estoque?")) {
    state.inventory = state.inventory.filter(item => item.id !== id);
    showToast("Material removido do estoque.", "info");
    saveState();
    renderView();
  }
}

// ==========================================
// MODAL: LÓGICA E MANIPULAÇÃO DE CARROS
// ==========================================
const carModal = document.getElementById("modal-car");

function openCarModal(id = "") {
  document.getElementById("form-car").reset();
  document.getElementById("car-id").value = "";
  document.getElementById("modal-car-title").textContent = "Adicionar Veículo à Fila";

  if (id) {
    const car = state.cars.find(c => c.id === id);
    if (car) {
      document.getElementById("modal-car-title").textContent = "Editar Veículo";
      document.getElementById("car-id").value = car.id;
      document.getElementById("car-model").value = car.model;
      document.getElementById("car-plate").value = car.plate;
      document.getElementById("car-owner").value = car.owner;
      document.getElementById("car-service").value = car.service;
      document.getElementById("car-price").value = car.price;
      document.getElementById("car-status").value = car.status;
    }
  } else {
    // Definir preço padrão para o primeiro serviço selecionado
    autoFillPrice();
  }
  carModal.classList.remove("hidden");
}

function closeCarModal() {
  carModal.classList.add("hidden");
}

function autoFillPrice() {
  const service = document.getElementById("car-service").value;
  const prices = {
    "Ducha Simples": 40.00,
    "Lavagem Completa": 70.00,
    "Lavagem & Cera": 95.00,
    "Polimento & Higienização": 280.00
  };
  document.getElementById("car-price").value = prices[service] || 50.00;
}

function saveCar(event) {
  event.preventDefault();
  
  const id = document.getElementById("car-id").value;
  const model = document.getElementById("car-model").value.trim();
  const plate = document.getElementById("car-plate").value.trim().toUpperCase();
  const owner = document.getElementById("car-owner").value.trim();
  const service = document.getElementById("car-service").value;
  const price = parseFloat(document.getElementById("car-price").value);
  const status = document.getElementById("car-status").value;

  if (id) {
    // Modo Edição
    const index = state.cars.findIndex(c => c.id === id);
    if (index !== -1) {
      state.cars[index] = { ...state.cars[index], model, plate, owner, service, price, status };
      showToast("Veículo atualizado!", "success");
      
      // Atualiza também a descrição da transação se ela existir no caixa e não estiver concluída
      const transIndex = state.transactions.findIndex(t => t.description.includes(plate));
      if (transIndex !== -1 && state.transactions[transIndex].status === "Pendente") {
        state.transactions[transIndex].value = price;
        state.transactions[transIndex].description = `Lavagem ${model} - ${plate}`;
      }
    }
  } else {
    // Modo Criação
    const newCar = {
      id: "car-" + Date.now(),
      model,
      plate,
      owner,
      service,
      price,
      status,
      date: new Date().toISOString().split('T')[0]
    };
    state.cars.push(newCar);

    // Registra transação no fluxo de caixa (Pendente ou Confirmada baseando-se no status de entrada)
    const isConfirmed = status === "Concluído";
    state.transactions.push({
      id: "trans-" + Date.now(),
      description: `Lavagem ${model} - ${plate}`,
      type: "Receita",
      value: price,
      category: "Serviços",
      date: new Date().toISOString().split('T')[0],
      status: isConfirmed ? "Confirmado" : "Pendente"
    });

    showToast("Veículo adicionado com sucesso!", "success");
  }

  saveState();
  closeCarModal();
  renderView();
}

// ==========================================
// MODAL: LÓGICA DO FINANCEIRO (CAIXA)
// ==========================================
const cashModal = document.getElementById("modal-cash");

function openCashModal(id = "") {
  document.getElementById("form-cash").reset();
  document.getElementById("cash-id").value = "";
  document.getElementById("cash-date").value = new Date().toISOString().split('T')[0];
  document.getElementById("modal-cash-title").textContent = "Nova Transação Financeira";

  if (id) {
    const t = state.transactions.find(trans => trans.id === id);
    if (t) {
      document.getElementById("modal-cash-title").textContent = "Editar Transação";
      document.getElementById("cash-id").value = t.id;
      document.getElementById("cash-description").value = t.description;
      document.getElementById("cash-value").value = t.value;
      document.getElementById("cash-date").value = t.date;
      document.getElementById("cash-category").value = t.category;
      document.getElementById("cash-status").value = t.status;
      
      // Ajustar o Radio Button para o Tipo (Receita ou Despesa)
      const radios = document.getElementsByName("cash-type");
      for (let r of radios) {
        if (r.value === t.type) r.checked = true;
      }
    }
  }
  cashModal.classList.remove("hidden");
}

function closeCashModal() {
  cashModal.classList.add("hidden");
}

function saveCashTransaction(event) {
  event.preventDefault();

  const id = document.getElementById("cash-id").value;
  const description = document.getElementById("cash-description").value.trim();
  const value = parseFloat(document.getElementById("cash-value").value);
  const date = document.getElementById("cash-date").value;
  const category = document.getElementById("cash-category").value;
  const status = document.getElementById("cash-status").value;
  
  // Buscar valor do radio selecionado
  const typeRadios = document.getElementsByName("cash-type");
  let type = "Receita";
  for (let r of typeRadios) {
    if (r.checked) type = r.value;
  }

  if (id) {
    const index = state.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      state.transactions[index] = { ...state.transactions[index], description, value, date, category, status, type };
      showToast("Lançamento financeiro atualizado!", "success");
    }
  } else {
    const newTrans = {
      id: "trans-" + Date.now(),
      description,
      value,
      date,
      category,
      status,
      type
    };
    state.transactions.push(newTrans);
    showToast("Lançamento financeiro registrado!", "success");
  }

  saveState();
  closeCashModal();
  renderView();
}

// ==========================================
// MODAL: LÓGICA DO ESTOQUE
// ==========================================
const inventoryModal = document.getElementById("modal-inventory");

function openInventoryModal(id = "") {
  document.getElementById("form-inventory").reset();
  document.getElementById("inventory-id").value = "";
  document.getElementById("modal-inventory-title").textContent = "Cadastrar Produto / Insumo";

  if (id) {
    const item = state.inventory.find(i => i.id === id);
    if (item) {
      document.getElementById("modal-inventory-title").textContent = "Editar Produto";
      document.getElementById("inventory-id").value = item.id;
      document.getElementById("inventory-name").value = item.name;
      document.getElementById("inventory-quantity").value = item.quantity;
      document.getElementById("inventory-unit").value = item.unit;
      document.getElementById("inventory-consumption").value = item.consumption;
    }
  }
  inventoryModal.classList.remove("hidden");
}

function closeInventoryModal() {
  inventoryModal.classList.add("hidden");
}

function saveInventoryItem(event) {
  event.preventDefault();

  const id = document.getElementById("inventory-id").value;
  const name = document.getElementById("inventory-name").value.trim();
  const quantity = parseFloat(document.getElementById("inventory-quantity").value);
  const unit = document.getElementById("inventory-unit").value;
  const consumption = parseFloat(document.getElementById("inventory-consumption").value);

  if (id) {
    const index = state.inventory.findIndex(item => item.id === id);
    if (index !== -1) {
      state.inventory[index] = { ...state.inventory[index], name, quantity, unit, consumption };
      showToast("Produto atualizado no estoque!", "success");
    }
  } else {
    const newItem = {
      id: "inv-" + Date.now(),
      name,
      quantity,
      unit,
      consumption
    };
    state.inventory.push(newItem);
    showToast("Produto adicionado ao estoque!", "success");
  }

  saveState();
  closeInventoryModal();
  renderView();
}

// ==========================================
// FUNÇÕES AUXILIARES / UTILITÁRIOS
// ==========================================
function formatDateString(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// ==========================================
// INICIALIZAÇÃO DO APP NO LOAD
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  initStorage();
  switchView("dashboard");
});
