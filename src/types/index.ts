export interface User {
  id: number;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  is_staff: boolean;
  is_superuser: boolean;
  is_admin: boolean;
  display_name: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  receive_marketing_emails?: boolean;
  receive_sms_updates?: boolean;
  created_at?: string;
}

export interface Address {
  id: number;
  full_name: string;
  phone: string;
  street_address: string;
  apartment_suite?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: 'shipping' | 'billing' | 'both';
  is_default: boolean;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  display_order: number;
  product_count?: number;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  banner_image?: string;
  is_featured: boolean;
  product_count?: number;
}

export interface ProductVariant {
  id: number;
  variant_type: string;
  variant_name: string;
  sku: string;
  price_adjustment: string | number;
  stock_quantity: number;
  is_active: boolean;
  final_price: string | number;
  is_in_stock: boolean;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  base_price: string | number;
  sale_price: string | number | null;
  current_price: string | number;
  category?: Category;
  category_name?: string;
  category_slug?: string;
  collection?: Collection;
  collection_name?: string;
  primary_image?: string;
  secondary_image?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  metal_type: string;
  metal_type_display?: string;
  metal_purity: string;
  metal_purity_display?: string;
  gemstone: string;
  weight_grams: string | number;
  dimensions?: string;
  packaging_info?: string;
  care_instructions?: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  is_active?: boolean;
  total_stock: number;
  is_in_stock: boolean;
  average_rating: number;
  review_count: number;
}

export interface CartItem {
  id: number;
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
  is_available: boolean;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  subtotal: string | number;
  estimated_shipping: number;
  estimated_tax: number;
  total_price: number;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  product?: number;
  variant?: number | null;
  product_name: string;
  variant_name?: string;
  sku: string;
  unit_price: string | number;
  quantity: number;
  subtotal: string | number;
  image_url?: string;
}

export interface OrderStatusEvent {
  id: number;
  status: string;
  note: string;
  created_by_name: string;
  created_at: string;
}

export interface PaymentRecord {
  id: number;
  transaction_id: string;
  payment_gateway: string;
  payment_method_type: string;
  amount: string | number;
  status: string;
  is_demo: boolean;
  created_at: string;
}

export interface ShipmentEvent {
  timestamp: string;
  location: string;
  status: string;
  note?: string;
}

export interface ShipmentRecord {
  id: number;
  carrier_name: string;
  tracking_number: string;
  tracking_url?: string;
  estimated_delivery_date?: string;
  current_status: string;
  is_demo: boolean;
  timeline_events: ShipmentEvent[];
  updated_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_street: string;
  shipping_apartment?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  status: string;
  status_display: string;
  payment_status: string;
  payment_status_display: string;
  payment_method: string;
  subtotal_amount: string | number;
  discount_amount: string | number;
  shipping_amount: string | number;
  tax_amount: string | number;
  total_amount: string | number;
  coupon_code?: string;
  customer_note?: string;
  admin_note?: string;
  can_cancel: boolean;
  items?: OrderItem[];
  events?: OrderStatusEvent[];
  payment_record?: PaymentRecord;
  shipment_record?: ShipmentRecord;
  first_item_image?: string;
  total_items?: number;
  created_at: string;
}

export interface Review {
  id: number;
  product: number;
  product_name?: string;
  product_slug?: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  moderation_status: 'pending' | 'approved' | 'hidden' | 'flagged';
  created_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string | number;
  minimum_order_amount: string | number;
  maximum_discount_amount?: string | number | null;
  start_date: string;
  end_date?: string | null;
  usage_limit?: number | null;
  used_count: number;
  is_active: boolean;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  cta_text: string;
  cta_link: string;
  badge_text?: string;
  image?: string;
  display_order: number;
  is_active: boolean;
}

export interface StoreSetting {
  store_name: string;
  support_email: string;
  support_phone: string;
  store_address: string;
  gst_number: string;
  announcement_bar_text: string;
  is_announcement_active: boolean;
  free_shipping_threshold: string | number;
  currency_symbol: string;
  currency_code: string;
}
