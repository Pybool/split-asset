interface IUserProfile {
    isAdmin: boolean;
    avatar: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phone: string;
    address: string;
    accountType: string;
    issuerPublication: string;
    status:boolean;
    isEmailVerified:boolean;
    isPhoneVerified:boolean;
  }
  
export default IUserProfile;
  