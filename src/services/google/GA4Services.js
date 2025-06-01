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
      ...(lead_id && { user_id: lead_id }),
      events: events.map(event => ({ name: event })),
      user_properties: Object.fromEntries(
        Object.entries(user_properties).map(([key, value]) => ([key, { value }]))
      )
    };

    const options = {
      method: 'POST',
      url: this.#url,
      data: JSON.stringify(payload),
    };

    const response = await axios(options)
    return response;
  }

  async sendMinorCustomLeadEvent({ client_id, events = [], lead_id = '', first_name, last_name = '', phone } = {}) {
    const user_properties = {
      first_name: { value: first_name },
      ...(last_name && { last_name: { value: last_name } }),
      phone_number: { value: phone },
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
      first_name: { value: first_name },
      last_name: { value: last_name },
      phone_number: { value: phone },
      email: { value: email },
      birth_date: { value: birth_date },
      neighborhood: { value: neighborhood },
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