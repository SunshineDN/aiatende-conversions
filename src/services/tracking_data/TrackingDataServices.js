import MarketingTrackingRepository from "../../repositories/MarketingTrackingRepository.js";
import KommoWebhookUtils from "../../utils/KommoWebhookUtils.js";
import styled from "../../utils/log/styled.js";
import KommoServices from "../kommo/KommoServices.js";

export default class TrackingDataServices {
  #marketing_tracking;
  #kommo;

  constructor() {
    this.#marketing_tracking = new MarketingTrackingRepository();
    this.#kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  }

  async handleWebhookReceived(query, hash) {
    const { gclientid, hash: utmHash, text, ...utms } = this.handleUTMSeparator(query, hash);

    if (!gclientid) {
      styled.error("gclientid not found");
      return;
    }

    await this.#marketing_tracking.findOrCreateTracking(gclientid, hash, utms);
    styled.success('UTM separated and saved in the database');

    const custom_fields_values = await this.handleCustomFields({ utms: { gclientid, hash, ...utms } });
    styled.success('Custom fields values created');

    const kommoWebhookUtils = new KommoWebhookUtils({ pipelines: await this.#kommo.getPipelines() });

    const pipeline = kommoWebhookUtils.findPipelineByName('Recepção Virtual');
    const status = kommoWebhookUtils.findStatusByName('Clique no Site');
    if (!pipeline || !status) {
      styled.error("Pipeline or status not found");
      return;
    }

    styled.success("Lead created successfully");
    await this.#kommo.createLead({
      pipeline_id: pipeline.id,
      status_id: status.id,
      custom_fields_values
    });

    return text;
  }

  handleUTMSeparator(obj, hash) {
    const utms = {
      utm_content: obj.utm_content,
      utm_medium: obj.utm_medium,
      utm_campaign: obj.utm_campaign,
      utm_source: obj.utm_source,
      utm_term: obj.utm_term,
      utm_referrer: obj.utm_referrer,
      referrer: obj.referrer,
      gclientid: obj.gclientid,
      gclid: obj.gclid,
      fbclid: obj.fbclid,
      ga_utm: obj.ga_utm,
      fbp: obj.fbp,
      fbc: obj.fbc,
      text: obj.text || "",
      hash: hash,
    }
    return utms
  }

  async handleCustomFields({ utms }) {
    const kommoWebhookUtils = new KommoWebhookUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields() });

    const track_message_field = kommoWebhookUtils.findLeadsFieldByName('track message');
    const utm_campaign_field = kommoWebhookUtils.findLeadsFieldByName('utm_campaign');
    const utm_adgroup_field = kommoWebhookUtils.findLeadsFieldByName('utm_adgroup');
    const utm_content_field = kommoWebhookUtils.findLeadsFieldByName('utm_content');
    const utm_term_field = kommoWebhookUtils.findLeadsFieldByName('utm_term');
    const utm_medium_field = kommoWebhookUtils.findLeadsFieldByName('utm_medium');
    const utm_source_field = kommoWebhookUtils.findLeadsFieldByName('utm_source');
    const utm_device_field = kommoWebhookUtils.findLeadsFieldByName('utm_device');
    const utm_network_field = kommoWebhookUtils.findLeadsFieldByName('utm_network');
    const utm_position_field = kommoWebhookUtils.findLeadsFieldByName('utm_position');
    const utm_placement_field = kommoWebhookUtils.findLeadsFieldByName('utm_placement');
    const utm_referrer_field = kommoWebhookUtils.findLeadsFieldByName('utm_referrer');
    const referrer_field = kommoWebhookUtils.findLeadsFieldByName('referrer');
    const gclientid_field = kommoWebhookUtils.findLeadsFieldByName('gclientid');
    const gclid_field = kommoWebhookUtils.findLeadsFieldByName('gclid');
    const fbclid_field = kommoWebhookUtils.findLeadsFieldByName('fbclid');
    const ga_utm_field = kommoWebhookUtils.findLeadsFieldByName('ga_utm');
    const fbc_field = kommoWebhookUtils.findLeadsFieldByName('_fbc');
    const fbp_field = kommoWebhookUtils.findLeadsFieldByName('_fbp');

