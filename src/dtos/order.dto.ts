import { IsInt, IsString, IsNotEmpty, IsIn } from 'class-validator';

const orderValidStatus = ['placed',"reserved","received", 'completed', 'canceled'];

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  public depositor_id: number;

  @IsInt()
  @IsNotEmpty()
  public depositee_id: number;

  @IsString()
  @IsNotEmpty()
  public package_id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(orderValidStatus)
  public status: string;
}

export class UpdateOrderDto {
  @IsInt()
  @IsNotEmpty()
  public depositor_id: number;

  @IsInt()
  @IsNotEmpty()
  public depositee_id: number;

  @IsInt()
  @IsNotEmpty()
  public package_id: number;

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
