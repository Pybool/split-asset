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
import SubscriptionsModel from "../models/listing.subscriptions";
import BookmarksModel from "../models/bookmarks.model";
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

  private async buildFilter(req:Xrequest,parameters: any) {
    
    if (parameters.filter == "1") {
      return { isApproved: true };
    }

    if (parameters.filter==req.userId) {
      const user = await User.findOne({ _id: req.userId }) as any
      console.log("Listings Filter ===> ", parameters.filter, user.email)
      return { email: user.email };
    }
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
        console.log(requestBodyData);
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

  async modifyListing(req: Xrequest) {
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
        let fileName: any;
        let filePath: any;
        if (imageFile) {
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
        console.log(requestBodyData);
        const existingListing: any = await ListingsModel.findOne({
          _id: requestBodyData._id,
        });
        if (!existingListing) {
          return { status: false, id: "", message: "falseCommit" };
        }
        Object.keys(requestBodyData).forEach((key) => {
          if (key !== "_id" && key !== "image" && requestBodyData[key] !== "") {
            existingListing[key] = requestBodyData[key];
          }
        });
        const savedStatus = await existingListing.save();
        const checkSave = savedStatus._id.toString().length > 0;
        if (checkSave) {
          // Use file.buffer instead of converting base64
          if (imageFile) {
            console.log(filePath, imageFile);
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

  async getListings(req: Xrequest) {
    const listingsUrl = "";
    try {
      const queryParameters = req.query;
      const page = Number(queryParameters.page as string) || 1;
      const perPage = Number(queryParameters.perPage as string) || 10;
      const filter: any = await this.buildFilter(req,queryParameters);
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
      console.log(error);
      return { status: false, error: error.message };
    }
  }

  async filterListings(req: Xrequest) {
    const listingsUrl = "";
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
      console.log(error);
      return { status: false, error: error.message };
    }
  }

  async assignListingShares(req: Xrequest) {
    try {
      const listingId = req.query.id;
      const listingData = (await ListingsModel.findById(listingId)) as any;
      if (listingData) {
        listingData.shares = req.body.shares;
        await listingData.save();
        return { status: true, message: "trueCommit" };
      } else {
        return { status: false, message: "falseCommit" };
      }
    } catch (error: any) {
      throw error;
    }
  }

  sumShares(data: any[]) {
    return data.reduce((totalShares, item) => totalShares + item.shares, 0);
  }

  async getAssetSharesLeft(listingId: string) {
    try {
      const shares = await SubscriptionsModel.find({ listing: listingId });
      const listingData = (await ListingsModel.findById(listingId)) as any;
      const [lower, upper] = listingData.shares.split("-").map(Number);
      return {
        status: true,
        sharesLeft: upper - this.sumShares(shares),
      };
    } catch (err: any) {
      return {
        status: true,
        sharesLeft: "N/A",
      };
    }
  }

  async addListingSubscriber(req: Xrequest) {
    try {
      let checkSave: any, result: any;
      const subscription = req.body;

      subscription.user = req.userId;
      const existingSubscriptionObjects = await SubscriptionsModel.find({
        user: subscription.user,
        listing: subscription.listing,
      });
      let sharesLeftResult: any = await this.getAssetSharesLeft(
        subscription.listing
      );
      if (sharesLeftResult.sharesLeft > 0) {
        if (existingSubscriptionObjects.length > 0) {
          existingSubscriptionObjects[0].shares =
            this.sumShares(existingSubscriptionObjects) + subscription.shares;
          result = await existingSubscriptionObjects[0].save();
          checkSave = result._id.toString().length > 0;
        } else {
          const subscriptionObject = await new SubscriptionsModel(subscription);
          result = await subscriptionObject.save();
          checkSave = result._id.toString().length > 0;
          console.log("Created ", result._id);
        }

        if (checkSave) {
          return {
            status: checkSave,
            id: result._id.toString(),
            sharesLeft: sharesLeftResult,
            message: "Asset subscription was successful",
          };
        } else {
          return {
            status: checkSave,
            id: "",
            message: "Asset subscription was unsuccessful",
          };
        }
      } else {
        return {
          status: false,
          id: "",
          message: "No shares available for reservation at this moment",
        };
      }
    } catch (error: any) {
      throw error;
    }
  }

  async removeListingSubscriber(req: Xrequest) {
    // Find the listing by ID and update the investors field
    try {
      const subscription = req.body;
      subscription.user = req.userId;
      const filter = {
        user: subscription.user,
        listing: subscription.listing,
      };
      const subscriptionObj = await SubscriptionsModel.find(filter);

      if (subscriptionObj.length > 0) {
        subscriptionObj[0].shares = subscriptionObj[0].shares - 1;
        await subscriptionObj[0].save();
        let msg = "Share has been updated successfully";
        if (subscriptionObj[0].shares == 0 || subscription.shares == -1) {
          msg = "Documents deleted successfully";
          await SubscriptionsModel.deleteMany(filter);
        }

        return {
          status: true,
          message: msg,
        };
      } else {
        return {
          status: false,
          message: "No matching documents found",
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getListingSubscriptionsByAssetId(req: Xrequest) {
    try {
      const subscriptions = await SubscriptionsModel.find(req.body)
        .sort({ createdAt: -1 })
        .exec();
      console.log("subscriptions ", subscriptions);
      if (subscriptions) {
        return { status: true, data: subscriptions };
      } else {
        return { status: false, data: [] };
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getListingSubscriptionsByUserId(req: Xrequest) {
    try {
      const subscriptions = await SubscriptionsModel.find({ user: req.userId });
      const fullSubscriptions: any[] = [];
      for (const subscription of subscriptions) {
        try {
          const listingObj =
            (await ListingsModel.findOne({
              _id: subscription.listing,
            })) || {};

          if (listingObj) {
            subscription.listing = listingObj;
            fullSubscriptions.push(subscription);
          }
        } catch (error) {
          console.error("Error fetching listing:", error);
        }
      }
      if (fullSubscriptions) {
        return { status: true, data: fullSubscriptions };
      } else {
        return { status: false, data: [] };
      }
    } catch (error: any) {
      throw error;
    }
  }

  async bookMarkListing(req: Xrequest, data: any) {
    try {
      data.user = req.userId;
      if (await ListingsModel.findById(data.listing)) {
        const existBookMark = await BookmarksModel.find(data);
        if (existBookMark.length == 0) {
          const bookMark = await new BookmarksModel(data);
          const resultObj = await bookMark.save();
          if (resultObj) {
            return { status: true, message: "trueCommit" };
          } else {
            return { status: false, message: "falseCommit" };
          }
        } else {
          return { status: false, message: "exists" };
        }
      } else {
        return { status: false, message: "notFound" };
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getBookMarksByUserId(req: Xrequest) {
    try {
      const BookMarks = await BookmarksModel.find({ user: req.userId });
      const fullBookMarks: any[] = [];
      for (const bookMark of BookMarks) {
        try {
          const listingObj =
            (await ListingsModel.findOne({
              _id: bookMark.listing,
            })) || {};

          if (listingObj) {
            bookMark.listing = listingObj;
            fullBookMarks.push(bookMark);
          }
        } catch (error) {
          console.error("Error fetching listing:", error);
        }
      }
      if (fullBookMarks) {
        return { status: true, data: fullBookMarks };
      } else {
        return { status: false, data: [] };
      }
    } catch (error: any) {
      throw error;
    }
  }
}

export default ListingService;
