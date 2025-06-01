import express from "express";
import GA4ConversionController from "../controllers/GA4ConversionController.js";

const router = express.Router();
const ga4ConversionController = new GA4ConversionController();

router.post("/lead-created", ga4ConversionController.leadCreatedEvent(req, res));

router.post("/lead-qualified", ga4ConversionController.leadQualifiedEvent(req, res));

router.post("/schedule-search", ga4ConversionController.scheduleSearchEvent(req, res));

router.post("/lead-registered", ga4ConversionController.leadRegisteredEvent(req, res));

router.post("/appointment-scheduled", ga4ConversionController.appointmentScheduledEvent(req, res));

router.post("/client-served", ga4ConversionController.clientServedEvent(req, res));

export default router;