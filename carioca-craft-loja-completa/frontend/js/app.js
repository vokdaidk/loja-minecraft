const ADMIN_EMAILS = ["admin@cariocacraft.com"];

const defaultData = {
  users: [
    { email: "admin@cariocacraft.com", password: "admin123", minecraft: "Admin", discord: "Admin#0001", spent: 0 }
  ],
  currentUser: null,
  categories: ["Kits", "VIP", "Chaves", "Coins"],
  products: [
    { name: "Kit Guerreiro", price: 9.99, category: "Kits", image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=900&q=80", description: "Itens iniciais para sobreviver com vantagem." },
    { name: "VIP Mensal", price: 19.99, category: "VIP", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80", description: "Benefícios especiais por 30 dias." },
    { name: "Chave Lendária", price: 7.50, category: "Chaves", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80", description: "Abra crates com recompensas raras." }
  ],
  coupons: [{ code: "CARIoca10".toUpperCase(), discount: 10 }],
  combos: [
    { name: "Combo Inicial", price: 24.99, image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?auto=format&fit=crop&w=900&q=80", description: "Compre VIP + Kit Guerreiro e leve uma chave grátis." }
  ],
  orders: [],
  settings: {
    storeName: "Carioca Craft Store",
    serverName: "Carioca Craft",
    ip: "mp.mundi.bed.net.br",
    port: "25515",
    discord: "#",
    tiktok: "#",
    youtube: "#",
    mercadoPagoToken: "",
    maintenance: false
  }
};

function getData() {
  const saved = localStorage.getItem("cc_store_data");
  if (!saved) {
    localStorage.setItem("cc_store_data", JSON.stringify(defaultData));
    return structuredClone(defaultData);
  }
  return JSON.parse(saved);
}

function saveData(data) {
  localStorage.setItem("cc_store_data", JSON.stringify(data));
}

let data = getData();

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(() => t.style.display = "none", 2500);
}

function money(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toggleAuth(type, btn) {
  document.getElementById("loginBox").classList.toggle("hidden", type !== "login");
  document.getElementById("registerBox").classList.toggle("hidden", type !== "register");
  document.querySelectorAll(".auth-tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function register() {
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const minecraft = document.getElementById("regMine").value.trim();
  const discord = document.getElementById("regDiscord").value.trim();
  const password = document.getElementById("regPassword").value;

  if (!email || !minecraft || !discord || !password) return toast("Preencha todos os campos.");
  if (data.users.some(u => u.email === email)) return toast("Esse email já está cadastrado.");

  data.users.push({ email, minecraft, discord, password, spent: 0 });
  saveData(data);
  toast("Conta criada. Agora faça login.");
}

function login() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const user = data.users.find(u => u.email === email && u.password === password);

  if (!user) return toast("Email ou senha inválidos.");
  if (data.settings.maintenance && !ADMIN_EMAILS.includes(email)) return toast("Loja em manutenção.");

  data.currentUser = user.email;
  saveData(data);
  setupSession();
  showPage("home");
  toast("Login realizado.");
}

function logout() {
  data.currentUser = null;
  saveData(data);
  setupSession();
  showPage("auth");
}

function currentUser() {
  return data.users.find(u => u.email === data.currentUser);
}

function isAdmin() {
  return ADMIN_EMAILS.includes(data.currentUser);
}

function setupSession() {
  const logged = !!data.currentUser;
  document.getElementById("logoutBtn").classList.toggle("hidden", !logged);
  document.getElementById("adminNav").classList.toggle("hidden", !isAdmin());
  if (!logged) showPage("auth");
  renderAll();
}

function showPage(page) {
  if (page !== "auth" && !data.currentUser) page = "auth";
  if (page === "admin" && !isAdmin()) page = "home";

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page + "Page").classList.add("active");
  renderAll();
}

function applySettings() {
  const s = data.settings;
  document.getElementById("navStoreName").textContent = s.storeName;
  document.getElementById("storeTitle").textContent = s.serverName;
  document.getElementById("storeSubtitle").textContent = "Servidor Minecraft Bedrock";
  document.getElementById("infoName").textContent = s.serverName;
  document.getElementById("infoIp").textContent = s.ip;
  document.getElementById("infoPort").textContent = s.port;
  document.getElementById("textIp").textContent = s.ip;
  document.getElementById("textPort").textContent = s.port;
  document.getElementById("discordLink").href = s.discord || "#";
  document.getElementById("tiktokLink").href = s.tiktok || "#";
  document.getElementById("youtubeLink").href = s.youtube || "#";
}

function renderCategorySelects() {
  const filter = document.getElementById("categoryFilter");
  const pCat = document.getElementById("pCategory");
  filter.innerHTML = `<option value="all">Todas as categorias</option>` + data.categories.map(c => `<option>${c}</option>`).join("");
  pCat.innerHTML = data.categories.map(c => `<option>${c}</option>`).join("");
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const cat = document.getElementById("categoryFilter").value || "all";
  const products = cat === "all" ? data.products : data.products.filter(p => p.category === cat);

  grid.innerHTML = products.map((p, i) => {
    const originalIndex = data.products.indexOf(p);
    return `<div class="card">
      <img src="${p.image || 'https://via.placeholder.com/600x400?text=Kit'}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description || ""}</p>
      <small>${p.category || "Sem categoria"}</small>
      <div class="price">${money(p.price)}</div>
      <button class="primary" onclick="buyProduct(${originalIndex})">Comprar</button>
    </div>`;
  }).join("") || "<p>Nenhum kit cadastrado.</p>";
}

function renderCombos() {
  document.getElementById("combosGrid").innerHTML = data.combos.map((c, i) => `
    <div class="card">
      <img src="${c.image || 'https://via.placeholder.com/600x400?text=Combo'}" alt="${c.name}">
      <h3>${c.name}</h3>
      <p>${c.description || ""}</p>
      <div class="price">${money(c.price)}</div>
      <button class="primary" onclick="buyCombo(${i})">Comprar combo</button>
    </div>
  `).join("") || "<p>Nenhum combo cadastrado.</p>";
}

function buyProduct(index) {
  const u = currentUser();
  const p = data.products[index];
  let price = Number(p.price);
  const coupon = document.getElementById("couponInput").value.trim().toUpperCase();
  const found = data.coupons.find(c => c.code === coupon);

  if (found) price = price - (price * found.discount / 100);

  u.spent += price;
  data.orders.unshift({ buyer: u.minecraft, item: p.name, amount: price, date: new Date().toLocaleString("pt-BR"), status: "Simulada" });
  saveData(data);
  toast("Compra simulada registrada.");
  renderAll();
}

function buyCombo(index) {
  const u = currentUser();
  const c = data.combos[index];
  u.spent += Number(c.price);
  data.orders.unshift({ buyer: u.minecraft, item: c.name, amount: c.price, date: new Date().toLocaleString("pt-BR"), status: "Simulada" });
  saveData(data);
  toast("Compra simulada registrada.");
  renderAll();
}

function renderTop() {
  const users = [...data.users].sort((a,b) => b.spent - a.spent).slice(0, 10);
  document.getElementById("topBuyers").innerHTML = users.map((u,i) => `
    <div class="rank-item">
      <b>#${i+1} ${u.minecraft}</b>
      <span>${money(u.spent)}</span>
    </div>
  `).join("");
}

function showAdminTab(tab) {
  document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
  document.getElementById("admin" + tab[0].toUpperCase() + tab.slice(1)).classList.add("active");
  renderAdmin();
}

function renderAdmin() {
  const revenue = data.orders.reduce((sum,o) => sum + Number(o.amount), 0);
  document.getElementById("totalRevenue").textContent = money(revenue);
  document.getElementById("totalOrders").textContent = data.orders.length;
  document.getElementById("totalProducts").textContent = data.products.length;

  document.getElementById("ordersList").innerHTML = data.orders.map(o => `
    <div class="list-item"><span>${o.buyer} comprou ${o.item}</span><b>${money(o.amount)}</b></div>
  `).join("") || "<p>Nenhuma venda ainda.</p>";

  document.getElementById("adminProductsList").innerHTML = data.products.map((p,i) => `
    <div class="list-item"><span>${p.name} • ${money(p.price)} • ${p.category}</span><button onclick="deleteProduct(${i})">Excluir</button></div>
  `).join("");

  document.getElementById("categoriesList").innerHTML = data.categories.map((c,i) => `
    <div class="list-item"><span>${c}</span><button onclick="deleteCategory(${i})">Excluir</button></div>
  `).join("");

  document.getElementById("couponsList").innerHTML = data.coupons.map((c,i) => `
    <div class="list-item"><span>${c.code} • ${c.discount}%</span><button onclick="deleteCoupon(${i})">Excluir</button></div>
  `).join("");

  document.getElementById("combosList").innerHTML = data.combos.map((c,i) => `
    <div class="list-item"><span>${c.name} • ${money(c.price)}</span><button onclick="deleteCombo(${i})">Excluir</button></div>
  `).join("");

  const s = data.settings;
  document.getElementById("sName").value = s.storeName;
  document.getElementById("sServerName").value = s.serverName;
  document.getElementById("sIp").value = s.ip;
  document.getElementById("sPort").value = s.port;
  document.getElementById("sDiscord").value = s.discord;
  document.getElementById("sTikTok").value = s.tiktok;
  document.getElementById("sYouTube").value = s.youtube;
  document.getElementById("sMpToken").value = s.mercadoPagoToken;
  document.getElementById("sMaintenance").checked = s.maintenance;
}

function addProduct() {
  data.products.push({
    name: document.getElementById("pName").value,
    price: Number(document.getElementById("pPrice").value),
    image: document.getElementById("pImage").value,
    category: document.getElementById("pCategory").value,
    description: document.getElementById("pDescription").value
  });
  saveData(data); toast("Kit adicionado."); renderAll();
}

function deleteProduct(i){ data.products.splice(i,1); saveData(data); renderAll(); }
function addCategory(){ const v=document.getElementById("catName").value.trim(); if(v&&!data.categories.includes(v)) data.categories.push(v); saveData(data); renderAll(); }
function deleteCategory(i){ data.categories.splice(i,1); saveData(data); renderAll(); }
function addCoupon(){ data.coupons.push({ code: document.getElementById("cCode").value.trim().toUpperCase(), discount: Number(document.getElementById("cDiscount").value) }); saveData(data); renderAll(); }
function deleteCoupon(i){ data.coupons.splice(i,1); saveData(data); renderAll(); }
function addCombo(){ data.combos.push({ name: document.getElementById("comboName").value, price: Number(document.getElementById("comboPrice").value), image: document.getElementById("comboImage").value, description: document.getElementById("comboDescription").value }); saveData(data); renderAll(); }
function deleteCombo(i){ data.combos.splice(i,1); saveData(data); renderAll(); }

function saveSettings() {
  data.settings = {
    storeName: document.getElementById("sName").value,
    serverName: document.getElementById("sServerName").value,
    ip: document.getElementById("sIp").value,
    port: document.getElementById("sPort").value,
    discord: document.getElementById("sDiscord").value,
    tiktok: document.getElementById("sTikTok").value,
    youtube: document.getElementById("sYouTube").value,
    mercadoPagoToken: document.getElementById("sMpToken").value,
    maintenance: document.getElementById("sMaintenance").checked
  };
  saveData(data);
  toast("Configurações salvas.");
  renderAll();
}

function renderAll() {
  applySettings();
  renderCategorySelects();
  renderProducts();
  renderCombos();
  renderTop();
  if (isAdmin()) renderAdmin();
}

setupSession();
