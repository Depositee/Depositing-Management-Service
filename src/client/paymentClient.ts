/* eslint-disable prettier/prettier */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { PAYMENT_SERVICE_URL } from '@/config';
import { logger } from '@utils/logger'; // Assuming you are using a logger utility

const PROTO_PATH = path.join(__dirname, '../../proto/payment.proto');

let paymentClient: any;

try {
  const paymentDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
  });

  const paymentProto = grpc.loadPackageDefinition(paymentDefinition) as any;

  paymentClient = new paymentProto.package.PackageService(
    PAYMENT_SERVICE_URL,
    grpc.credentials.createInsecure(),
  );

} catch (error) {
  logger.error('Error initializing gRPC client:', error);
}

export default paymentClient;
