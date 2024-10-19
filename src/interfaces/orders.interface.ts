export interface Order {
    id?: number;
    depositor_id: number;
    depositee_id: number;
    package_id:string;
    status: string;
    created_at?: Date;
    updated_at?: Date;
  }