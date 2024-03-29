import express, {Request, Response} from 'express';
import http from 'http';
import cors from 'cors';
import  AuthRoute from "./routes/api/v1/authentication.route";
import  listingRoutes from "./routes/api/v1/listings.route";
import  adminRoutes from "./routes/api/v1/admin.route";
import commonRoutes from "./routes/api/v1/common.route";
import notificationRoutes from "./routes/api/v1/notifications.route";
import session  from 'express-session';
import './init.mongo'
import { config as dotenvConfig } from 'dotenv';
import logger from './logger';
import createWebSocketServer from './wss.server';
dotenvConfig()
console.log(process.env.ACCESS_TOKEN_SECRET)
const SERVER_URL = '0.0.0.0'
const app = express();


app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
app.use(express.json());
app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/api/v1/auth',AuthRoute)
app.use("/api/v1", listingRoutes)
app.use("/api/v1", notificationRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/common", commonRoutes)
app.use(cors())

app.set('view engine', 'ejs');
app.set('views', 'src/templates');

const server = http.createServer(app);
const wss = createWebSocketServer(server);
app.set('wss', wss);

const PORT = 3000;
server.listen(PORT, () => {
  logger.info(`Development Server is running on ${SERVER_URL}:${PORT}`);
});