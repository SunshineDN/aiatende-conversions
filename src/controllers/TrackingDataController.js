import TrackingDataServices from "../services/tracking_data/TrackingDataServices.js";
import styled from "../utils/log/styled.js";
import StaticUtils from "../utils/StaticUtils.js";


export default class TrackingDataController {
  constructor() {
    this.tracking_data = new TrackingDataServices();
  }

  /**
    * @param { import('express').Request } req
    * @param { import('express').Response } res
    */
  async handleWebhookReceived(req, res) {
    try {
      const whatsAppNumber = process.env.WHATSAPP_NUMBER; // Número do WhatsApp no padrao 558112345678
      const { query } = req;
      styled.infodir(query);
      const hash = StaticUtils.generateSimpleHash();
      const text = await this.tracking_data.handleWebhookReceived(query, hash);
      if (text == null) {
        styled.warning("gclientid not found");
        res.redirect(`https://wa.me/${whatsAppNumber}?text=Olá, tudo bem?`);
      } else {
        styled.success('Webhook received and handled');
        res.redirect(`https://wa.me/${whatsAppNumber}?text=[ ${hash} ]\n${text}`);
      }
    } catch (error) {
      styled.error(`[WppController.handleWebhookReceived] Error: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error', error: error?.message });
    }
  }

  async handleMessageUpsert(req, res) {
    res.status(200).send('ok');
  }
}
