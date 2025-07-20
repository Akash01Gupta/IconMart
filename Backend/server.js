const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const settingsRoutes = require('./routes/settingsRoutes');
const advertRoutes = require('./routes/advertRoutes');
const { errorHandler } = require('./middlerware/errorMiddleware'); 


dotenv.config();
const app = express();

// ========== Middleware ==========
app.use(cors());
app.use(express.json({ strict: true }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  next();
});
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ========== Static Files ==========
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== API Routes ==========
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/settings', settingsRoutes);
app.use('/api/advertisement', advertRoutes);

// ========== Health Check ==========
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ========== Custom Error Handler ==========
app.use(errorHandler);

// ========== Start Server After DB Connect ==========
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Failed to connect to the database:', err);
    process.exit(1); // Exit process with failure
  });
