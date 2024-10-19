import { App } from '@/app';
import { OrderRoute } from './routes/orders.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new OrderRoute()]);

app.listen();
