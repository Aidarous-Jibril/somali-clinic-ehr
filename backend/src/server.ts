// backend/src/server.ts
import app from "./app.js";

const PORT = process.env.PORT || 4000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
