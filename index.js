import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './src/config/dbConfig.js';
import adminRoute from './src/routes/adminRoute.js';
import candidateRoute from './src/routes/candidateRoute.js';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Server Running!');
});

// ✅ Allow trusted origins (from .env + localhost)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  "https://hrms-frontend-omega.vercel.app/"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middlewares
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// ✅ Routes
app.use('/api/admin', adminRoute);
app.use('/api/candidate', candidateRoute);

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
