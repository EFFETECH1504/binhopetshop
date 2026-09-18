const products = [
  {id:1,name:"Ração Pedigree Adulto 15 kg",cat:"Cães",price:0,img:"https://images.unsplash.com/photo-1589924691995-400dc9e6e6e6?auto=format&fit=crop&w=900&q=80"},
  {id:2,name:"Ração para gatos",cat:"Gatos",price:0,img:"https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80"},
  {id:3,name:"Ração para pássaros",cat:"Pássaros",price:0,img:"https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=80"},
  {id:4,name:"Coleira para cachorro",cat:"Acessórios",price:0,img:"https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=80"},
  {id:5,name:"Brinquedo para cães",cat:"Acessórios",price:0,img:"https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=80"},
  {id:6,name:"Brinquedo para gatos",cat:"Acessórios",price:0,img:"https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=900&q=80"},
  {id:7,name:"Medicamento veterinário",cat:"Medicamentos",price:0,img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80"},
  {id:8,name:"Ração premium para cães",cat:"Cães",price:0,img:"https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=900&q=80"}
];

let cart = [];
let currentFilter = "Todos";

const grid = document.getElementById("productGrid");
const count = document.getElementById("cartCount");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function money(v){ return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}); }

function renderProducts(){
  const list = currentFilter === "Todos" ? products : products.filter(p => p.cat === currentFilter);
  grid.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80'">
        <span class="tag">${p.cat}</span>
      </div>
      <div class="product-body">
        <span class="product-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <div class="price">Consulte o preço</div>
        <button class="btn btn-primary" onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
      </div>
    </article>`).join("");
}

function addToCart(id){
  const item = cart.find(x => x.id === id);
  if(item) item.qty++;
  else cart.push({...products.find(p=>p.id===id),qty:1});
  renderCart();
  showToast("Produto adicionado ao carrinho");
}

function renderCart(){
  const items = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  count.textContent = cart.reduce((s,i)=>s+i.qty,0);
  if(!cart.length){
    items.innerHTML="";
    empty.style.display="block";
    footer.style.display="none";
    return;
  }
  empty.style.display="none";
  footer.style.display="block";
  items.innerHTML = cart.map(i=>`
    <div class="cart-row">
      <img src="${i.img}" alt="">
      <div>
        <h4>${i.name}</h4>
        <small>Consulte o preço</small>
        <div class="qty">
          <button onclick="changeQty(${i.id},-1)">−</button>
          <b>${i.qty}</b>
          <button onclick="changeQty(${i.id},1)">+</button>
        </div>
      </div>
      <button class="close" style="font-size:20px" onclick="removeItem(${i.id})">×</button>
    </div>`).join("");
  document.getElementById("cartTotal").textContent = total ? money(total) : "A consultar";
}

function changeQty(id,delta){
  const i=cart.find(x=>x.id===id);
  if(!i)return;
  i.qty+=delta;
  if(i.qty<=0) cart=cart.filter(x=>x.id!==id);
  renderCart();
}
function removeItem(id){ cart=cart.filter(x=>x.id!==id); renderCart(); }

function openCart(){drawer.classList.add("open");overlay.classList.add("open")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;

document.querySelectorAll(".filter").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter=btn.dataset.filter;
    renderProducts();
  };
});
document.querySelectorAll(".categories a[data-filter]").forEach(a=>{
  a.onclick=()=>{
    currentFilter=a.dataset.filter;
    document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===currentFilter));
    renderProducts();
  };
});

function checkout(){
  if(!cart.length){showToast("Adicione produtos ao carrinho primeiro.");return;}
  const lines=cart.map(i=>`• ${i.name} — ${i.qty}x`).join("\\n");
  alert("DEMONSTRAÇÃO\\n\\nPedido que seria enviado pelo WhatsApp:\\n\\n"+lines+"\\n\\nO número real da Pet Shop e Clínica Veterinária Binho será configurado depois.");
}
function requestService(service){
  alert(`DEMONSTRAÇÃO\\n\\nAqui o cliente poderia solicitar informações/agendar ${service} diretamente pelo WhatsApp da Pet Shop e Clínica Veterinária Binho.`);
}
function showContact(){
  alert("DEMONSTRAÇÃO\\n\\nAqui entram endereço, horário e WhatsApp reais da Pet Shop e Clínica Veterinária Binho após confirmação com o proprietário.");
}
function showToast(text){
  const t=document.getElementById("toast");
  t.textContent=text;t.classList.add("show");
  clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800);
}
renderProducts();
renderCart();
