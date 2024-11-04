import { App } from '@/app';
import { OrderRoute } from './routes/orders.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();
try{
  const app = new App([new OrderRoute()]);
  app.listen();
}
catch(err){
  console.log(err);
}
process.on('unhandledRejection', (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

process.on('uncaughtException', (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1); // Optional: exit the process after logging the error
});