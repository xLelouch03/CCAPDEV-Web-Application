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
        const mainTemplate = 'establishments';
  
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

  router.get('/establishmentLogged/:establishmentId', async (req, res) => {
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
router.put('/establishmentLogged/:establishment', EstablishmentController.updateEstablishment);

// Delete an establishment
router.delete('/establishmentLogged/:establishment', EstablishmentController.deleteEstablishment);

// Create new review
router.post('/establishmentLogged/:establishment/review', async (req, res) => {
    const { establishment } = req.params;
    const { rating, title, body } = req.body;

    try {
        const status = await ReviewController.createReview(establishment, rating, title, body);
        if(status != 1) console.log("Review creation failed!");
    } catch(err) {
        res.status(500).send({ message: err.message });
    }
});

// Update review details
router.put('/establishmentLogged/:establishment/review', async (req, res) => {
    const { establishment } = req.params;
    const { title, body, lastEdited } = req.body;

    console.log(establishment);
    console.log(title);
    console.log(body);
    console.log(lastEdited);

    try {
        const status = await ReviewController.updateReview(establishment, title, body, lastEdited);
        if(status != 1) console.log("Review update failed!");
    } catch(err) {
        res.status(500).send({ message: err.message });
    }
});

// Delete a review
router.delete('/establishmentLogged/:establishment/review', ReviewController.deleteReview);

// Create new reply
router.post('/establishment/:establishment/reply', ReplyController.createReply);

// Update reply details
router.put('/establishment/:establishment/reply', ReplyController.updateReply);

// Delete a reply
router.delete('/establishment/:establishment/reply', ReplyController.deleteReply);

export default router;