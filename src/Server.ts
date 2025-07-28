import { CorsOptions } from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/Db.config';
import { httpServer } from './config/socket/socket';
import { envConstant } from './constant/env.constant';
import app from './routes/app';
import { validateEnv } from './validator/env.validator';

app.use(morgan('dev'));

validateEnv(process.env);

app.use(helmet());

const whitelist = [
  'http://localhost:3000',
  'https://rana-auto-mobiles-bagodar.vercel.app',
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const originIsAllowed = !origin || whitelist.includes(origin);
    if (originIsAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Start the HTTP server
httpServer.listen(envConstant.PORT, async () => {
  try {
    console.log(`Server is running on port ${envConstant.PORT}`);
    await connectDB();
  } catch (error: any) {
    console.error('Error starting the server:', error.message);
    process.exit(1);
  }
});
