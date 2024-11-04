import { IsString, IsNotEmpty, IsIn, IsOptional, IsInt } from 'class-validator';

const orderValidStatus = ['placed', 'reserved', 'received', 'completed', 'canceled'];
const paymentType = ['other', 'platform'];

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  public depositorId: string;

  @IsString()
  @IsOptional()
  public depositeeId?: string;

  @IsString()
  @IsNotEmpty()
  public package_name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(paymentType)
  public payment_type: string;

  @IsInt()
  @IsNotEmpty()
  public payment_amount:number

  @IsString()
  @IsNotEmpty()
  public package_description: string;

  @IsInt()
  @IsNotEmpty()
  public package_weight: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsNotEmpty()
  public depositorId: string;

  @IsString()
  @IsOptional()
  public depositeeId?: string;

  @IsString()
  @IsNotEmpty()
  public package_id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(orderValidStatus)
  public status: string;
}
export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(orderValidStatus)
  public status: string;
}
