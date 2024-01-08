// websocket.server.ts
import WebSocket from 'ws';

const wss = new WebSocket.Server();

wss.on('connection', (ws: WebSocket & { userId?: string }) => {
  ws.on('message', (message: string) => {
    
    ws.userId = message;

    console.log(`WebSocket connection established for user: ${ws.userId}`);
  });
});

export default wss;
