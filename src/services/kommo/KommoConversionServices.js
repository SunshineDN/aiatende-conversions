import styled from "../../utils/log/styled.js";
import StaticUtils from "../../utils/StaticUtils.js";
import LeadUtils from "../../utils/LeadUtils.js";
import KommoServices from "./KommoServices.js";
import DateUtils from "../../utils/DateUtils.js";
import EncryptUtils from "../../utils/EncryptUtils.js";

export default class KommoConversionServices {
  #kommo;
  #lead_id;

  constructor(lead_id, { auth, url }) {
    this.#lead_id = lead_id;
    this.#kommo = new KommoServices({ auth, url });
  }

  async getMinorLeadDetails() {
    const lead = await this.#kommo.getLead({ id: this.#lead_id, withParams: 'contacts' });
    if (!lead) {
      styled.error(`Kommo - Lead não encontrado: ${this.#lead_id}`);
      return null;
    }

    const contact = lead.contact;

    const { firstName, lastName } = StaticUtils.splitName(contact.name);
    const phone = LeadUtils.getPhoneNumber({ contact });
    const client_id = LeadUtils.findLeadField({ lead, fieldName: 'gclientid', value: true });

    const firstNameSHA256 = await EncryptUtils.populateSensitiveUserData(firstName);
    const phoneSHA256 = await EncryptUtils.populateSensitiveUserData(phone);
    const lastNameSHA256 = lastName ? await EncryptUtils.populateSensitiveUserData(lastName) : null;

    return {
      lead_id: this.#lead_id,
      client_id: client_id,
      first_name: firstNameSHA256,
      phone: phoneSHA256,
      ...(lastNameSHA256 && { last_name: lastNameSHA256 })
    }
  };

  async getFullLeadDetails() {
    const lead = await this.#kommo.getLead({ id: this.#lead_id, withParams: 'contacts' });
    if (!lead) {
      styled.error(`Kommo - Lead não encontrado: ${this.#lead_id}`);
      return null;
    }

    const contact = lead.contact;

    const { firstName, lastName } = StaticUtils.splitName(contact.name);
    const phone = LeadUtils.getPhoneNumber({ contact });
    const email = LeadUtils.getEmail({ contact });
    
    const dataNascimento = LeadUtils.findLeadField({ lead, fieldName: 'Data de Nascimento', value: true });
    const dataNascimentoFormatted = DateUtils.secondsToFormatDate(dataNascimento);
    const neighborhood = LeadUtils.findLeadField({ lead, fieldName: 'Bairro', value: true });
    const client_id = LeadUtils.findLeadField({ lead, fieldName: 'gclientid', value: true });

    const firstNameSHA256 = await EncryptUtils.populateSensitiveUserData(firstName);
    const lastNameSHA256 = await EncryptUtils.populateSensitiveUserData(lastName);
    const phoneSHA256 = await EncryptUtils.populateSensitiveUserData(phone);
    const emailSHA256 = await EncryptUtils.populateSensitiveUserData(email);
    const dataNascimentoSHA256 = await EncryptUtils.populateSensitiveUserData(dataNascimentoFormatted);

    return {
      lead_id: this.#lead_id,
      client_id: client_id,
      first_name: firstNameSHA256,
      last_name: lastNameSHA256,
      phone: phoneSHA256,
      email: emailSHA256,
      birth_date: dataNascimentoSHA256,
      neighborhood,
    }
  }
}