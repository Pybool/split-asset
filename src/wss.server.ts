import WebSocket from 'ws';
import http from 'http';
import url from 'url';
import logger from './logger';
import { decodeToken } from './middlewares/jwt';

const createWebSocketServer = (server: http.Server) => {

  const wss = new WebSocket.Server({ server });
  wss.on('connection', async(ws: WebSocket & { token?: string }, req: http.IncomingMessage) => {
    const queryObject:{token?:string} = url.parse(req.url!, true).query as { token?: string };
    const result = await decodeToken(queryObject.token!) as any;
    if(result.status){
      ws.token = queryObject.token || undefined;
      logger.info(`WebSocket connection established for user: ${ws.token}`);
    }
  });

  return wss;
};

export default createWebSocketServer;
