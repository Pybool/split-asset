import User from "../models/user.model";
import JWT from "jsonwebtoken";
import createError from "http-errors";
import message from "../helpers/messages";
import { utils } from "../helpers/validators/validations_core";
import jwthelper from "../helpers/jwt_helper";
import mailActions from "../services/mailservice";
import validations from "../helpers/validators/joiAuthValidators";
import Xrequest from "../interfaces/extensions.interface";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config as dotenvConfig } from "dotenv";
import Otp from "../models/otp.model";
dotenvConfig();
export class Authentication {
  req: Xrequest;
  payload: { email: string; password: string };

  constructor(req: Xrequest) {
    this.req = req;
    this.payload = req.body || {};
  }

  public async register() {
    try {
      const session = await mongoose.startSession();
      const result = await validations.authSchema.validateAsync(this.req.body);
      const user = await User.findOne({ email: result.email }).session(session);
      if (user) {
        throw createError.Conflict(message.auth.alreadyExistPartText);
      }
      let created = false;
      const userToCreate = new User(result);
      userToCreate.email_confirmed = true; //Remove this line
      const savedUser: any = await userToCreate.save();
      if (savedUser._id.toString().length > 0) {
        created = true;
        mailActions.auth.sendEmailConfirmationMail(savedUser, created);
        return {
          status: true,
          data: savedUser._id.toString(),
          message: "Registration successful",
        };
      }
      return { status: false, message: "Registration was unsuccessfull!" };
    } catch (error: any) {
      console.error(error);
      let msg: string = "Registration was unsuccessfull!";
      if (error.message.includes("already exists!")) {
        error.status = 200;
        msg = error.message || "User with email address already exists!";
      }
      if (error.message.includes("is required")) {
        error.status = 200;
        msg = error.message;
      }
      return { status: false, message: msg };
    }
  }

