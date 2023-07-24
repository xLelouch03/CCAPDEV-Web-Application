import express from 'express';
import EstablishmentController from '../controllers/establishment.controller.js';

const router = express.Router();

// Create new establishment
router.post('/create-establishment', EstablishmentController.createEstablishment);

// Update establishment details
router.put('/establishments/:establishment', EstablishmentController.updateEstablishment);

// Delete an establishment
router.delete('/establishments/:establishment', EstablishmentController.deleteEstablishment);

export default router;