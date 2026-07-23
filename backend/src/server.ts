import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Car Dealership API server running on http://localhost:${PORT}`);
});
