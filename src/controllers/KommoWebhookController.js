import KommoWebhookServices from "../services/kommo/KommoWebhookServices.js";
import styled from "../utils/log/styled.js";

export default class KommoWebhookController {
  constructor() {
    this.kommo = new KommoWebhookServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.messageReceived = this.messageReceived.bind(this);
  }

  async messageReceived(req, res) {
    try {
      const { body } = req;
      const response = await this.kommo.messageReceived(body);
      res.status(200).json(response);
    } catch (error) {
      styled.error('[KommoWebhookController.messageReceived] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }
}
