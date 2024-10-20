export interface Order {
    id?: number;
    depositorId: string;
    depositeeId?: string;
    package_id?:string;
    status: string;
    created_at?: Date;
    updated_at?: Date;
  }

export interface OrderStatus{
    id?: number;
    status: string;
}