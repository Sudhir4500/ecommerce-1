export interface OrderItem {
    id: number;
     
    product: number;
    product_name: string;
    quantity: number;
    price: number;
    total_price: number | string; // Allow string to match serialized data
  }
  
  export interface Order {
    id: number;
    user: number;
    order_number: number;
    total_amount: number | string; // Allow string to match serialized data
    status: string;
    payment_status: string;
    payment_method: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
  }