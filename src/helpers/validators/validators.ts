import { ICreateListing, ValidationStatus } from "../../interfaces/listing.interface";
import {
  validateBase64Images,
  validateFullName,
  validateEmail,
  validatePhone,
  validateListingParameter,
  validateBooleanParameter
} from "./validations_core";

const validators = {
  createListing: (payload: ICreateListing) => {
    const validation: Record<string, ValidationStatus> = {
      email: {
        status: validateEmail(payload.email),
        error: "A valid email address is required",
      },
      phone: {
        status: validatePhone(payload.phone),
        error: "A valid nigerian phone number is required",
      },
      fullName: {
        status: validateFullName(payload.fullName),
        error: "Your fullname must contain atleast 2 names and not more than 3 names",
      },
      buildingType:{
        status: validateListingParameter('BUILDING_TYPES',payload.buildingType),
        error: "You have not selected a valid building type",
      },
      salePortion:{
        status: validateListingParameter('SALE_PORTIONS',payload.salePortion),
        error: "You have not selected a valid sale portion",
      },
      propertyCondition:{
        status: validateListingParameter('PROPERTY_CONDITION',payload.propertyCondition),
        error: "You have not selected a valid property condition",
      },
      occupancyStatus:{
        status: validateListingParameter('OCCUPANCY_STATUS',payload.occupancyStatus),
        error: "You have not selected a valid occupancy status",
      },
      companyPropertyManagement:{
        status: validateListingParameter('PROPERTY_MANAGEMENT',payload.companyPropertyManagement),
        error: "You have not selected a valid property management status",
      },
      propertyOwnership:{
        status: validateListingParameter('PROPERTY_OWNERSHIP',payload.propertyOwnership),
        error: "You have not selected a valid ownership status",
      },
      assetImages: {
        status: true || validateBase64Images(payload.assetImages),
        error: "Only Images are allowed",
      },
    };
    // Check if any validation failed
    const failedValidations = Object.entries(validation).filter(
        ([, { status }]) => !status
      );
      if (failedValidations.length > 0) {
        const [, { error }] = failedValidations[0];
        return { success: false, error };
      }
      return { success: true };
  },
};

export default validators;