  public async resendEmailConfirmation() {
    try {
      const result =
        await validations.authResendConfirmLinkSchema.validateAsync(
          this.req.body
        );
      const user: any = await User.findOne({ email: result.email });
      if (!user) {
        throw createError.NotFound(
          utils.joinStringsWithSpace([
            result.email,
            message.auth.notRegisteredPartText,
          ])
        );
      }

      if (user.email_confirmed) {
        return { status: false, message: message.auth.emailAlreadyVerified };
      }
      return await mailActions.auth.sendEmailConfirmationMail(user, false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async sendPasswordResetLink() {
    try {
      const result = await validations.authSendResetPasswordLink.validateAsync(
        this.req.body
      );
      const user = await User.findOne({ email: result.email });
      if (!user) {
        throw createError.NotFound(
          utils.joinStringsWithSpace([
            result.email,
            message.auth.notRegisteredPartText,
          ])
        );
      }
      return await mailActions.auth.sendPasswordResetMail(result, user);
    } catch (error: any) {
      throw error.message;
    }
  }

  public async resetPassword() {
    try {
      if (!this.req.query.token)
        throw createError.BadRequest(message.auth.invalidTokenSupplied);
      const result = await validations.authResetPassword.validateAsync(
        this.req.body
      );
      const user = await User.findOne({
        reset_password_token: this.req.query.token,
        reset_password_expires: { $gt: Date.now() },
      });
      if (!user) {
        throw createError.NotFound(
          utils.joinStringsWithSpace([
            result.email,
            message.auth.userNotRequestPasswordReset,
          ])
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(result.password, salt);
      user.password = hashedPassword; // Set to the new password provided by the user
      user.reset_password_token = undefined;
      user.reset_password_expires = undefined;
      await user.save();
      return { status: true, message: message.auth.passwordResetOk };
    } catch (error) {
      console.log(error);
      return { status: false, message: message.auth.passwordResetFailed };
    }
  }

  public async verifyEmail() {
    try {
      const { token } = this.req.query as any;
      if (!token) {
        return { status: false, message: message.auth.missingConfToken };
      }
      const decoded: any = JWT.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      const user: any = await User.findById(decoded.aud);
      const otpInstance = (await Otp.findOne({ userId: user.id })) as any;
      const isEmailOtpValid = otpInstance.isOtpValid(
        "email",
        this.req.body.otpCode
      );
      console.log("Is Phone OTP Valid:", isEmailOtpValid);

      if (isEmailOtpValid) {
        user.isEmailVerified = true;
        await user.save();
        return { status: true, message: message.auth.emailVerifiedOk };
      } else {
        return { status: false, message: message.auth.invalidConfToken };
      }
    } catch (error) {
      return { status: false, message: message.auth.invalidConfToken };
    }
  }

  public async storeOtp(otp: number, phone:string) {
    try {
      console.log("otp id ", this.req.query.id);
      const user: any = await User.findById(this.req.query.id);
      const existingOtpObject = await Otp.findOne({ userId: user.id });
      if (!existingOtpObject) {
        const otpObject = await Otp.create({
          userId: user.id,
          phoneOtp: otp,
          phoneOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
        });
        user.phone = phone;
        await user.save()
        return {
          status: true,
          data: otpObject._id || null,
          message: message.auth.phoneOtpSentOk,
        };
      } else {
        existingOtpObject.phoneOtp = otp;
        existingOtpObject.phoneOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await existingOtpObject.save();
        user.phone = phone;
        await user.save()
        return {
          status: true,
          data: existingOtpObject._id || null,
          message: message.auth.phoneOtpSentOk,
        };
      }
    } catch (error: any) {
      console.error(error);
      return { status: false, message: "Something went wrong.." };
    }
  }

  public async verifyPhone() {
    try {
      const user: any = await User.findById(this.req.query.id);
      const otpInstance = (await Otp.findOne({ userId: user.id })) as any;
      const isPhoneOtpValid = otpInstance.isOtpValid(
        "phone",
        this.req.body.otpCode
      );
      console.log(
        "Is Phone OTP Valid:",
        isPhoneOtpValid,
        this.req.body.otpCode
      );

      if (isPhoneOtpValid) {
        user.isPhoneVerified = true;
        await user.save();
        return { status: true, message: message.auth.phoneVerifiedOk };
      } else {
        return { status: false, message: message.auth.invalidConfToken };
      }
    } catch (error) {
      return { status: false, message: message.auth.invalidConfToken };
    }
  }

  public async login() {
    try {
      const result = await validations.loginSchema.validateAsync(this.req.body);
      const user: any = await User.findOne({ email: result.email });
      if (!user) return createError.NotFound(message.auth.userNotRegistered);
      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        return createError.Unauthorized(message.auth.invalidCredentials);

      if (!user.email_confirmed)
        return createError.Unauthorized(message.auth.emailNotVerified);

      const accessToken = await jwthelper.signAccessToken(user.id);
      const refreshToken = await jwthelper.signRefreshToken(user.id);
      return { status: true, data: await user.getProfile(), accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      return { status: false, message: message.auth.loginError };
    }
  }

  public async getRefreshToken(next: any) {
    try {
      const { refreshToken } = this.req.body;
      console.log("Refresh token ", refreshToken)
      if (!refreshToken) throw createError.BadRequest();
      const { aud } = (await jwthelper.verifyRefreshToken(
        refreshToken,
        next
      )) as any;
      if (aud) {
        const accessToken = await jwthelper.signAccessToken(aud);
        // const refToken = await jwthelper.signRefreshToken(aud);
        return { status: true, accessToken: accessToken };
      }
    } catch (error: any) {
      console.log(error);
      return { status: false, message: error.mesage };
    }
  }

  public async getUserProfile() {
    try {
      const user: any = await User.findOne({ _id: this.req.userId });
      if (!user) {
        throw createError.NotFound("User was not found");
      }
      return await user.getProfile();
    } catch (error: any) {
      console.log(error);
      throw error.message;
    }
  }

  public async saveUserProfile() {
    try {
      const patchData = this.req.body;
      if (!patchData) {
        throw createError.NotFound("No data was provided");
      }
      const user: any = await User.findOne({ _id: this.req.userId });
      if (!user) {
        throw createError.NotFound("User was not found");
      }
      // Add fields validation
      Object.keys(patchData).forEach((field) => {
        if (field != "email") user[field] = patchData[field];
      });
      await user.save();
      return {
        status: true,
        data: await user.getProfile(),
        message: "Profile updated successfully..",
      };
    } catch (error) {
      console.log(error);
      return { status: false, message: "Profile update failed.." };
    }
  }

  public async changeUserAccountType() {
    try {
      const userId = this.req.body.userId;
      let savedUser;
      const user: any = await User.findById(userId);
      if (user) {
        user.accountType = this.req.body.accountType;
        savedUser = await user.save();
      }
      return {
        status: savedUser.accountType === this.req.body.accountType,
        message: "Sucessfull",
        data: '',
      };
    } catch (error: any) {
      throw error;
    }
  }

  public async changePublicationVisibility() {
    try {
      const userId = this.req.body.userId;
      const user: any = await User.findById(userId);
      user.issuerPublication = this.req.body.issuerPublication;
      const savedUser = await user.save();
      return {
        status: savedUser.issuerPublication === this.req.body.issuerPublication,
        message: "Sucessfull",
        data: savedUser,
      };
    } catch (error: any) {
      throw error;
    }
  }

  public async toggleUserAdminStatus() {
    try {
      const userId = this.req.body.userId;
      const user: any = await User.findById(userId);
      user.isAdmin = !user.isAdmin;
      const savedUser = await user.save();
      return {
        status: savedUser.isAdmin,
        message: "Sucessfull",
        data: savedUser,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: false,
        message: error.message,
      };
    }
  }
}
