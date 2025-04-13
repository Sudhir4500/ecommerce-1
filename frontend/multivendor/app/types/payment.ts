// types/payment.ts
export interface CreatePaymentIntentResponse {
    paymentId: string;
    clientSecret?: string; // Only for Stripe
    paymentIntentId?: string; // Only for Stripe
    orderId: string;
    message?: string; // Only for COD
    error?: string;
  }
  
  export interface ConfirmPaymentPayload {
    paymentId: string;
    paymentIntentId?: string;
    status?: 'succeeded' | 'failed';
    paymentMethod: 'stripe' | 'cod';
    cod_status?: 'confirmed' | 'failed' | 'pending';
  }
  
  export interface ConfirmPaymentResponse {
    detail: string;
  }