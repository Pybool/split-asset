import logger from '../../../logger';
import { Request, Response } from 'express';
import Xrequest from '../../../interfaces/extensions.interface';
import constants from '../../../models/constants';
import mailActions from '../../../services/mailservice';

const commonController = {

  getConstants: async (req:Xrequest, res:Response) => {
    try {
      return res.status(200).json({status:true, data:constants}); 
    } catch (error) {
      return res.status(400).json({ status: false, error: error })
    }
  },

  sendInvite: async (req:Xrequest, res:Response) => {
    try {
      await mailActions.property.sendPropertyInvite(req.body)
      return res.status(200).json({status:true}); 
    } catch (error) {
      return res.status(400).json({ status: false, error: error })
    }
  },
}

export default commonController;