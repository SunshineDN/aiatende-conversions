import styled from "../../utils/log/styled.js";
import KommoServices from "./KommoServices.js";
import KommoWebhookUtils from "../../utils/KommoWebhookUtils.js";
import MarketingTrackingRepository from "../../repositories/MarketingTrackingRepository.js";
import TrackingDataServices from "../tracking_data/TrackingDataServices.js";

export default class KommoWebhookServices extends KommoServices {
  constructor({ auth, url }) {
    super({ auth, url });
  }

  async messageReceived(obj) {
    styled.function('[KommoWebhookServices.messageReceived]');
    const { lead_id } = obj;
    const { text = '' } = obj.message;

    const haveHash = KommoWebhookUtils.handleEncounterHash(text);

    if (haveHash) {
      styled.info('[KommoWebhookServices.messageReceived] - Mensagem contém hash, buscando no banco de dados...');

      const marketingTrackingRepository = new MarketingTrackingRepository();
      const utms = await marketingTrackingRepository.findOne({ where: { hash: haveHash } });

      if (utms) {
        styled.success('[KommoWebhookServices.messageReceived] - Hash encontrada, processando...');

        const tracking_data = new TrackingDataServices();
        const custom_fields = await tracking_data.handleCustomFields({ utms });
        await this.updateLead({ id: lead_id, custom_fields_values: custom_fields });
        styled.success('[KommoWebhookServices.messageReceived] - Campos personalizados atualizados com sucesso.');
      } else {
        styled.warning('[KommoWebhookServices.messageReceived] - Nenhuma hash identificada corretamente na mensagem.');
      }
    }
    return { code: 200, response: res };
  }
}
