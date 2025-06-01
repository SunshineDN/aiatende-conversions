import styled from "../../utils/log/styled.js";
import axios from "axios";

export default class GA4Services {
  #measurement_id;
  #api_secret;
  #url;

  constructor({ measurement_id, api_secret }) {
    this.#measurement_id = measurement_id;
    this.#api_secret = api_secret;
    this.#url = `https://www.google-analytics.com/mp/collect?measurement_id=${this.#measurement_id}&api_secret=${this.#api_secret}`;
  }

  async sendEvent({ client_id, lead_id = '', events = [], user_properties = {} } = {}) {
    const payload = {
      client_id,
      ...(lead_id && { user_id: lead_id.toString() }),
      events: events.map(event => ({ name: event })),
      user_properties: Object.fromEntries(
        Object.entries(user_properties).map(([key, value]) => ([key, { value }]))
      )
    };

    styled.info(`[GA4Services.sendEvent] Sending events: ${JSON.stringify(payload)}`);

    const options = {
      method: 'POST',
      url: this.#url,
      data: JSON.stringify(payload),
    };

    const response = await axios(options);
    styled.success(`[GA4Services.sendEvent] Response status: ${response.status}`);
    return response;
  }

  async sendMinorCustomLeadEvent({ client_id, events = [], lead_id = '', first_name, last_name = '', phone } = {}) {
    const user_properties = {
      first_name,
      ...(last_name && { last_name }),
      phone_number: phone,
    };

    const response = await this.sendEvent({
      client_id,
      lead_id,
      events,
      user_properties,
    });
    styled.success(`[GA4Services.sendMinorCustomLeadEvent] Events [${events}] sent successfully: ${JSON.stringify(user_properties)}`);
    return response;
  }

  async sendFullCustomLeadEvent({ client_id, events = [], lead_id = '', first_name, last_name, phone, email, birth_date, neighborhood } = {}) {
    const user_properties = {
      first_name,
      last_name,
      phone_number: phone,
      email,
      birth_date,
      neighborhood,
    };

    const response = await this.sendEvent({
      client_id,
      lead_id,
      events,
      user_properties,
    });
    styled.success(`[GA4Services.sendCustomLeadEvent] Events [${events}] sent successfully: ${JSON.stringify(user_properties)}`);
    return response;
  }
}