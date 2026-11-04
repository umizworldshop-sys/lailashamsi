const app = require('../server');

// Serverless function handler for Vercel
module.exports = (req, res) => {
  return app(req, res);
};
