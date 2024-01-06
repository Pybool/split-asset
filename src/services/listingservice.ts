import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import ListingsModel from "../models/listings.model";
import { config as dotenvConfig } from "dotenv";
import Xrequest from "../interfaces/extensions.interface";
import utils from "../helpers/misc";
import mailActions from "./mailservice";
import User from "../models/user.model";
dotenvConfig();

class ListingService {
  constructor() {}

  private fileFilter(req: any, file: any, cb: any) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = allowedTypes.test(file.mimetype);

    if (ext && mimeType) {
      cb(null, true); 
    } else {
      cb(
        new Error(
          "Invalid file type. Only WEBP, JPEG, JPG, and PNG are allowed."
        ),
        false
      );
    }
  }

  public arraifyUploads() {
    try {
      const storage = multer.memoryStorage();
      const upload = multer({
        storage: storage,
        limits: {
          fieldSize: 9 * 1024 * 1024, // 4MB limit
        },
        fileFilter: this.fileFilter,
      });
      return upload.single("image");
    } catch (error) {
      console.log("Error ", error);
      throw error;
    }
  }

  private buildFilter(parameters: any) {
    return {};
  }

  async createListing(req: Xrequest) {
    try {
      let phone = null;
      let email = null;
      const requestBody = req.body;
      const requestBodyData = JSON.parse(requestBody.data);
      if (req.userId == null) {
        phone = requestBodyData.phone;
        email = requestBodyData.email;
      } else {
        phone = requestBodyData.phone;
        email = requestBodyData.email;
      }
      console.log("Service ", requestBodyData);
      if (phone && email) {
        let imageFile: any = req.file;
        const today = new Date();
        const dateFolder = `${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

        const uploadFolderPath = path
          .join(__dirname, "uploads")
          .replace(path.join("src"), path.join("public"))
          .replace(path.join("services"), "");

        const dailyFolderPath = path.resolve(uploadFolderPath, dateFolder);
        // Create the uploads folder if it doesn't exist
        if (!fs.existsSync(uploadFolderPath)) {
          fs.mkdirSync(uploadFolderPath);
        }
        // Create the daily folder if it doesn't exist
        if (!fs.existsSync(dailyFolderPath)) {
          fs.mkdirSync(dailyFolderPath);
        }
        const fileName = `image_${Date.now()}.png`;
        const filePath = path.resolve(dailyFolderPath, fileName);

        const filePathWithoutPublic = filePath.split(path.join("public"))[1];
        const normalizedFilePath = filePathWithoutPublic.replace(
          new RegExp(path.sep.replace("\\", "\\\\"), "g"),
          "/"
        );
        requestBodyData.assetImages = [normalizedFilePath];
        const user = await User.findOne({ email: requestBodyData.email });
        if (user) {
          requestBodyData.listedBy = user._id;
        }
        console.log(requestBodyData)
        const listing = new ListingsModel(requestBodyData);
        const savedStatus = await listing.save();
        const checkSave = savedStatus._id.toString().length > 0;
        if (checkSave) {
          // Use file.buffer instead of converting base64
          fs.writeFileSync(filePath, imageFile?.buffer);
          return {
            status: checkSave,
            id: savedStatus._id.toString(),
            message: "trueCommit",
          };
        } else {
          return { status: checkSave, id: "", message: "falseCommit" };
        }
      }
      return { status: false, id: "", message: "badData" };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async modifyListing(req:Xrequest){
    try {
      let phone = null;
      let email = null;
      const requestBody = req.body;
      const requestBodyData = JSON.parse(requestBody.data);
      if (req.userId == null) {
        phone = requestBodyData.phone;
        email = requestBodyData.email;
      } else {
        phone = requestBodyData.phone;
        email = requestBodyData.email;
      }
      if (phone && email) {
        let imageFile: any = req.file;
        let fileName:any;
        let filePath:any;
        if(imageFile){
        const today = new Date();
        const dateFolder = `${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

        const uploadFolderPath = path
          .join(__dirname, "uploads")
          .replace(path.join("src"), path.join("public"))
          .replace(path.join("services"), "");

        const dailyFolderPath = path.resolve(uploadFolderPath, dateFolder);
        // Create the uploads folder if it doesn't exist
        if (!fs.existsSync(uploadFolderPath)) {
          fs.mkdirSync(uploadFolderPath);
        }
        // Create the daily folder if it doesn't exist
        if (!fs.existsSync(dailyFolderPath)) {
          fs.mkdirSync(dailyFolderPath);
        }
        fileName = `image_${Date.now()}.png`;
        filePath = path.resolve(dailyFolderPath, fileName);

        const filePathWithoutPublic = filePath.split(path.join("public"))[1];
        const normalizedFilePath = filePathWithoutPublic.replace(
          new RegExp(path.sep.replace("\\", "\\\\"), "g"),
          "/"
        );

        requestBodyData.assetImages = [normalizedFilePath];
      }
        const user = await User.findOne({ email: requestBodyData.email });
        if (user) {
          requestBodyData.listedBy = user._id;
        }
        console.log(requestBodyData)
        const existingListing:any = await ListingsModel.findOne({_id:requestBodyData._id})
        if(!existingListing){
          return { status: false, id: "", message: "falseCommit" };
        }
        Object.keys(requestBodyData).forEach((key)=>{
          if(key !== '_id' && key !== 'image' && requestBodyData[key] !== ''){
            existingListing[key] = requestBodyData[key]
          }
        })
        const savedStatus = await existingListing.save();
        const checkSave = savedStatus._id.toString().length > 0;
        if (checkSave) {
          // Use file.buffer instead of converting base64
          if(imageFile){
            console.log(filePath, imageFile)
            fs.writeFileSync(filePath, imageFile?.buffer);
          }
          return {
            status: checkSave,
            id: savedStatus._id.toString(),
            message: "trueCommit",
          };
          
        } else {
          return { status: checkSave, id: "", message: "falseCommit" };
        }
      }
      return { status: false, id: "", message: "badData" };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getListings(req:Xrequest){
    const listingsUrl = ''
    try {
      const queryParameters = req.query;
      const page = Number(queryParameters.page as string) || 1;
      const perPage = Number(queryParameters.perPage as string) || 10;
      const filter: any = this.buildFilter(queryParameters);
      const totalCount = await ListingsModel.countDocuments(filter);

      // Find documents with pagination and population
      const assetListings = await ListingsModel.find(filter)
        .sort({ date_initiated: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
      const totalPages = Math.ceil(totalCount / perPage);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const paginationInfo = {
        page,
        perPage,
        totalPostRequests: totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };

      const links: any = {
        self: `${listingsUrl}?page=${page}&perPage=${perPage}`,
      };

      if (hasNextPage) {
        links.next = `${listingsUrl}?page=${page + 1}&perPage=${perPage}`;
        links.last = `${listingsUrl}?page=${totalPages}&perPage=${perPage}`;
      }

      if (hasPreviousPage) {
        links.prev = `${listingsUrl}?page=${page - 1}&perPage=${perPage}`;
      }
      return { status: true, data: assetListings, paginationInfo, links };
    } catch (error: any) {
      console.log(error)
      return { status: false, error: error.message };
    }
  }

  async filterListings(req:Xrequest){
    const listingsUrl = ''
    try {
      const queryParameters = req.query;
      const page = Number(queryParameters.page as string) || 1;
      const perPage = Number(queryParameters.perPage as string) || 10;
      const filter: any = req.body;
      const totalCount = await ListingsModel.countDocuments(filter);

      // Find documents with pagination and population
      const assetListings = await ListingsModel.find(filter)
        .sort({ date_initiated: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
      const totalPages = Math.ceil(totalCount / perPage);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const paginationInfo = {
        page,
        perPage,
        totalPostRequests: totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };

      const links: any = {
        self: `${listingsUrl}?page=${page}&perPage=${perPage}`,
      };

      if (hasNextPage) {
        links.next = `${listingsUrl}?page=${page + 1}&perPage=${perPage}`;
        links.last = `${listingsUrl}?page=${totalPages}&perPage=${perPage}`;
      }

      if (hasPreviousPage) {
        links.prev = `${listingsUrl}?page=${page - 1}&perPage=${perPage}`;
      }
      return { status: true, data: assetListings, paginationInfo, links };
    } catch (error: any) {
      console.log(error)
      return { status: false, error: error.message };
    }
  }

  async addInvestorToListing(req: Xrequest) {
    // Find the listing by ID and update the investors field
    try {
      const listingId = req.body.listingId;
      const investorData = { investorId: req.body.userId };

      ListingsModel.findByIdAndUpdate(
        listingId,
        { $push: { investors: investorData } },
        (err: any, updatedListing: any) => {
          if (err) {
            console.error("Error updating listing:", err);
          } else {
            console.log("Updated listing:", updatedListing);
          }
        }
      );
    } catch (error: any) {
      throw error;
    }
  }

  async assignListingShares(req:Xrequest){
    try {
      const listingId = req.query.id;
      const listingData = await ListingsModel.findById(listingId) as any
      if(listingData){
        listingData.shares = req.body.shares 
        await listingData.save()
        return {status:true, message: 'trueCommit'}
      }
      else{
        return {status:false, message: 'falseCommit'}
      }
    } catch (error: any) {
      throw error;
    }
  }

  async removeInvestorFromListing(req: Xrequest) {
    // Find the listing by ID and update the investors field
    try {
      const listingId = req.body.listingId;
      const investorIdToRemove = req.body.investorId;
      ListingsModel.findByIdAndUpdate(
        listingId,
        { $pull: { investors: { investorId: investorIdToRemove } } },
        (err: any, updatedListing: any) => {
          if (err) {
            console.error("Error updating listing:", err);
          } else {
            console.log("Updated listing:", updatedListing);
          }
        }
      );
    } catch (error: any) {
      throw error;
    }
  }
}

export default ListingService;
