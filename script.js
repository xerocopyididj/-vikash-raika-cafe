/* ===== EDIT YOUR BUSINESS DETAILS HERE ===== */
const CONFIG = {
  whatsapp: "+91 7849995988",          // country code + number, no + or spaces
  phone: "+91 7849995988",
  address: "hanumangarh",
  hours: "Every day, 10:00 AM to 11:00 PM",
  currency: "₹"
};

/* ===== EDIT MENU HERE: add, remove or change items ===== */
const CATEGORIES = ["All", "Chicken", "Burgers", "Wraps", "Sides", "Drinks", "Desserts"];
const MENU = [
  {id:1, cat:"Chicken",  name:"Crispy Bucket (8 pc)", desc:"Eight hand-breaded pieces, 11 secret spices.", price:699, emoji:"🍗", tag:"Bestseller"},
  {id:2, cat:"Chicken",  name:"Hot Wings (6 pc)",     desc:"Fiery glaze, cooled down with a dip.",        price:249, emoji:"🍗", tag:"Spicy"},
  {id:3, cat:"Chicken",  name:"Chicken Strips",       desc:"Tender strips with two dipping sauces.",       price:229, emoji:"🍗"},
  {id:4, cat:"Burgers",  name:"Raika Zinger",         desc:"Crispy fillet, pepper mayo, fresh lettuce.",   price:199, emoji:"🍔", tag:"Signature"},
  {id:5, cat:"Burgers",  name:"Double Stack",         desc:"Two patties, melted cheese, house sauce.",     price:279, emoji:"🍔", tag:"New"},
  {id:6, cat:"Burgers",  name:"Classic Veg Crunch",   desc:"Golden veg patty, cheese and tangy mayo.",     price:149, emoji:"🍔"},
  {id:7, cat:"Wraps",    name:"Chicken Twister",      desc:"Crispy chicken, slaw and sauce in a warm wrap.", price:179, emoji:"🌯"},
  {id:8, cat:"Wraps",    name:"Paneer Wrap",          desc:"Spiced paneer, onions, mint chutney.",         price:159, emoji:"🌯"},
  {id:9, cat:"Sides",    name:"Golden Fries",         desc:"Salted, hot and crisp.",                       price:99,  emoji:"🍟", tag:"Favourite"},
  {id:10,cat:"Sides",    name:"Cheesy Nuggets",       desc:"Eight crunchy bites with a cheese centre.",    price:149, emoji:"🧀"},
  {id:11,cat:"Drinks",   name:"Chocolate Shake",      desc:"Thick, cold and chocolatey.",                  price:149, emoji:"🥤"},
  {id:12,cat:"Drinks",   name:"Iced Lemon Cooler",    desc:"Fresh lemon, mint and ice.",                   price:79,  emoji:"🍹"},
  {id:13,cat:"Desserts", name:"Choco Lava Cake",      desc:"Warm cake with a molten centre.",              price:119, emoji:"🍰"},
  {id:14,cat:"Desserts", name:"Soft Serve Sundae",    desc:"Vanilla swirl with chocolate drizzle.",        price:89,  emoji:"🍦"}
];

/* ===== EDIT REVIEWS HERE ===== */
const REVIEWS = [
  {name:"Aman S.",  text:"The chicken is unbelievably crunchy and still juicy inside. Best in town.", stars:5},
  {name:"Priya M.", text:"Delivery in 25 minutes and the fries were still hot. Ordering on WhatsApp is so easy.", stars:5},
  {name:"Rohit K.", text:"The Double Stack is a monster. Great sauce, great service, will order again.", stars:5}
];

/* ===== APP CODE ===== */
const $ = s => document.querySelector(s);
const money = n => CONFIG.currency + n.toLocaleString("en-IN");
let cart = JSON.parse(localStorage.getItem("vrc-cart") || "{}");
let activeCat = "All";

