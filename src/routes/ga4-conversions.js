import express from "express";
import kommoMiddleware from "../middlewares/kommoMiddleware.js";
import GA4ConversionController from "../controllers/GA4ConversionController.js";

const router = express.Router();
const ga4ConversionController = new GA4ConversionController();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.post("/lead-created", (req, res) => ga4ConversionController.leadCreatedEvent(req, res));

router.post("/lead-qualified", (req, res) => ga4ConversionController.leadQualifiedEvent(req, res));

router.post("/schedule-search", (req, res) => ga4ConversionController.scheduleSearchEvent(req, res));

router.post("/lead-registered", (req, res) => ga4ConversionController.leadRegisteredEvent(req, res));

router.post("/appointment-scheduled", (req, res) => ga4ConversionController.appointmentScheduledEvent(req, res));

router.post("/client-served", (req, res) => ga4ConversionController.clientServedEvent(req, res));

export default router;