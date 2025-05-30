import EncryptUtils from "./src/utils/EncryptUtils.js";
import axios from "axios";

const main = async () => {
  const measurement_id = process.env.GA4_MEASUREMENT_ID;
  const secret_api = process.env.GA4_SECRET_API;
  
  const nameSHA256 = await EncryptUtils.populateSensitiveUserData('Douglas Augusto');
  const emailSHA256 = await EncryptUtils.populateSensitiveUserData('sunshinedn2003@gmail.com');
  const phoneSHA256 = await EncryptUtils.populateSensitiveUserData('558196724310');
  const dataNascimentoSHA256 = await EncryptUtils.populateSensitiveUserData('11/03/2003');
  const neighborhoodSHA256 = 'Candeias';

  const client_id = '';
  const payload = {
    client_id,
    events: [
      {
        name: 'test_event',
        params: {
          lead_id: '19030890',
          name: ''
        }
      }
    ]
  }

  const ga4_url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${secret_api}`;

  const options = {
    method: 'POST',
    url: ga4_url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {}
  }

}

main();