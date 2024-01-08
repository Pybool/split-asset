import { Request } from 'express';

interface Xrequest extends Request {
  userId?: string; 
  authToken?: string;
  user?:any;
  payload?:any;
  body:any;

}

export default Xrequest;
