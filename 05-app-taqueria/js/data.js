/**
 * Datos del Menú y Opciones de Taquería "El Trompo Loco"
 * Sabor callejero tradicional con ingredientes frescos y auténticos
 */

const MENU_DATA = {
  restaurant: {
    name: "Taquería El Trompo Loco",
    tagline: "El auténtico sabor de la calle directo a tu mano 🌮🔥",
    address: "Av. Insurgentes Sur 452, Col. Roma / Condesa",
    phone: "+52 55 8492 3100",
    whatsappPhone: "525584923100", // Para enlace directo de WhatsApp
    schedule: "Mar - Dom: 13:00 - 01:00 hrs (Lunes cerrado)",
    pickupTimeAvg: "15 - 20 min",
    currency: "MXN",
    currencySymbol: "$",
    rating: 4.9,
    reviewCount: 940,
    isOpen: true
  },

  categories: [
    { id: "todos", name: "Todos", icon: "✨" },
    { id: "tacos", name: "Tacos al Trompo & Plancha", icon: "🌮" },
    { id: "gringas", name: "Gringas & Especiales", icon: "🧀" },
    { id: "entradas", name: "Entradas & Totopos", icon: "🥑" },
    { id: "bebidas", name: "Aguas Frescas & Bebidas", icon: "🥤" },
    { id: "postres", name: "Postres Caseros", icon: "🍰" }
  ],

  // Opciones de personalización predeterminadas
  customizationRules: {
    tortillas: [
      { id: "maiz", name: "Tortilla de Maíz Clásica", price: 0, default: true },
      { id: "harina", name: "Tortilla de Harina Calientita", price: 5 },
      { id: "costra", name: "Costra Dorada de Queso Oaxaca", price: 18 }
    ],
    verduras: [
      { id: "con_todo", name: "Con Todo (Cebolla y cilantro picados)", default: true },
      { id: "solo_cebolla", name: "Solo cebollita picada" },
      { id: "solo_cilantro", name: "Solo cilantro fresco" },
      { id: "cebolla_asada", name: "Con cebollita cambray asada", price: 6 },
      { id: "sin_verdura", name: "Sin verdura (Solo carne)" }
    ],
    salsas: [
      { id: "verde", name: "🟢 Salsa Verde Tomatillo (Pica poco - Fresca)", heat: 1, default: true },
      { id: "roja", name: "🔴 Salsa Roja Taquera de Árbol (Pica rico)", heat: 2 },
      { id: "macha", name: "🔥 Salsa Macha Habanero y Cacahuate (¡Muy Brava!)", heat: 3 },
      { id: "guacamole", name: "🥑 Salsa Cremosa de Guacamole", heat: 1 },
      { id: "aparte", name: "📦 Salsas aparte en bolsitas", heat: 0 },
      { id: "ninguna", name: "❌ Sin salsa", heat: 0 }
    ],
    extrasDisponibles: [
      { id: "doble_carne", name: "Doble porción de carne", price: 20 },
      { id: "queso_fundido", name: "Queso Oaxaca fundido extra", price: 15 },
      { id: "aguacate", name: "Rebanadas de aguacate fresco", price: 14 },
      { id: "pina_extra", name: "Piña asada al carbón extra", price: 8 },
      { id: "limones_extra", name: "Limones y rábanos extra", price: 0 }
    ]
  },

  products: [
    // --- TACOS ---
    {
      id: "taco-pastor",
      categoryId: "tacos",
      name: "Taco al Pastor Tradicional",
      description: "Carne de cerdo marinada en adobo de achiote artesanal, asada al trompo con piña dorada al carbón, cebolla y cilantro.",
      price: 24,
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80",
      tags: ["⭐ Más Vendido", "Trompo"],
      isCustomizable: true,
      canHaveTortilla: true,
      canHaveVerdura: true,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["queso_fundido", "pina_extra", "doble_carne"]
    },
    {
      id: "taco-suadero",
      categoryId: "tacos",
      name: "Taco de Suadero Confitado",
      description: "Corte de ternera suave confitado lentamente en su jugo en comal cóncavo, dorado crujiente por fuera y jugoso por dentro.",
      price: 26,
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=700&q=80",
      tags: ["🔥 Favorito Taquero"],
      isCustomizable: true,
      canHaveTortilla: true,
      canHaveVerdura: true,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["queso_fundido", "doble_carne"]
    },
    {
      id: "taco-quesabirria",
      categoryId: "tacos",
      name: "Quesabirria con Consomé",
      description: "Carne de res estofada en adobo tradicional con queso asadero fundido en tortilla dorada al comal. Incluye caldito de birria para chopear.",
      price: 36,
      image: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=700&q=80",
      tags: ["⭐ Con Consomé", "Crujiente"],
      isCustomizable: true,
      canHaveTortilla: true,
      canHaveVerdura: true,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["doble_carne", "aguacate"]
    },
    {
      id: "taco-campechano",
      categoryId: "tacos",
      name: "Taco Campechano Imperial",
      description: "La trinidad taquera: cecina de res asada, longaniza artesanal bien frita y coronado con chicharrón crujiente triturado.",
      price: 28,
      image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=700&q=80",
      tags: ["Chicharrón Crujiente"],
      isCustomizable: true,
      canHaveTortilla: true,
      canHaveVerdura: true,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["queso_fundido", "aguacate"]
    },
    {
      id: "taco-carnitas",
      categoryId: "tacos",
      name: "Taco de Carnitas Michoacán",
      description: "Maciza tierna y costilla desmenuzada con toque de cuerito dorado en cazo de cobre con manteca, naranja y especias.",
      price: 27,
      image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=700&q=80",
      tags: ["Tradición Michoacana"],
      isCustomizable: true,
      canHaveTortilla: true,
      canHaveVerdura: true,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["aguacate", "doble_carne"]
    },
    {
      id: "taco-nopal-flor",
      categoryId: "tacos",
      name: "Taco Veggie Flor & Nopal",
      description: "Nopal tierno asado a la plancha, flor de calabaza al epazote y queso panela fresco asado con rodajas de aguacate.",
      price: 24,
      image: "https://images.unsplash.com/photo-1584278434771-55ec344fc3fd?auto=format&fit=crop&w=700&q=80",
      tags: ["🌱 Vegetariano", "Ligero"],
      isCustomizable: true,
      canHaveTortilla: true,
      canHaveVerdura: true,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["aguacate", "queso_fundido"]
    },

    // --- GRINGAS & ESPECIALES ---
    {
      id: "gringa-pastor",
      categoryId: "gringas",
      name: "Gringa Suprema de Pastor",
      description: "Doble tortilla grande de harina al comal rellena de abundante queso Oaxaca derretido, carne al pastor marinada y piña caramelizada.",
      price: 78,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
      tags: ["⭐ Favorito", "Extra Queso"],
      isCustomizable: true,
      canHaveTortilla: false, // Ya viene en harina
      canHaveVerdura: true,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["doble_carne", "aguacate"]
    },
    {
      id: "volcan-asada",
      categoryId: "gringas",
      name: "Volcán de Asada con Costra",
      description: "Tortilla tostada dura y crujiente sobre las brasas, cubierta de costra dorada de queso asadero y jugosa carne de bistec picada.",
      price: 45,
      image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=700&q=80",
      tags: ["Tostada Crujiente"],
      isCustomizable: true,
      canHaveTortilla: false,
      canHaveVerdura: true,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["aguacate", "doble_carne"]
    },
    {
      id: "alambre-loco",
      categoryId: "gringas",
      name: "Alambre Loco Especial (Para 2)",
      description: "Combinación de bistec, tocino ahumado, pimientos verdes y rojos, cebolla salteada y un manto de queso fundido. Acompañado de 6 tortillas.",
      price: 135,
      image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=700&q=80",
      tags: ["👥 Para Compartir"],
      isCustomizable: true,
      canHaveTortilla: true,
      canHaveVerdura: false,
      canHaveSalsa: true,
      canHaveExtras: true,
      suggestedExtras: ["aguacate", "pina_extra"]
    },

    // --- ENTRADAS ---
    {
      id: "guacamole-molcajete",
      categoryId: "entradas",
      name: "Guacamole de Molcajete con Totopos",
      description: "Aguacate Hass martajado al instante con jitomate, cebolla morada, toque de chile serrano, cilantro fresco, sal de grano y totopos de maíz recién hechos.",
      price: 68,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
      tags: ["🌱 Fresco del Día", "Totopos Caseros"],
      isCustomizable: false,
      canHaveTortilla: false,
      canHaveVerdura: false,
      canHaveSalsa: false,
      canHaveExtras: false
    },
    {
      id: "frijoles-charros",
      categoryId: "entradas",
      name: "Frijoles Charros con Tocino y Chilorio",
      description: "Caldito espeso de frijoles bayos cocidos con tocino ahumado, salchicha asada, chorizo norteño, cilantro y chiles toreados.",
      price: 45,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80",
      tags: ["Calientito", "Cuchara"],
      isCustomizable: false,
      canHaveTortilla: false,
      canHaveVerdura: false,
      canHaveSalsa: false,
      canHaveExtras: false
    },
    {
      id: "queso-fundido-chorizo",
      categoryId: "entradas",
      name: "Queso Fundido con Chorizo Rojo",
      description: "Cazuelita de barro con mezcla de quesos Oaxaca y Manchego fundidos al comal, coronado con chorizo frito crujiente y 4 tortillas de harina.",
      price: 75,
      image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=700&q=80",
      tags: ["🧀 Fundido"],
      isCustomizable: false,
      canHaveTortilla: false,
      canHaveVerdura: false,
      canHaveSalsa: false,
      canHaveExtras: false
    },

    // --- BEBIDAS ---
    {
      id: "agua-horchata",
      categoryId: "bebidas",
      name: "Agua de Horchata Casera (500 ml)",
      description: "Receta tradicional con arroz remojado, leche entera y condensada, canela recién molida y esencia de vainilla pura. Bien helada.",
      price: 32,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
      tags: ["⭐ Clásica", "Bien Fría"],
      isCustomizable: false
    },
    {
      id: "agua-jamaica",
      categoryId: "bebidas",
      name: "Agua de Jamaica con Limón (500 ml)",
      description: "Infusión concentrada de flor de jamaica natural con un toque cítrico de limón colima. Muy refrescante y equilibrada.",
      price: 32,
      image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=700&q=80",
      tags: ["100% Natural"],
      isCustomizable: false
    },
    {
      id: "jarrito-vidrio",
      categoryId: "bebidas",
      name: "Jarrito de Vidrio (Sabor a elegir)",
      description: "Refresco mexicano tradicional en botella de vidrio fría. Elige sabor: Mandarina, Tamarindo, Toronja o Limón.",
      price: 30,
      image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=700&q=80",
      tags: ["En Vidrio"],
      isCustomizable: false
    },
    {
      id: "cerveza-corona-modelo",
      categoryId: "bebidas",
      name: "Cerveza Nacional Bien Helada (355 ml)",
      description: "Corona Extra, Negra Modelo o Victoria. Servida con limón fresco, sal y popote.",
      price: 42,
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=700&q=80",
      tags: ["+18", "Con Limón & Sal"],
      isCustomizable: false
    },

    // --- POSTRES ---
    {
      id: "churros-cajeta",
      categoryId: "postres",
      name: "Churros Artesanales con Cajeta (4 pzas)",
      description: "Churros recién fritos crujientes, espolvoreados con azúcar y canela, acompañados de dosificador de auténtica cajeta de Celaya.",
      price: 48,
      image: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=700&q=80",
      tags: ["⭐ Recién Hechos", "Cajeta"],
      isCustomizable: false
    },
    {
      id: "flan-abuela",
      categoryId: "postres",
      name: "Flan Napolitano Casero",
      description: "Cremoso flan de huevo y queso con abundante caramelo dorado fundido y toque de vainilla.",
      price: 40,
      image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=700&q=80",
      tags: ["Receta Casera"],
      isCustomizable: false
    }
  ]
};

// Exportar globalmente para uso en navegadores
if (typeof window !== "undefined") {
  window.MENU_DATA = MENU_DATA;
}
