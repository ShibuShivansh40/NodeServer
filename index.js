const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./src/db'); // Central DB connection
const Invoice = require('./src/models/Invoice'); // Force load models
const Client = require('./src/models/Client');   // Force load models
const Product = require('./src/models/Product'); // Force load models
const invoiceRoutes = require('./src/routes/invoiceRoutes');

app.use(cors()); // Allow your Android app to connect
app.use(express.json());
app.use('/api', invoiceRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database sync failed:', err);
});

// Add this to the very bottom of index.js
app.use((err, req, res, next) => {
  console.error("SERVER CRASH ERROR:", err.stack); // This will show you the real error [web:310]
  res.status(500).json({ success: false, error: err.message });
});
