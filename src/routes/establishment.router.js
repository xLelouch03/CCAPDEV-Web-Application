import express from 'express';
import EstablishmentController from '../controllers/establishment.controller.js';
import ReviewController from '../controllers/review.controller.js';
import ReplyController from '../controllers/reply.controller.js';

const router = express.Router();

// Account-related
router.post('/register-establishment', EstablishmentController.createEstablishment);
router.post('/login-establishment', EstablishmentController.loginEstablishment);

// Get establishment profile
router.get('/profile/establishment/:id', async (req, res) => {
    const { id } = req.params;
    const profileRaw = await EstablishmentController.getEstablishmentById(id);
    if (!profileRaw) {
        console.log('Profile not found');
        return res.status(404).send('Profile not found');
    }
    const profile = profileRaw.toObject();

    await ReviewController.assignReplies();
    const reviews = (await ReviewController.getReviews(id)).map(doc => doc.toObject());
    if (!reviews) {
        console.log("No matching reviews for establishment found");
    }

    let user, mainLayout, mainTemplate;
    if ((req.isAuthenticated()) && (req.user._id == id)) {
        user = req.user.toObject();
        mainLayout = 'profile';
        mainTemplate = 'estprofileOwned';
    } else if ((req.isAuthenticated()) && (req.user._id != id)) {
        user = req.user.toObject();
        mainLayout = 'profile';
        mainTemplate = 'estprofileLogged';
    } else {
        mainLayout = 'profile';
        mainTemplate = 'estprofile';
    }

    // Render the 'profilesLogged' view with the userData and reviews
    res.render(mainTemplate, { 
        layout: mainLayout,
        title: `${profile.username}'s Profile`,
        profile: profile,
        user: user,
        reviews: reviews
    });
});

// Update establishment profile
router.put('/profile/establishment/:id', EstablishmentController.updateEstablishment);

