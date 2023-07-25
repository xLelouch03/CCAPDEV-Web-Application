import express from 'express';
import EstablishmentController from '../controllers/establishment.controller.js';
import ReviewController from '../controllers/review.controller.js';
import ReplyController from '../controllers/reply.controller.js';

const router = express.Router();

// Create new establishment
router.post('/create-establishment', EstablishmentController.createEstablishment);
router.post('/login-owner', EstablishmentController.loginEstablishment);

// Retrieve establishment details and reviews for indivpage
router.get('/establishment/:establishmentId', async (req, res) => {
    try {
        const establishmentId = req.params.establishmentId;
        const establishment = (await EstablishmentController.getEstablishment(establishmentId)).toObject();
        if (!establishment) {
            console.log("Establishment not found");
            return res.status(404).send({ message: "Establishment not found" });
        }
        console.log(establishment);
  
        // Assign replies
        await ReviewController.assignReplies();
  
        const reviews = (await ReviewController.getReviews(establishmentId)).map(doc => doc.toObject());
        if (!reviews) {
            console.log("No matching reviews for establishment found");
        }
        console.log(reviews);
  
        // Define Handlebars template and layout here
        const mainLayout = 'establishment';
        const mainTemplate = 'establishmentLogged';
  
        res.render(mainTemplate, {
            layout: mainLayout,
            establishment: establishment,
            reviews: reviews
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
  });

router.get('/profile/:establishmentId', async (req, res) => {
    const establishmentId = req.params.establishmentId;
    
    try {
        // Fetch user data from MongoDB collection using Mongoose
        const establishmentData = await User.findById(establishmentId);
    
        // Render the Handlebars template and pass the fetched data as context
        res.render('template', { establishmentData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Error fetching user data');
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