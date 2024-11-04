import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import paymentClient from '@/client/paymentClient';
import { Payment,PaymentResponse } from '@/interfaces/payment.interface';

@Service()
export class PaymentService {
    public async makePayment(paymentData: Payment): Promise<PaymentResponse> {
        return new Promise((resolve, reject) => {
            paymentClient.MakePayment(paymentData, (error, response: PaymentResponse) => {
                if (error) {
                    return reject(new HttpException(500, error.message));
                }
                resolve(response);
            });
        });
    }
}