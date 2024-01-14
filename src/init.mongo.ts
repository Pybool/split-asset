import mongoose from 'mongoose';
import { config as dotenvConfig } from 'dotenv';
import logger from './logger';
dotenvConfig()
const uri = `mongodb+srv://ekoemmanueljavl:${process.env.MONGODB_PASSWORD}@splitassetcluster.qfrvjdg.mongodb.net/?retryWrites=true&w=majority`;

const mongouri:any = uri//'mongodb://127.0.0.1:27017'
console.log("DATBASE NAME ",process.env.DB_NAME)
mongoose 
  .connect(mongouri, {
    dbName: 'SPLIT_ASSET',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => {
    logger.info('MongoDB connected Successfully.')
  })
  .catch((err:any) => console.log(err.message))

mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
  logger.info(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})
