import styled from "../utils/log/styled.js";

export default class WebhookMiddleware {
  static messageReceived(req, _, next) {
    /* {
      "account": {
        "subdomain": "adrianocamposadvogado",
        "id": "33981183",
        "_links": {
          "self": "https://adrianocamposadvogado.amocrm.com"
        }
      },
      "message": {
        "add": [
          {
            "id": "c0925911-ce8f-4994-b117-542b5f28d036",
            "chat_id": "7df3cc9c-26c0-4b30-b8c9-b9ac728b407a",
            "talk_id": "109",
            "contact_id": "1298200",
            "text": "Oi",
            "created_at": "1736447224",
            "element_type": "2",
            "entity_type": "lead",
            "element_id": "878244",
            "entity_id": "878244",
            "type": "incoming",
            "author": {
              "id": "d408292e-3376-4108-82e3-45cb200f62c3",
              "type": "external",
              "name": "Douglas Augusto"
            },
            "origin": "com.amocrm.amocrmwa"
          }
        ]
      }
    } */

    /* {
      "account": {
        "subdomain": "adrianocamposadvogado",
        "id": "33981183",
        "_links": {
          "self": "https://adrianocamposadvogado.amocrm.com"
        }
      },
      "message": {
        "add": [
          {
            "id": "55dd912f-6a6e-4049-851f-5720949521ec",
            "chat_id": "7df3cc9c-26c0-4b30-b8c9-b9ac728b407a",
            "talk_id": "109",
            "contact_id": "1298200",
            "text": "",
            "created_at": "1736447462",
            "attachment": {
              "type": "voice",
              "link": "https://drive-c.kommo.com/download/b9d0ffdd-8556-5b96-8bd1-561f35c1c845/36a184b0-7976-419e-a6fe-ce7b975d4baa/171f8fac-bd9b-4ec2-a2d7-3d9b992acb6d/data.m4a",
              "file_name": "data.m4a"
            },
            "element_type": "2",
            "entity_type": "lead",
            "element_id": "878244",
            "entity_id": "878244",
            "type": "incoming",
            "author": {
              "id": "d408292e-3376-4108-82e3-45cb200f62c3",
              "type": "external",
              "name": "Douglas Augusto"
            },
            "origin": "com.amocrm.amocrmwa"
          }
        ]
      }
    } */
   
    const { message, account } = req?.body;
    const account_id = account?.id;
    const account_subdomain = account?.subdomain;
    const account_domain = `https://${account_subdomain}.kommo.com`;
    const { add: [{ id: message_id, chat_id, talk_id, contact_id, text, created_at, attachment, entity_type, element_id: lead_id, entity_id, author, origin }] } = message;

    req.body = {
      lead_id,
      account: {
        id: account_id,
        subdomain: account_subdomain,
        account_domain,
      },
      message: {
        author,
        chat_id,
        created_at,
        entity_id,
        entity_type,
        contact_id,
        message_id,
        origin,
        talk_id,
        text,
        attachment,
      }
    };

    styled.middleware('\n [ Kommo - Message Received ] Request Method:', req.method);
    styled.middleware('[ Kommo - Message Received ] Request route:', req.originalUrl);
    styled.middleware('[ Kommo - Message Received ] Request Body:');
    styled.middlewaredir(req.body);
    styled.middleware('[ Kommo - Message Received ] ID do lead:', lead_id);
    next();
  }
}