    const custom_fields_values = []

    if (utms.hash && track_message_field) {
      custom_fields_values.push({
        field_id: track_message_field.id,
        values: [
          {
            value: utms.hash
          }
        ]
      });
    }

    if (utms.utm_campaign && utm_campaign_field) {
      custom_fields_values.push({
        field_id: utm_campaign_field.id,
        values: [
          {
            value: utms.utm_campaign
          }
        ]
      });
    }

    if (utms.utm_adgroup && utm_adgroup_field) {
      custom_fields_values.push({
        field_id: utm_adgroup_field.id,
        values: [
          {
            value: utms.utm_adgroup
          }
        ]
      });
    }

    if (utms.utm_content && utm_content_field) {
      custom_fields_values.push({
        field_id: utm_content_field.id,
        values: [
          {
            value: utms.utm_content
          }
        ]
      });
    }

    if (utms.utm_term && utm_term_field) {
      custom_fields_values.push({
        field_id: utm_term_field.id,
        values: [
          {
            value: utms.utm_term
          }
        ]
      });
    }

    if (utms.utm_medium && utm_medium_field) {
      custom_fields_values.push({
        field_id: utm_medium_field.id,
        values: [
          {
            value: utms.utm_medium
          }
        ]
      });
    }

    if (utms.utm_source && utm_source_field) {
      custom_fields_values.push({
        field_id: utm_source_field.id,
        values: [
          {
            value: utms.utm_source
          }
        ]
      });
    }

    if (utms.utm_device && utm_device_field) {
      custom_fields_values.push({
        field_id: utm_device_field.id,
        values: [
          {
            value: utms.utm_device
          }
        ]
      });
    }

    if (utms.utm_network && utm_network_field) {
      custom_fields_values.push({
        field_id: utm_network_field.id,
        values: [
          {
            value: utms.utm_network
          }
        ]
      });
    }

    if (utms.utm_position && utm_position_field) {
      custom_fields_values.push({
        field_id: utm_position_field.id,
        values: [
          {
            value: utms.utm_position
          }
        ]
      });
    }

    if (utms.utm_placement && utm_placement_field) {
      custom_fields_values.push({
        field_id: utm_placement_field.id,
        values: [
          {
            value: utms.utm_placement
          }
        ]
      });
    }

    if (utms.utm_referrer && utm_referrer_field) {
      custom_fields_values.push({
        field_id: utm_referrer_field.id,
        values: [
          {
            value: utms.utm_referrer
          }
        ]
      });
    }

    if (utms.referrer && referrer_field) {
      custom_fields_values.push({
        field_id: referrer_field.id,
        values: [
          {
            value: utms.referrer
          }
        ]
      });
    }

    if (utms.gclientid && gclientid_field) {
      custom_fields_values.push({
        field_id: gclientid_field.id,
        values: [
          {
            value: utms.gclientid
          }
        ]
      });
    }

    if (utms.gclid && gclid_field) {
      custom_fields_values.push({
        field_id: gclid_field.id,
        values: [
          {
            value: utms.gclid
          }
        ]
      });
    }

    if (utms.fbclid && fbclid_field) {
      custom_fields_values.push({
        field_id: fbclid_field.id,
        values: [
          {
            value: utms.fbclid
          }
        ]
      });
    }

    if (utms.ga_utm && ga_utm_field) {
      custom_fields_values.push({
        field_id: ga_utm_field.id,
        values: [
          {
            value: utms.ga_utm
          }
        ]
      });
    }

    if (utms.fbc && fbc_field) {
      custom_fields_values.push({
        field_id: fbc_field.id,
        values: [
          {
            value: utms.fbc
          }
        ]
      });
    }

    if (utms.fbp && fbp_field) {
      custom_fields_values.push({
        field_id: fbp_field.id,
        values: [
          {
            value: utms.fbp
          }
        ]
      });
    }

    if (utms.new_param && new_param_field) {
      custom_fields_values.push({
        field_id: new_param_field.id,
        values: [
          {
            value: utms.new_param
          }
        ]
      });
    }

    return custom_fields_values
  }
}
