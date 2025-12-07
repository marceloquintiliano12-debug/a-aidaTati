export interface Addon {
  id: string;
  title: string;
  price: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: 'traditional' | 'special';
}

export interface CartItem {
  cartId: string; // Unique ID for this instance in cart
  product: Product;
  qty: number;
  selectedAddons: Addon[];
  needSpoon: boolean;
}

export interface Order {
  customer_name: string;
  items: {
    product_id: number;
    product_title: string;
    qty: number;
    addons: Addon[];
    needSpoon: boolean;
    subtotal: number;
  }[];
  total_amount: number;
  payment_method: 'pix' | 'card' | 'money';
  delivery_type: 'delivery' | 'pickup';
  delivery_fee: number;
  address?: string; // Address required for delivery
  change_for?: string; // For money payments
  status: 'pending' | 'paid' | 'cancelled';
}

export interface CheckoutResponse {
  success: boolean;
  orderId?: string;
  pixQrCode?: string; // Base64 image or text code
  pixCodeText?: string; // Copy/paste code
  checkoutUrl?: string; // For credit card redirect
  error?: string;
}