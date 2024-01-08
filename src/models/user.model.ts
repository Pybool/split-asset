import mongoose from 'mongoose';
const Schema = mongoose.Schema
import bcrypt from 'bcryptjs';
import constants from './constants';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email_confirmed: {
    type: Boolean,
    required: true,
    default:false
  },
  isPhoneVerified: { 
    type: Boolean,
    required: false,
    default:false
  },
  fullname: {
    type: String,
    required: false,
    default:''
  },
  lastName: {
    type: String,
    required: true,
    default:''
  },
  firstName: {
    type: String,
    required: false,
    default:''
  },
  userName: {
    type: String,
    required: false,
    default:''
  },
  language: {
    type: String,
    required: false,
    default:'English (UK)',
    enum: constants.userConstants.LANGUAGES,
  },
  currency: {
    type: String,
    required: false,
    default:'Naira (NGN)',
    enum: constants.userConstants.CURRENCIES,
  },
  rating: {
    type: Number,
    required: false,
    default:0
  },
  phone: {
    type: String,
    required: false,
    default:''
  },
  address: {
    type: String,
    required: false,
    default:''
  },
  accountType: {
    type: String,
    required: false,
    default:'investor',
    enum: constants.userConstants.ACCOUNT_TYPES,
  },
  issuerPublication: {
    type: String,
    required: false,
    default:'public',
    enum: constants.userConstants.ISSUER_PUBLICATION,
  },
  avatar: {
    type: String,
    required: false,
    default:'shared/anon.jpeg'
  },
  isAdmin: {
    type: Boolean,
    default:false
  },
  status: {
    type: Boolean,
    default:true
  },
  reset_password_token: {
    type: String,
    required: false,
    default:''
  },
  reset_password_expires: {
    type: Date,
    required: false,
  },
})

UserSchema.statics.getUserProfileById = async function (_id) {
  try {
    const user = await this.findById(_id);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      firstname: user.firstName,
      lastname: user.lastName,
      userName: user.userName,
      email: user.email,
      phone:user.phone,
      address:user.address,
      accountType:user.accountType,
      issuerPublication:user.issuerPublication,
      status:user.status,
      isEmailVerified:user.isEmailVerified,
      isPhoneVerified:user.isPhoneVerified,

    };
  } catch (error) {
    throw error;
  }
};


UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
      this.userName = 'User '+this._id
    }
    next()
  } catch (error:any) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function (password:string) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

UserSchema.methods.getProfile = async function () {
  try {
    return {
      isAdmin: this.isAdmin,
      avatar: this.avatar,
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.userName,
      email: this.email,
      phone:this.phone,
      address:this.address,
      accountType:this.accountType,
      issuerPublication:this.issuerPublication,
      status:this.status,
      isEmailVerified:this.isEmailVerified,
      isPhoneVerified:this.isPhoneVerified,
      
    }
  } catch (error) {
    throw error
  }
}


const User = mongoose.model('user', UserSchema)
export default User
