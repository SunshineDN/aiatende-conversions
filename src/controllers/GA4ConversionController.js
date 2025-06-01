import styled from "../utils/log/styled.js";
import KommoConversionServices from "../services/kommo/KommoConversionServices.js";
import GA4Services from "../services/google/GA4Services.js";

export default class GA4ConversionController {

  constructor() {
  }
  
  async #minorLeadEvent({ events = [], lead_id }) {
    const kommoConversion = new KommoConversionServices(lead_id, {
      auth: process.env.KOMMO_AUTH,
      url: process.env.KOMMO_URL,
    });
    const leadDetails = await kommoConversion.getMinorLeadDetails();
    if (!leadDetails) {
      styled.error(`[ConversionController.minorLeadEvent] Lead not found: ${lead_id}`);
      return null;
    }

    const { client_id, first_name, last_name, phone } = leadDetails;
    const ga4Services = new GA4Services({
      measurement_id: process.env.GA4_MEASUREMENT_ID,
      api_secret: process.env.GA4_API_SECRET,
    });

    return await ga4Services.sendMinorCustomLeadEvent({
      client_id,
      events,
      lead_id,
      first_name,
      last_name,
      phone,
    });
  };

  async #fullLeadEvent({ events = [], lead_id }) {
    const kommoConversion = new KommoConversionServices(lead_id, {
      auth: process.env.KOMMO_AUTH,
      url: process.env.KOMMO_URL,
    });
    const leadDetails = await kommoConversion.getFullLeadDetails();
    if (!leadDetails) {
      styled.error(`[ConversionController.fullLeadEvent] Lead not found: ${lead_id}`);
      return null;
    }

    const { client_id, first_name, last_name, phone, email, birth_date, neighborhood } = leadDetails;
    const ga4Services = new GA4Services({
      measurement_id: process.env.GA4_MEASUREMENT_ID,
      api_secret: process.env.GA4_API_SECRET,
    });

    return await ga4Services.sendFullCustomLeadEvent({
      client_id,
      events,
      lead_id,
      first_name,
      last_name,
      phone,
      email,
      birth_date,
      neighborhood,
    });
  }

  async leadCreatedEvent(req, res) {
    try {
      const { lead_id } = req.body;
      if (!lead_id) {
        styled.error(`[ConversionController.leadCreatedEvent] Missing lead_id in request body`);
        return res.status(400).json({ error: 'Missing lead_id' });
      }

      const response = this.#minorLeadEvent({
        events: ['lead_created'],
        lead_id,
      });

      res.status(200).json({
        message: 'Lead created event generated successfully',
        response,
      });
    } catch (error) {
      styled.error(`[ConversionController.leadCreatedEvent] Error: ${error.message}`);
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate lead event' });
    }
  }

  async leadQualifiedEvent(req, res) {
    try {
      const { lead_id } = req.body;
      if (!lead_id) {
        styled.error(`[ConversionController.leadQualifiedEvent] Missing lead_id in request body`);
        return res.status(400).json({ error: 'Missing lead_id' });
      }

      const response = this.#minorLeadEvent({
        events: ['lead_qualified'],
        lead_id,
      });

      res.status(200).json({
        message: 'Lead qualified event generated successfully',
        response,
      });
    } catch (error) {
      styled.error(`[ConversionController.leadQualifiedEvent] Error: ${error.message}`);
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate lead event' });
    }
  }

  async scheduleSearchEvent(req, res) {
    try {
      const { lead_id } = req.body;
      if (!lead_id) {
        styled.error(`[ConversionController.leadScheduleSearchEvent] Missing lead_id in request body`);
        return res.status(400).json({ error: 'Missing lead_id' });
      }

      const response = this.#minorLeadEvent({
        events: ['schedule_search'],
        lead_id,
      });

      res.status(200).json({
        message: 'Lead schedule search event generated successfully',
        response,
      });
    } catch (error) {
      styled.error(`[ConversionController.leadScheduleSearchEvent] Error: ${error.message}`);
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate lead event' });
    }
  }

  async leadRegisteredEvent(req, res) {
    try {
      const { lead_id } = req.body;
      if (!lead_id) {
        styled.error(`[ConversionController.leadRegisteredEvent] Missing lead_id in request body`);
        return res.status(400).json({ error: 'Missing lead_id' });
      }

      const response = this.#fullLeadEvent({
        events: ['lead_registered'],
        lead_id,
      });

      res.status(200).json({
        message: 'Lead registered event generated successfully',
        response,
      });
    } catch (error) {
      styled.error(`[ConversionController.leadRegisteredEvent] Error: ${error.message}`);
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate lead event' });
    }
  }

  async appointmentScheduledEvent(req, res) {
    try {
      const { lead_id } = req.body;
      if (!lead_id) {
        styled.error(`[ConversionController.leadAppointmentScheduledEvent] Missing lead_id in request body`);
        return res.status(400).json({ error: 'Missing lead_id' });
      }

      const response = this.#fullLeadEvent({
        events: ['appointment_scheduled'],
        lead_id,
      });

      res.status(200).json({
        message: 'Lead appointment scheduled event generated successfully',
        response,
      });
    } catch (error) {
      styled.error(`[ConversionController.leadAppointmentScheduledEvent] Error: ${error.message}`);
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate lead event' });
    }
  }

  async clientServedEvent(req, res) {
    try {
      const { lead_id } = req.body;
      if (!lead_id) {
        styled.error(`[ConversionController.leadClientServedEvent] Missing lead_id in request body`);
        return res.status(400).json({ error: 'Missing lead_id' });
      }

      const response = this.#fullLeadEvent({
        events: ['client_served'],
        lead_id,
      });

      res.status(200).json({
        message: 'Lead client served event generated successfully',
        response,
      });
    } catch (error) {
      styled.error(`[ConversionController.leadClientServedEvent] Error: ${error.message}`);
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate lead event' });
    }
  }
}