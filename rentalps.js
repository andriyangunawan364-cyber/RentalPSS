// ==============================
// LEVEL UP PS RENTAL - SETTINGS
// Edit bagian ini untuk menyesuaikan toko.
// ==============================
const STORE = {
  whatsappSeller: "6285782329752", // GANTI dengan nomor WhatsApp penjual, format 62...
  wifiUser: "LEVELUP_GUEST",
  wifiPassword: "MAINBAR2026",
  prices: { PS3: 5000, PS4: 9000 },
  tables: {
    PS3: [1,,,,,,,,,],
    PS4: [1,,,,,,,,,]
  },
  // Contoh meja yang sedang tidak tersedia. Kosongkan jika semua tersedia.
  busyTables: { PS3: [], PS4: [] }
};

let state = {
  console: "PS3",
  table: null,
  cart: [],
  lang: "id"
};

const $ = (id) => document.getElementById(id);
const money = n => new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0}).format(n);

function renderTables() {
  document.querySelectorAll(".console-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.console === state.console);
  });
  const grid = $("tableGrid");
  grid.innerHTML = "";
  STORE.tables[state.console].forEach(num => {
    const btn = document.createElement("button");
    btn.className = "table-btn";
    btn.textContent = `Meja ${num}`;
    if (state.table === num) btn.classList.add("selected");
    if (STORE.busyTables[state.console].includes(num)) {
      btn.classList.add("busy");
      btn.disabled = true;
      btn.title = "Sedang digunakan";
    }
    btn.onclick = () => { state.table = num; renderTables(); };
    grid.appendChild(btn);
  });
}

function getPlayerData() {
  return {
    name: $("name").value.trim(),
    age: $("age").value.trim(),
    whatsapp: $("whatsapp").value.trim(),
    start: $("startTime").value,
    duration: Number($("duration").value),
    note: $("note").value.trim(),
    payment: document.querySelector('input[name="payment"]:checked')?.value || "QRIS"
  };
}

function updateSummary() {
  const p = getPlayerData();
  $("summaryName").textContent = p.name || "-";
  $("summaryWA").textContent = p.whatsapp || "-";
}

["name","age","whatsapp","startTime","duration","note"].forEach(id => {
  $(id).addEventListener("input", updateSummary);
  $(id).addEventListener("change", updateSummary);
});

function renderCart() {
  const box = $("cartItems");
  $("cartCount").textContent = state.cart.length;
  $("cartCountBig").textContent = `${state.cart.length} item${state.cart.length === 1 ? "" : "s"}`;
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  $("total").textContent = money(total);

  if (!state.cart.length) {
    box.innerHTML = `<div class="empty-cart">Keranjang masih kosong.<br><small>Pilih PS dan meja untuk mulai.</small></div>`;
    return;
  }
  box.innerHTML = state.cart.map((item, i) => `
    <div class="cart-item">
      <button class="remove" onclick="removeItem(${i})">✕</button>
      <strong>${item.console} • Meja ${item.table}</strong>
      <small>${item.duration} jam • mulai ${item.start || "-"} • ${money(item.price)}</small>
    </div>
  `).join("");
}

window.removeItem = function(i) {
  state.cart.splice(i,1);
  renderCart();
};

$("addBtn").onclick = () => {
  const p = getPlayerData();
  if (!p.name || !p.age || !p.whatsapp) return alert("Lengkapi nama, umur, dan WhatsApp terlebih dahulu.");
  if (!state.table) return alert("Pilih nomor meja terlebih dahulu.");
  if (!p.start) return alert("Pilih jam mulai bermain.");

  state.cart.push({
    console: state.console,
    table: state.table,
    start: p.start,
    duration: p.duration,
    price: STORE.prices[state.console] * p.duration
  });
  renderCart();
  alert("Pesanan ditambahkan ke keranjang.");
  scrollToCart();
};

window.scrollToCart = function() {
  $("cart").scrollIntoView({behavior:"smooth", block:"center"});
};

