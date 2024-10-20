/* eslint-disable prettier/prettier */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { PACKAGE_SERVICE_URL } from '@/config';
import { logger } from '@utils/logger'; // Assuming you are using a logger utility

const PROTO_PATH = path.join(__dirname, '../../proto/package.proto');

let packageClient: any;

try {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
  });

  const packageProto = grpc.loadPackageDefinition(packageDefinition) as any;

  packageClient = new packageProto.package.PackageService(
    PACKAGE_SERVICE_URL,
    grpc.credentials.createInsecure(),
  );

} catch (error) {
  logger.error('Error initializing gRPC client:', error);
}

export default packageClient;
