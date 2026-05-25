async function load(){
  try{
    const settings = await api("/settings");
    storeName.textContent = settings?.store_name || "Loja";
    serverInfo.textContent = `IP: ${settings?.server_ip || ""}:${settings?.server_port || ""}`;
  }catch{}
  const products = await api("/products");
  document.getElementById("products").innerHTML = products.map(p=>`<div class="product"><img src="${p.image || 'assets/logo.png'}"><h3>${p.name}</h3><p>${p.description || ''}</p><p>${p.category || ''}</p><div class="price">R$ ${p.price}</div><button onclick="buy(${p.id})">Comprar</button></div>`).join("");
}
async function buy(product_id){try{await api("/orders",{method:"POST",body:JSON.stringify({product_id})});alert("Pedido criado. Integração Mercado Pago será conectada no próximo passo.")}catch(e){alert(e.message)}}
load();
