import express from 'express';
import EstablishmentController from '../controllers/establishment.controller.js';
import ReviewController from '../controllers/review.controller.js';
import ReplyController from '../controllers/reply.controller.js';

const router = express.Router();

// Create new establishment
router.post('/create-establishment', EstablishmentController.createEstablishment);

// Retrieve establishment details and reviews for indivpage
router.get('/establishment/:id', async (req, res) => {
    try {
        const establishmentId = req.params.id;
        const establishment = await EstablishmentController.getEstablishment(establishmentId);
        if (!establishment) {
            return res.status(404).send({ message: "Establishment not found" });
        }

        // Assign replies
        await ReviewController.assignReplies();

        const reviews = await ReviewController.getReviews(establishmentId);
        if (!reviews) {
            return res.status(404).send({ message: "No matching reviews found" });
        }

        // Define Handlebars template and layout here
        const mainLayout = 'main';
        const mainTemplate = 'establishment';

        res.render(mainTemplate, {
            layout: mainLayout,
            establishment: establishment,
            reviews: reviews
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Retrieve existing establishments for searchresults page
router.get('/searchresults', async (req, res) => {
    try {
        const establishments = await EstablishmentController.getEstablishments();

        // Define Handlebars template and layout here
        const mainLayout = 'searchresult';
        const mainTemplate = 'searchresults';

        res.render(mainTemplate, {
            layout: mainLayout,
            establishments: establishments
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Update establishment details
router.put('/establishments/:establishment', EstablishmentController.updateEstablishment);

// Delete an establishment
router.delete('/establishments/:establishment', EstablishmentController.deleteEstablishment);

// Create new review
router.post('/establishments/:establishment/review', ReviewController.createReview);

// Update review details
router.put('/establishments/:establishment/review', ReviewController.updateReview);

// Delete a review
router.delete('/establishments/:establishment/review', ReviewController.deleteReview);

// Create new reply
router.post('/establishments/:establishment/reply', ReplyController.createReply);

// Update reply details
router.put('/establishments/:establishment/reply', ReplyController.updateReply);

// Delete a reply
router.delete('/establishments/:establishment/reply', ReplyController.deleteReply);

export default router;