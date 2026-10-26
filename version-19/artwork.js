/* Edition 19: independent native images; no contact sheet crops or canvas upscaling. */
const MJ_HD17={"Jebla – Zorro": "zorro", "Jebla – KitKat": "kitkat", "Jebla – Romario": "romario", "Jebla – Qayel Ali": "qayel", "Stockroom – Ethiopia Omran": "omran", "Ginger Lemongrass Organic": "gingerlemongrass", "Grenoille Peaches & Cream": "grenouille", "Ayurveda Kapha Organic": "kapha", "Pineapple Mango": "pineapplemango", "China Yin Zhen Organic": "yinzhen", "Nabta – Hibiscus": "nabta", "Zill Kenya Capsules": "kenya"};
for(const p of window.MJ_MENU.products)if(MJ_HD17[p.nameEn])p.presentationImage="version-19/assets/hd-"+MJ_HD17[p.nameEn]+".webp";
window.MJ_ART_READY=Promise.resolve();
