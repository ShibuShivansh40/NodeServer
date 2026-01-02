const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models/Invoice');
const invoiceRoutes = require('./src/routes/invoiceRoutes');

const app = express();
app.use(cors()); // Allow your Android app to connect
app.use(express.json());

// Use routes
app.use('/api', invoiceRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Now run: ngrok http ${PORT}`);
  });
});

// Add this to the very bottom of index.js
app.use((err, req, res, next) => {
  console.error("SERVER CRASH ERROR:", err.stack); // This will show you the real error [web:310]
  res.status(500).json({ success: false, error: err.message });
});
