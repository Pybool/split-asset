interface ListingsConstants {
  BUILDING_TYPES: string[];
  SALE_PORTIONS: string[];
  OCCUPANCY_STATUS: string[];
  PROPERTY_MANAGEMENT: string[];
  PROPERTY_OWNERSHIP: string[];
  PROPERTY_CONDITION: string[];
  [key: string]: string[];
}

interface UserConstants {
  ACCOUNT_TYPES: string[];
  ISSUER_PUBLICATION: string[];
  [key: string]: string[];
}

interface ListingsFilterConstants {
  PROPERTY: string[];
  LOCATION: string[];
  TYPE: string[];
  [key: string]: string[];
}

const listingsFilterConstants: ListingsFilterConstants = {
  PROPERTY: ["Available", "Funded", "Exited"],
  LOCATION: ["Lagos", "Abuja", "Port-Harcourt"],
  TYPE: ["1 Bed", "2 Bed", "3 Bed", "4+ Bed"],
};

const listingsConstants: ListingsConstants = {
  BUILDING_TYPES: [
    "Single Dwelling",
    "Multiple Dwelling",
    "Parcel of Land",
    "Other",
  ],
  SALE_PORTIONS: ["0-10%", "10-50%", "50-90%", "100%"],
  OCCUPANCY_STATUS: ["Vacant", "Tenant", "Owner", "Other Arrangement"],
  PROPERTY_MANAGEMENT: ["Yes", "No", "I manage myself"],
  PROPERTY_OWNERSHIP: ["I have a loan", "I outrightly own it"],
  PROPERTY_CONDITION: [
    "Excellent",
    "New",
    "Well Maintained",
    "Significant Repairs",
  ],
};

const userConstants: UserConstants = {
  ACCOUNT_TYPES: ["investor", "issuer"],
  ISSUER_PUBLICATION: ["public", "private"],
  LANGUAGES: ["English (UK)", "English (US)"],
  CURRENCIES: ["Naira (NGN)"],
};

const sharesConstants: string[] = ["1-10", "1-20", "1-30", "1-40", "1-50", ""];

const constants = {
  listingsConstants,
  userConstants,
  listingsFilterConstants,
  sharesConstants,
};

export default constants;