// Retrieve establishment details and reviews for indivpage
router.get('/establishment/:establishmentId', async (req, res) => {
    try {
        const establishmentId = req.params.establishmentId;
        const sortBy = req.query.sortBy;
        const establishment = (await EstablishmentController.getEstablishment(establishmentId)).toObject();
        if (!establishment) {
            console.log("Establishment not found");
            return res.status(404).send({ message: "Establishment not found" });
        }
  
        await ReviewController.assignReplies();
        const reviews = (await ReviewController.getReviews(establishmentId, sortBy)).map(doc => doc.toObject());
        if (!reviews) {
            console.log("No matching reviews for establishment found");
        }
  
        // Define Handlebars template and layout here
        let user, mainLayout, mainTemplate, userReview;
        if (req.isAuthenticated() && (req.user._id == establishmentId)) {
            user = req.user.toObject();
            mainLayout = 'establishment';
            mainTemplate = 'establishmentOwned';
        } else if (req.isAuthenticated() && (req.user._id != establishmentId)) {
            user = req.user.toObject();
            mainLayout = 'establishment';
            mainTemplate = 'establishmentLogged';
            userReview = await ReviewController.findReview(user._id, establishmentId);
        } else {
            mainLayout = 'establishment';
            mainTemplate = 'establishment';
        }
  
        res.render(mainTemplate, {
            layout: mainLayout,
            establishment: establishment,
            reviews: reviews,
            user: user,
            userReview: userReview
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
});

// Create new review
router.post('/establishment/:establishment/review', async (req, res) => {
    const user = req.user._id;
    const { establishment } = req.params;
    const { rating, title, body } = req.body;
    try {
        const existingReview = await ReviewController.findReview(user, establishment);
        if (existingReview) {
            console.log("User already has a review for establishment");
            return res.status(409).send({ message: "You already have an existing review for this establishment." });
        }
        const result = await ReviewController.createReview(user, establishment, rating, title, body);
        res.json(result);
    } catch(err) {
        res.status(500).send({ message: err.message });
    }
});

// Update review details
router.put('/establishment/:establishment/review', async (req, res) => {
    const user = req.user._id;
    const { establishment } = req.params;
    const { title, body } = req.body;
    try {
        const existingReview = await ReviewController.findReview(user, establishment);
        if (!existingReview) {
            console.log("User does not have a review for establishment");
            return res.status(404).send({ message: "You do not have an existing review for this establishment." });
        }
        const result = await ReviewController.updateReview(user, establishment, title, body);
        if(result.modifiedCount > 0) {
            res.status(200).json({ message: "Review update successful", result });
        } else {
            console.log("Review update failed");
            res.status(400).json({ message: "Review update failed", result });
        }
    } catch(err) {
        res.status(500).send({ message: err.message });
    }
});

// Delete a review
router.delete('/establishment/:establishment/review', async (req, res) => {
    const user = req.user._id;
    const { establishment } = req.params;
    
    try {
        const existingReview = await ReviewController.findReview(user, establishment);
        if (!existingReview) {
            console.log("User does not have a review for establishment");
            return res.status(404).send({ message: "You do not have an existing review for this establishment." });
        }
        
        const result = await ReviewController.deleteReview(user, establishment);
        if(result.deletedCount > 0) {
            res.status(200).json({ message: "Review deletion successful", result });
        } else {
            console.log("Review deletion failed");
            res.status(400).json({ message: "Review deletion failed", result });
        }
    } catch(err) {
        res.status(500).send({ message: err.message });
    }
});

router.post('/review/:reviewId/like', async (req, res) => {
    try {
        const likes = await ReviewController.incrementLike(req.params.reviewId);
        res.send({ likes: likes.likes, dislikes: likes.dislikes });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.post('/review/:reviewId/dislike', async (req, res) => {
    try {
        const dislikes = await ReviewController.incrementDislike(req.params.reviewId);
        res.send({ likes: dislikes.likes, dislikes: dislikes.dislikes });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Create new reply
router.post('/establishment/:establishmentId/reply', async (req, res) => {
    const user = req.user._id;
    const { establishmentId } = req.params;
    const { reviewId, body } = req.body;
    if (user == establishmentId) {
        try {
            const existingReply = await ReplyController.getReply(reviewId);
            if (existingReply) {
                console.log("This review already has a reply");
                return res.status(409).send({ message: "You can only reply once for each review." });
            }
            const result = await ReplyController.createReply(reviewId, establishmentId, body);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err.message });
        }
    } else {
        res.status(403).send({ message: "You are not allowed to reply to reviews on another establishment page." });
    }
});

// Update reply details
router.put('/establishment/:establishmentId/reply', async (req, res) => {
    const user = req.user._id;
    const { establishmentId } = req.params;
    const { replyId, body } = req.body;
    if (user == establishmentId) {
        try {
            const reply = await ReplyController.getReplyById(replyId);
            if (!reply) {
                console.log("Cannot find the reply to be edited");
                return res.status(404).send({ message: "Existing reply to be edited cannot be found." });
            }
            const result = await ReplyController.updateReply(replyId, body);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err.message });
        }
    } else {
        res.status(403).send({ message: "You are not allowed to reply to reviews on another establishment page." });
    }
});

// Delete a reply
router.delete('/establishment/:establishmentId/reply', async (req, res) => {
    const user = req.user._id;
    const { establishmentId } = req.params;
    const { replyId } = req.body;
    if (user == establishmentId) {
        try {
            const reply = await ReplyController.getReplyById(replyId);
            if (!reply) {
                console.log("Cannot find the reply to be deleted");
                return res.status(404).send({ message: "Existing reply to be deleted cannot be found." });
            }
            const result = await ReplyController.deleteReply(replyId);
            if (result) {
                res.status(200).json({ message: "Reply deletion successful", result });
            } else {
                console.log("Reply deletion failed");
                res.status(400).json({ message: "Reply deletion failed", result });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err.message });
        }
    } else {
        res.status(403).send({ message: "You are not allowed to delete replies to reviews on another establishment page." });
    }
});

export default router;