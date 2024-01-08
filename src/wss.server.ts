// websocket.server.ts
import WebSocket from 'ws';
import http from 'http';
import url from 'url';

const createWebSocketServer = (server: http.Server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket & { userId?: string }, req: http.IncomingMessage) => {
    // Extract userId from the query parameters of the WebSocket URL
    const queryObject = url.parse(req.url!, true).query as { userId?: string };
    ws.userId = queryObject.userId || undefined;

    console.log(`WebSocket connection established for user: ${ws.userId}`);
  });

  return wss;
};

export default createWebSocketServer;
