import { IsString, IsNotEmpty, IsIn, IsOptional, IsInt } from 'class-validator';

const orderValidStatus = ['placed', 'reserved', 'received', 'completed', 'canceled'];

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  public depositor_id: string;

  @IsString()
  @IsOptional()
  public depositee_id?: string;

  @IsString()
  @IsNotEmpty()
  public package_name: string;

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
  public depositor_id: string;

  @IsString()
  @IsOptional()
  public depositee_id?: string;

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
