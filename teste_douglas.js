import EncryptUtils from "./src/utils/EncryptUtils.js";
import axios from "axios";
import StaticUtils from "./src/utils/StaticUtils.js";
import KommoServices from "./src/services/kommo/KommoServices.js";
import styled from "./src/utils/log/styled.js";
import LeadUtils from "./src/utils/LeadUtils.js";
import DateUtils from "./src/utils/DateUtils.js";
import MarketingTrackingRepository from "./src/repositories/MarketingTrackingRepository.js";

const main = async () => {

  const number = 24410353;
  const string = number.toString();
  console.log(string)
  // const measurement_id = process.env.GA4_MEASUREMENT_ID;
  // const secret_api = process.env.GA4_API_SECRET;

  // const name = 'Douglas';
  // const { firstName, lastName } = StaticUtils.splitName(name);

  // const firstNameSHA256 = await EncryptUtils.populateSensitiveUserData(firstName);
  // const lastNameSHA256 = await EncryptUtils.populateSensitiveUserData(lastName);
  // const emailSHA256 = await EncryptUtils.populateSensitiveUserData('sunshinedn2003@gmail.com');
  // const phoneSHA256 = await EncryptUtils.populateSensitiveUserData('558196724310');
  // const dataNascimentoSHA256 = await EncryptUtils.populateSensitiveUserData('11/03/2003');
  // const neighborhood = 'Candeias';

  // const client_id = '813830295.1743001344';
  // const payload = {
  //   client_id,
  //   user_id: '24410353',
  //   events: [
  //     {
  //       name: 'lead_created',
  //     }
  //   ],
  //   user_properties: {
  //     gender: {
  //       value: "male"
  //     },
  //     first_name: {
  //       value: firstNameSHA256,
  //     },
  //     phone: {
  //       value: phoneSHA256,
  //     }
  //   }
  // }

  // console.log()

  // const ga4_url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${secret_api}`;

  // const options = {
  //   method: 'POST',
  //   url: ga4_url,
  //   data: JSON.stringify(payload)
  // }

  // try {
  //   const response = await axios(options);
  //   console.log('Response status:', response.status);
  //   console.log('Response data:', response.data);
  // } catch (error) {
  //   console.error('Error sending data to GA4:', error.message);
  // }

}

main();