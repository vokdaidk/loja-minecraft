async function loadDashboard(){
  try{const d=await api("/admin/dashboard");dashboard.innerHTML=`<p>Total vendido: R$ ${d.totalSales}</p><p>Pedidos: ${d.totalOrders}</p><p>Usuários: ${d.totalUsers}</p>`}catch(e){dashboard.innerHTML=e.message}
}
async function createProduct(){
  try{await api("/products",{method:"POST",body:JSON.stringify({name:name.value,price:price.value,category:category.value,image:image.value,description:description.value})});alert("Kit criado")}catch(e){alert(e.message)}
}
async function createCoupon(){
  try{await api("/coupons",{method:"POST",body:JSON.stringify({code:couponCode.value,discount:couponDiscount.value})});alert("Cupom criado")}catch(e){alert(e.message)}
}
loadDashboard();