function renderTabs(){
  $("#tabs").innerHTML = CATEGORIES.map(c =>
    `<button class="tab ${c===activeCat?"on":""}" data-cat="${c}">${c}</button>`).join("");
}
function renderMenu(){
  const list = MENU.filter(m => activeCat==="All" || m.cat===activeCat);
  $("#menuGrid").innerHTML = list.map((m,i) => `
    <article class="card" style="animation-delay:${i*50}ms">
      <div class="pic">${m.tag?`<span class="tag">${m.tag}</span>`:""}<span>${m.emoji}</span></div>
      <div class="info"><h3>${m.name}</h3><p>${m.desc}</p>
        <div class="row"><span class="price">${money(m.price)}</span>
        <button class="add" data-add="${m.id}">Add</button></div></div>
    </article>`).join("");
}
function renderReviews(){
  $("#reviewGrid").innerHTML = REVIEWS.map(r => `
    <div class="review"><div class="stars">${"★".repeat(r.stars)}</div>
    <p>${r.text}</p><b>${r.name}</b></div>`).join("");
}
function renderCart(){
  const rows = Object.entries(cart).map(([id,q]) => ({...MENU.find(m=>m.id==id), q}));
  const count = rows.reduce((a,r)=>a+r.q,0), total = rows.reduce((a,r)=>a+r.q*r.price,0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#cartItems").innerHTML = rows.length ? rows.map(r => `
    <div class="ci"><span class="e">${r.emoji}</span>
      <div><b>${r.name}</b><br><small>${money(r.price*r.q)}</small></div>
      <div class="qty"><button data-dec="${r.id}" aria-label="Remove one">−</button><b>${r.q}</b>
      <button data-inc="${r.id}" aria-label="Add one">+</button></div></div>`).join("")
    : `<p class="empty">Your cart is empty.<br>Add something crispy from the menu.</p>`;
  localStorage.setItem("vrc-cart", JSON.stringify(cart));
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function setQty(id,d){cart[id]=(cart[id]||0)+d; if(cart[id]<=0) delete cart[id]; renderCart()}
const wa = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

document.addEventListener("click", e => {
  const t = e.target;
  if(t.dataset.cat){activeCat=t.dataset.cat;renderTabs();renderMenu()}
  if(t.dataset.add){setQty(t.dataset.add,1);const b=$("#openCart");b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop");toast("Added to your cart")}
  if(t.dataset.inc) setQty(t.dataset.inc,1);
  if(t.dataset.dec) setQty(t.dataset.dec,-1);
  if(t.closest(".links a")) $("#links").classList.remove("show");
});
const toggleCart = open => document.body.classList.toggle("open", open);
["#openCart","#openCart2"].forEach(s => $(s).onclick = () => toggleCart(true));
$("#closeCart").onclick = $("#overlay").onclick = () => toggleCart(false);
document.addEventListener("keydown", e => e.key==="Escape" && toggleCart(false));
$("#burgerBtn").onclick = () => $("#links").classList.toggle("show");

$("#sendOrder").onclick = () => {
  const rows = Object.entries(cart).map(([id,q]) => ({...MENU.find(m=>m.id==id), q}));
  if(!rows.length) return toast("Add an item first");
  const total = rows.reduce((a,r)=>a+r.q*r.price,0);
  const name = $("#cName").value.trim(), addr = $("#cAddr").value.trim();
  const lines = rows.map(r => `• ${r.q} x ${r.name} = ${money(r.q*r.price)}`).join("\n");
  const msg = `New order, Vikash Raika Cafe\n\n${lines}\n\nTotal: ${money(total)}\nName: ${name||"-"}\n${addr?"Delivery to: "+addr:"Pickup"}`;
  window.open(wa(msg), "_blank");
};
$("#msgForm").onsubmit = e => {
  e.preventDefault();
  window.open(wa(`Hi, I'm ${$("#mName").value}. ${$("#mText").value}`), "_blank");
};

/* contact info */
document.querySelectorAll("[data-cfg]").forEach(el => el.textContent = CONFIG[el.dataset.cfg]);
const ph = $("[data-cfg-link]"); ph.textContent = CONFIG.phone; ph.href = "tel:" + CONFIG.phone.replace(/\s/g,"");
$("#waDirect").href = wa("Hi Vikash Raika Cafe!");
$("#yr").textContent = new Date().getFullYear();

/* 3D burger: spins slowly, follows the pointer */
const burger = $("#burger3d"); let spin = 0, extra = 0, target = 0;
$("#stage").addEventListener("pointermove", e => {
  const r = e.currentTarget.getBoundingClientRect();
  target = ((e.clientX - r.left) / r.width - .5) * 120;
});
(function loop(){ spin += .25; extra += (target-extra)*.06; burger.style.setProperty("--rz", (spin+extra)+"deg"); requestAnimationFrame(loop) })();

/* nav shadow on scroll */
addEventListener("scroll", () => $("#nav").style.boxShadow = scrollY>20 ? "0 6px 24px rgba(0,0,0,.4)" : "none");

renderTabs(); renderMenu(); renderReviews(); renderCart();
