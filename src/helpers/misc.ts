
const utils = {
    generateOtp: (()=>{
        const otp:number = Math.floor(100000 + Math.random() * 900000)
        return otp.toString();
    }),

    telcoSimulate: ((ms:number,phone:string)=>{
        return new Promise((resolve, reject) => {
            console.log("Task started...");
            setTimeout(() => {
              console.log("Task completed!");
              resolve({status:true, phone: phone}); 
            }, ms);
          });
          
    }),

    formatDateToCustomString:(date:Date) =>{
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const period = date.getHours() < 12 ? 'am' : 'pm';
    
      return `${year}-${month}-${day} ${hours}:${minutes}${period}`;
    },

    addDaysToCurrentDate: (n:number)=> {
      const currentDate = new Date();
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + n);
      return newDate;
    },

    wss: null,

    delay(ms:number){
      return new Promise(resolve=> setTimeout(resolve,ms))
    },

    flattenArray:(arr:any) => {
      return arr.reduce((acc:any, curr: any) => {
        return acc.concat(Array.isArray(curr) ? utils.flattenArray(curr) : curr);
      }, []);
    },

    userConnections: new Map()
}

export default utils;