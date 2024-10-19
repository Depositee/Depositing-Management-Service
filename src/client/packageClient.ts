import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { PACKAGE_SERVICE_URL } from '@/config';

const PROTO_PATH = path.join(__dirname, './proto/package.proto'); 
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const packageDefinitionObject = grpc.loadPackageDefinition(packageDefinition) as any; 
const packageClient = new packageDefinitionObject.package.PackageService(
    PACKAGE_SERVICE_URL, 
  grpc.credentials.createInsecure(), 
);

export default packageClient;
