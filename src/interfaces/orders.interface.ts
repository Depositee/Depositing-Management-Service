export interface Order {
    id?: number;
    depositorId: string;
    depositeeId?: string;
    package_id?:string;
    status: string;
    payment_type:string;
    payment_amount:number
    created_at?: Date;
    updated_at?: Date;
    package_name: string;
    package_description: string; 
    package_weight: number
  }

export interface OrderStatus{
    id?: number;
    status: string;
}