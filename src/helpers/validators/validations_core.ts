import constants from "../../models/constants";


export function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhone(phoneNumber:string){
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
    const nigerianPhoneNumberRegex = /^(?:\+234|0)([789]\d{9})$/;
    return nigerianPhoneNumberRegex.test(numericPhoneNumber);
}

export function validateFullName(fullName:string, namesCountLimit=3){
    const trimmedFullName = fullName.trim();
    const words = trimmedFullName.split(/\s+/);
    //Fullname must have at least 2 names and not more than 3
    return words.length <= namesCountLimit && words.length > 1;
}

export function validateListingParameter(parameter:string,value:string){
  console.log(parameter, value, constants.listingsConstants[parameter])
  return constants.listingsConstants[parameter]?.includes(value) ?? false;
}

export function validateBooleanParameter(value: any): boolean {
  return typeof value === 'boolean';
}

export function validateBase64Images(base64Images:any[]){
    
    if (!Array.isArray(base64Images)) {
        base64Images = [base64Images]
      }
    
      for (const item of base64Images) {
        if (typeof item !== 'string') {
          return false;
        }
      }
    return true;
}

export const utils = {
  joinStringsWithSpace :((stringsArray:any[])=>{
      return stringsArray.join(" ");
  })
}
