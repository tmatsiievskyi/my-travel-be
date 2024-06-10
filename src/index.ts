import { createServer } from '@server/createServer';

(async () => {
  const server = await createServer();
  server.startServer();
})();
