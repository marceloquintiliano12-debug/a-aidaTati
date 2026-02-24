import { Product, Addon } from './types';

// ====== CONFIGURATION ======
export const SUPABASE_URL = "https://vtdmsvwuhvjpzjlvkmpc.supabase.co"; 
export const SUPABASE_KEY = "SUA_CHAVE_AQUI"; 

export const USE_MOCK_BACKEND = false; 

// ====== PAYMENT ======
export const MERCADO_PAGO_LINK = "https://link.mercadopago.com.br/quintilhiostecnolog";
export const DELIVERY_FEE = 2.00; 

// Chave PIX da Loja (Necessário para o Build)
export const STORE_PIX_KEY = "5517996248616"; 
// Chave PIX da Loja
export const STORE_PIX_KEY = "5517996248616"; 
// Adicione esta linha abaixo:
export const STORE_PIX_QR_IMAGE = "";

// ====== STORE CONTACT ======
export const STORE_WHATSAPP = "5517996248616"; 
export const STORE_PHONE_NUMBER_SMS = "+5517996248616"; 

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Açaí Tradicional 300ml',
    price: 12.00,
    description: 'Cremosidade na medida, montado com camadas generosas.',
    category: 'traditional',
    image_url: 'https://vtdmsvwuhvjpzjlvkmpc.supabase.co/storage/v1/object/public/Acai%20da%20Tati/001.jpg'
  },
  {
    id: 2,
    title: 'Açaí Tradicional 500ml',
    price: 15.00,
    description: 'A porção favorita. Muita energia e muito recheio.',
    category: 'traditional',
    image_url: 'https://vtdmsvwuhvjpzjlvkmpc.supabase.co/storage/v1/object/public/Acai%20da%20Tati/Gemini_Generated_Image_43tn3v43tn3v43tn.png'
  },
];

export const AVAILABLE_ADDONS: Addon[] = [
  // Frutas e Crocantes 
  { id: 'morango_fruta', title: 'Morango (Fruta)', price: 5.00 },
  { id: 'gran', title: 'Granola Crocante', price: 3.00 }, 
  { id: 'leite_po', title: 'Leite em Pó', price: 3.00 },
  { id: 'banana', title: 'Banana', price: 4.00 },
  { id: 'farofa', title: 'Farofa de Amendoim', price: 3.00 },
  { id: 'pacoca', title: 'Paçoca', price: 3.00 },
  
  // Cremes Especiais
  { id: 'nutella', title: 'Nutella Original', price: 6.00 },
  { id: 'creme_morango', title: 'Creme de Morango', price: 4.00 },
  { id: 'creme_cookies', title: 'Creme de Cookies', price: 4.00 },
  { id: 'creme_leitinho', title: 'Creme de Leitinho', price: 4.00 },
  { id: 'creme_choco', title: 'Creme Chocowafer', price: 4.00 },

  // Potinhos de Adicionais
  { id: 'potinho_morango', title: 'Potinho de Morango', price: 6.00 },
  { id: 'potinho_granola', title: 'Potinho de Granola', price: 4.00 },
  { id: 'potinho_leite_po', title: 'Potinho de Leite em Pó', price: 4.00 },
  { id: 'potinho_banana', title: 'Potinho de Banana', price: 5.00 },
  { id: 'potinho_farofa', title: 'Potinho de Farofa', price: 4.00 },
  { id: 'potinho_pacoca', title: 'Potinho de Paçoca', price: 4.00 },
  { id: 'potinho_nutella', title: 'Potinho de Nutella', price: 7.00 },
  { id: 'potinho_creme_morango', title: 'Potinho de Creme de Morango', price: 5.00 },
  { id: 'potinho_creme_cookies', title: 'Potinho de Creme de Cookies', price: 5.00 },
  { id: 'potinho_creme_leitinho', title: 'Potinho de Creme de Leitinho', price: 5.00 },
  { id: 'potinho_creme_choco', title: 'Potinho de Creme de Chocowafer', price: 5.00 },
];
