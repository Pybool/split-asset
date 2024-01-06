import twilio from "twilio";

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
 async function sendSms(message:string,to:string) {
  try {

    const smsResponse = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log('SMS sent:', smsResponse.sid);

    return { success: true, message: 'SMS sent successfully' };
  } catch (error:any) {
    console.error('Error sending SMS:', error.message);
    return { success: false, message: 'SMS could not be sent' };
  }
};

export default sendSms