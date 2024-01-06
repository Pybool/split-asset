import logger from '../../../logger';
import { Request, Response } from 'express';
import Xrequest from '../../../interfaces/extensions.interface';
import constants from '../../../models/constants';

const commonController = {

  getConstants: async (req:Xrequest, res:Response) => {
    try {
      return res.status(200).json({status:true, data:constants}); 
    } catch (error) {
      return res.status(400).json({ status: false, error: error })
    }
  },
}

export default commonController;