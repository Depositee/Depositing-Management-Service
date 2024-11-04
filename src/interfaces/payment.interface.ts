export interface Payment {
    senderId: string;
    receiverId: string;
    amount: number;
    currency: string;
    }

export interface PaymentResponse {
    Id: number;
    senderId: string;
    receiverId: string;
    amount: number;
    currency: string;
    created_at: Date;
    updated_at: Date;
    }