$("orderBtn").onclick = () => {
  const p = getPlayerData();
  if (!state.cart.length) return alert("Keranjang masih kosong.");
  if (!p.name || !p.age || !p.whatsapp) return alert("Lengkapi data pemain terlebih dahulu.");

  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  const lines = [
    "🎮 *BOOKING LEVEL UP PS RENTAL*",
    "",
    `👤 Nama: ${p.name}`,
    `🎂 Umur: ${p.age}`,
    `📱 WhatsApp: ${p.whatsapp}`,
    `💳 Pembayaran: ${p.payment}`,
    "",
    ...state.cart.map((x,i) => `${i+1}. ${x.console} — Meja ${x.table} — ${x.start} — ${x.duration} jam — ${money(x.price)}`),
    "",
    `💰 *TOTAL: ${money(total)}*`,
    `📝 Catatan: ${p.note || "-"}`,
    "",
    "Saya ingin melakukan booking rental PS."
  ];

  const url = `https://wa.me/${STORE.whatsappSeller}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank");
};

$("resetBtn").onclick = () => {
  if (!confirm("Reset semua data dan keranjang?")) return;
  state.cart = [];
  state.table = null;
  ["name","age","whatsapp","startTime","note"].forEach(id => $(id).value = "");
  $("duration").value = "1";
  document.querySelector('input[value="QRIS"]').checked = true;
  renderTables();
  renderCart();
  updateSummary();
};

document.querySelectorAll(".console-tab").forEach(btn => {
  btn.onclick = () => {
    state.console = btn.dataset.console;
    state.table = null;
    renderTables();
  };
});

// ==============================
// Bahasa Indonesia / English
// ==============================
const translations = {
  id: {
    navRental:"Rental", navPromo:"Promo", navFacility:"Fasilitas", navAbout:"Tentang", navHelp:"Bantuan",
    cart:"Keranjang", heroText:"Rental PS nyaman untuk mabar, nongkrong, dan kompetisi seru bareng teman.",
    bookNow:"Pesan Sekarang", seePromo:"Lihat Promo", promoTitle:"Promo yang bikin balik lagi",
    promoSub:"Promo bisa kamu ubah sesuai aturan toko.", p1Title:"Ajak Teman, Main Gratis!",
    p1Text:"Ajak 1 teman baru yang belum pernah rental di sini. Dapat bonus 30 menit bermain.",
    p2Title:"Happy Hour", p2Text:"Main di jam sepi dan dapat bonus waktu sesuai promo yang sedang aktif.",
    p3Title:"Mabar 4 Jam", p3Text:"Pesan durasi panjang dan dapat bonus minuman / waktu sesuai program toko.",
    rentalTitle:"Pilih rental PS", rentalSub:"Isi data pemain, pilih konsol dan meja.",
    playerData:"Data Pemain", name:"Nama", age:"Umur", chooseConsole:"Pilih Konsol & Meja",
    start:"Mulai Main", duration:"Durasi", note:"Catatan", payment:"Metode Pembayaran",
    paymentNote:"Detail pembayaran dikirim/ditampilkan oleh owner setelah pemesanan.",
    addCart:"+ Tambahkan ke Keranjang", total:"Total", customer:"Pelanggan", orderWA:"Pesan via WhatsApp",
    reset:"Reset Pesanan", facilityTitle:"Fasilitas tempat", aboutTitle:"Tentang Toko Kami",
    aboutText:"LEVEL UP PS RENTAL adalah tempat rental PS3 dan PS4 untuk mabar, nongkrong, dan menikmati game bersama. Owner dapat mengganti harga, meja, promo, WiFi, serta informasi toko langsung dari file JavaScript.",
    helpTitle:"Pusat Bantuan"
  },
  en: {
    navRental:"Rental", navPromo:"Promos", navFacility:"Facilities", navAbout:"About", navHelp:"Help",
    cart:"Cart", heroText:"A comfortable PS rental for gaming, hanging out, and exciting matches with friends.",
    bookNow:"Book Now", seePromo:"View Promos", promoTitle:"Promos that bring you back",
    promoSub:"You can customize promos to match your store rules.", p1Title:"Bring a Friend, Play Free!",
    p1Text:"Bring 1 new friend who has never rented here and get a 30-minute play bonus.",
    p2Title:"Happy Hour", p2Text:"Play during selected off-peak hours and get a bonus according to the active promo.",
    p3Title:"4-Hour Mabar", p3Text:"Book a longer session and get a drink/time bonus according to the store program.",
    rentalTitle:"Choose your PS rental", rentalSub:"Enter player details, then choose a console and table.",
    playerData:"Player Details", name:"Name", age:"Age", chooseConsole:"Choose Console & Table",
    start:"Start Time", duration:"Duration", note:"Note", payment:"Payment Method",
    paymentNote:"Payment details will be provided/displayed by the owner after booking.",
    addCart:"+ Add to Cart", total:"Total", customer:"Customer", orderWA:"Order via WhatsApp",
    reset:"Reset Order", facilityTitle:"Our Facilities", aboutTitle:"About Our Store",
    aboutText:"LEVEL UP PS RENTAL is a PS3 and PS4 rental place for gaming, hanging out, and playing together. The owner can edit prices, tables, promos, WiFi, and store information directly in the JavaScript file.",
    helpTitle:"Help Center"
  }
};

$("langBtn").onclick = () => {
  state.lang = state.lang === "id" ? "en" : "id";
  $("langBtn").textContent = state.lang === "id" ? "EN" : "ID";
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[state.lang][key]) el.textContent = translations[state.lang][key];
  });
};

renderTables();
renderCart();
updateSummary();
