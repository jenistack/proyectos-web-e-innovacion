// Datos de muestra iniciales para el panel de taquería
const INITIAL_ORDERS = [
  {
    id: "TK-104",
    customer: "Mesa 4 (David y amigos)",
    orderType: "mesa",
    tableNumber: "4",
    channel: "Salón",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // hace 3 minutos
    status: "pendiente",
    items: [
      { quantity: 4, name: "Tacos al Pastor", price: 22, options: "Con todo: piña, cilantro y cebolla" },
      { quantity: 3, name: "Tacos de Suadero", price: 24, options: "Cebolla asada y cilantro" },
      { quantity: 2, name: "Gringas de Pastor", price: 45, options: "Queso fundido extra" },
      { quantity: 2, name: "Agua de Horchata 1L", price: 35, options: "Fría con canela" },
      { quantity: 1, name: "Coca-Cola 600ml", price: 28, options: "Bien fría" }
    ],
    notes: "Tortillas bien doraditas al comal, salsas roja y verde extra por favor.",
    total: 358,
    paymentStatus: "pendiente_pago",
    paymentMethod: "Efectivo"
  },
  {
    id: "TK-103",
    customer: "Valeria Ramos (Mostrador)",
    orderType: "llevar",
    tableNumber: null,
    channel: "Para Llevar",
    createdAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(), // hace 9 minutos
    status: "preparando",
    items: [
      { quantity: 5, name: "Tacos de Bistec con Queso", price: 28, options: "Con verdura y limón" },
      { quantity: 2, name: "Costras de Pastor", price: 50, options: "Queso dorado crujiente" },
      { quantity: 1, name: "Frijoles Charros Especiales", price: 40, options: "Con tocino y chile serrano" },
      { quantity: 1, name: "Agua de Jamaica 1L", price: 35, options: "Poco dulce" }
    ],
    notes: "Para llevar en domo térmico. Separar las salsas para que no se remoje la tortilla.",
    total: 315,
    paymentStatus: "pagado",
    paymentMethod: "Tarjeta"
  },
  {
    id: "TK-102",
    customer: "Mesa 2 (Pareja)",
    orderType: "mesa",
    tableNumber: "2",
    channel: "Salón",
    createdAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(), // hace 16 minutos
    status: "listo",
    items: [
      { quantity: 3, name: "Tacos de Carnitas (Maciza y Cuerito)", price: 25, options: "Cilantro, cebolla y rábanos" },
      { quantity: 2, name: "Tacos de Longaniza", price: 22, options: "Con papitas al vapor" },
      { quantity: 1, name: "Quesadilla con Champiñones", price: 38, options: "Tortilla de maíz azul" },
      { quantity: 2, name: "Cerveza Corona Extra", price: 40, options: "Con limón y sal" }
    ],
    notes: "Listo para llevar a la mesa.",
    total: 237,
    paymentStatus: "pendiente_pago",
    paymentMethod: "Tarjeta"
  },
  {
    id: "TK-101",
    customer: "Repartidor Uber #4492 (Carlos L.)",
    orderType: "delivery",
    tableNumber: null,
    channel: "Delivery",
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(), // hace 28 minutos
    deliveredAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    status: "entregado",
    items: [
      { quantity: 6, name: "Tacos al Pastor", price: 22, options: "Con piña, salsa roja" },
      { quantity: 4, name: "Tacos de Tripa Dorada", price: 26, options: "Tripa bien crujiente" },
      { quantity: 1, name: "Orden de Cebollitas Cambray", price: 30, options: "Con sazonador de la casa" },
      { quantity: 2, name: "Boing de Guayaba 500ml", price: 25, options: "Fríos" }
    ],
    notes: "Entregado a repartidor con ticket grapado a la bolsa.",
    total: 316,
    paymentStatus: "pagado",
    paymentMethod: "Plataforma Digital"
  },
  {
    id: "TK-100",
    customer: "Mesa 7 (Don Fernando)",
    orderType: "mesa",
    tableNumber: "7",
    channel: "Salón",
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    status: "entregado",
    items: [
      { quantity: 3, name: "Tacos de Cabeza (Surtida)", price: 24, options: "Cilantro, cebolla y salsa verde" },
      { quantity: 2, name: "Tacos de Suadero", price: 24, options: "Bien suaves" },
      { quantity: 1, name: "Agua de Horchata 500ml", price: 25, options: "Normal" }
    ],
    notes: "Cliente habitual.",
    total: 145,
    paymentStatus: "pagado",
    paymentMethod: "Efectivo"
  }
];

// Menú predefinido para crear pedidos manuales rápidamente
const MENU_CATALOG = [
  { category: "Tacos Tradicionales", items: [
    { name: "Taco al Pastor", price: 22, defaultDesc: "Con todo: piña, cilantro y cebolla" },
    { name: "Taco de Suadero", price: 24, defaultDesc: "Cebolla y cilantro" },
    { name: "Taco de Bistec", price: 26, defaultDesc: "Carne fresca al momento" },
    { name: "Taco de Tripa (Dorada)", price: 26, defaultDesc: "Bien crujiente" },
    { name: "Taco de Longaniza", price: 22, defaultDesc: "Con papitas al comal" },
    { name: "Taco Campechano", price: 28, defaultDesc: "Bistec, longaniza y chicharrón" },
    { name: "Taco de Carnitas", price: 25, defaultDesc: "Maciza, cuerito y surtida" }
  ]},
  { category: "Especialidades con Queso", items: [
    { name: "Gringa de Pastor", price: 45, defaultDesc: "Tortilla de harina y queso gouda" },
    { name: "Gringa de Suadero", price: 48, defaultDesc: "Tortilla de harina con queso" },
    { name: "Costra de Pastor", price: 50, defaultDesc: "Queso crujiente a la plancha" },
    { name: "Costra de Bistec", price: 54, defaultDesc: "Queso dorado con bistec" },
    { name: "Quesadilla Sencilla", price: 32, defaultDesc: "Maíz o harina" }
  ]},
  { category: "Entradas y Guarniciones", items: [
    { name: "Cebollitas Cambray", price: 30, defaultDesc: "Asadas con salsa Maggi e inglesa" },
    { name: "Frijoles Charros", price: 40, defaultDesc: "Con tocino, salchicha y chile" },
    { name: "Guacamole con Totopos", price: 48, defaultDesc: "Aguacate fresco preparado" },
    { name: "Chicharrón de Queso", price: 45, defaultDesc: "Queso dorado con salsa mexicana" }
  ]},
  { category: "Bebidas", items: [
    { name: "Agua de Horchata 1L", price: 35, defaultDesc: "Receta artesanal" },
    { name: "Agua de Jamaica 1L", price: 35, defaultDesc: "Natural bien fría" },
    { name: "Refresco 600ml", price: 28, defaultDesc: "Coca, Sidral, Jarritos, Boing" },
    { name: "Cerveza Corona / Victoria", price: 40, defaultDesc: "355ml bien fría" }
  ]}
];
