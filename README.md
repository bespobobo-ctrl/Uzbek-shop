# ⚡ UzbekShop TexnoMart - Modulli Veb-Magazin Arxitekturasi

Ushbu loyiha Texnomart.uz uslubida barpo etilgan maishiy texnika va elektronika veb-magazinining to'liq modulli (har bir bo'lim va sahifa uchun alohida papkalardan tashkil topgan) strukturasi.

---

## 📁 Papkalar va Fayllar Tuzilmasi (Folder Structure)

```text
uy-shop/
├── index.html                   # Asosiy birlashtiruvchi HTML fayl
├── README.md                    # Loyiha hujjatlari va yo'riqnoma
│
├── data/                        # Ma'lumotlar bazasi
│   ├── products.json            # Smartfon, noutbuk, TV va maishiy texnika ro'yxati
│   └── categories.json          # Katalog toifalari va belgilar
│
├── shared/                      # Umumiy yordamchi modullar
│   ├── css/
│   │   └── common.css           # Global Texnomart dizayn tizimi, o'zgaruvchilar va reset
│   └── js/
│       ├── storage.js           # Cart, Wishlist va Compare LocalStorage boshqaruvi
│       └── toast.js             # Notification bildirishnoma xizmati
│
├── sections/                    # BARCHA BO'LIMLAR UCHUN ALOHIDA PAPKALAR
│   ├── top-bar/                 # Shahar tanlash, Aloqa markazi va tillar bo'limi
│   │   ├── top-bar.css
│   │   └── top-bar.js
│   ├── header/                  # Sarlavha, logo va qidiruv paneli bo'limi
│   │   ├── header.css
│   │   └── header.js
│   ├── mega-menu/               # Katalog Mega-Menyusi bo'limi
│   │   ├── mega-menu.css
│   │   └── mega-menu.js
│   ├── hero-banner/             # Banner va aksiya slajderi bo'limi
│   │   ├── hero-banner.css
│   │   └── hero-banner.js
│   ├── flash-deals/             # Kun taklifi va taymer bo'limi
│   │   ├── flash-deals.css
│   │   └── flash-deals.js
│   ├── product-catalog/         # Mahsulotlar katalogi va filterlash bo'limi
│   │   ├── catalog.css
│   │   └── catalog.js
│   ├── product-card/            # Mahsulot kartochkasi va muddatli to'lov badge bo'limi
│   │   ├── product-card.css
│   │   └── product-card.js
│   ├── cart-drawer/             # Savatcha paneli bo'limi
│   │   ├── cart-drawer.css
│   │   └── cart-drawer.js
│   ├── wishlist/                # Sevimlilar bo'limi
│   │   ├── wishlist.css
│   │   └── wishlist.js
│   ├── compare/                 # Taqqoslash (Compare) bo'limi
│   │   ├── compare.css
│   │   └── compare.js
│   ├── checkout-modal/          # Buyurtma rasmiylashtirish modal oynasi bo'limi
│   │   ├── checkout-modal.css
│   │   └── checkout-modal.js
│   └── footer/                  # Quyi bo'lim (Footer va to'lov usullari)
│       ├── footer.css
│       └── footer.js
│
└── pages/                       # ALOHIDA BO'LIM SAHIFALARI
    ├── smartfonlar/
    │   └── smartfonlar.html     # Smartfonlar va gadjetlar alohida sahifasi
    ├── kompyuterlar/
    │   └── kompyuterlar.html    # Noutbuklar va kompyuterlar alohida sahifasi
    └── maishiy-texnika/
        └── maishiy-texnika.html # Maishiy texnika alohida sahifasi
```

---

## ✨ Imkoniyatlari

1. **Modulli Tuzilma**: Har bir UI bo'lim o'zining CSS va JS skriptiga ega.
2. **Texnomart Vizual Stil**: Texnomart sariq-to'q ranglar palitrasi va muddatli to'lov nishoni (`12 oy / 250 000 so'm`).
3. **Mega-Katalog**: Barcha toifalar va pastki bo'limlar katalogi.
4. **Kun Taklifi Taymeri**: Real vaqt rejimida orqaga sanovchi aksiya taymeri.
5. **Savatcha, Sevimlilar va Taqqoslash**: Bir vaqtning o'zida mahsulotlarni tanlash, taqqoslash va buyurtma berish.
