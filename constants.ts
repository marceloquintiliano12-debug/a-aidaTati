
import { Product, Addon } from './types';

// ====== CONFIGURATION ======
// Supabase Project Real
export const SUPABASE_URL = "https://vtdmsvwuhvjpzjlvkmpc.supabase.co"; 
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZG1zdnd1aHZqcHpqbHZrbXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MjMyMDcsImV4cCI6MjA3NDE5OTIwN30.uam-RvkA-9QalwtKhWJQ0ykdND2RPCMSISBR4PM-lMc"; 

// IMPORTANT: Set to false for Production Deployment
export const USE_MOCK_BACKEND = false; 

// ====== PAYMENT ======
// Link fixo do Mercado Pago (Bio/Profile Link) - APENAS PARA CARTÃO
export const MERCADO_PAGO_LINK = "https://link.mercadopago.com.br/acaidatati";

// DADOS DO PIX
export const STORE_PIX_KEY = "3eb2c9d4-de36-4bbb-9c23-64b8008c6ed7";
// Gerador automático de QR Code para a chave informada
export const STORE_PIX_QR_IMAGE = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=3eb2c9d4-de36-4bbb-9c23-64b8008c6ed7"; 

// Valor da Taxa de Entrega (R$)
export const DELIVERY_FEE = 2.00; 

// ====== STORE CONTACT ======
// WhatsApp Number for customer interaction (with DDI 55 and DDD)
export const STORE_WHATSAPP = "5517996248616"; 

// SMS Notification Number (Store Employee/Manager)
export const STORE_PHONE_NUMBER_SMS = "+5517996248616"; 

// ====== MOCK MENU DATA ======
// Fallback apenas se o banco de dados estiver vazio ou inacessível
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
  { id: 'morango_fruta', title: 'Morango (Fruta)', price: 4.00 },
  { id: 'banana', title: 'Banana', price: 3.00 },
  
  { id: 'gran', title: 'Granola Crocante', price: 3.00 }, 
  { id: 'leite_po', title: 'Leite em Pó', price: 3.00 },
  { id: 'farofa', title: 'Farofa Crocante', price: 3.00 },
  
  // CORREÇÃO: IDs distintos e nomes corretos
  { id: 'pacoca_item', title: 'Paçoca', price: 3.00 },
  { id: 'amendoim_granulado', title: 'Amendoim Granulado', price: 3.00 },
  
  { id: 'ovomaltine', title: 'Ovomaltine em Pó', price: 3.00 },
  { id: 'leite_condensado', title: 'Leite Condensado', price: 3.00 },
  
  // Cremes Especiais
  { id: 'nutella', title: 'Nutella Original', price: 4.00 },
  { id: 'creme_morango', title: 'Creme de Morango', price: 3.00 },
  { id: 'creme_cookies', title: 'Creme de Cookies', price: 3.00 },
  { id: 'creme_leitinho', title: 'Creme de Leitinho', price: 3.00 },
  { id: 'creme_choco', title: 'Creme Chocowafer', price: 3.00 },
];
