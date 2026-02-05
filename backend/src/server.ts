// backend/src/server.ts
import app from "./app.js";

const PORT = process.env.PORT || 4000;

const startServer = () => {
  // We no longer need the async wrapper or explicit connection call here
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
