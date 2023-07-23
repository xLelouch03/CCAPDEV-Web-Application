import express from 'express';
import EstablishmentController from '../controllers/establishment.controller.js';

const router = express.Router();

// Create new establishment
router.post('/', EstablishmentController.createEstablishment);

// Get establishment details
router.get('/:id', EstablishmentController.getEstablishment);

// Update establishment details
router.put('/:id', EstablishmentController.updateEstablishment);

// Delete an establishment
router.delete('/:id', EstablishmentController.deleteEstablishment);

export default router;