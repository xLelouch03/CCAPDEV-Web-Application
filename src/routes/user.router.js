import express from 'express';
import UserController from '../controllers/user.controller.js';
import ReviewController from '../controllers/review.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'static/images' });

// Account-related
router.post('/register-user', UserController.createUser);
router.post('/login-user', UserController.loginUser);

// Get user details
// router.get('/:username', UserController.getUser);
router.get('/users', UserController.getAllUsernames);

// Delete a user
// router.delete('/:username', UserController.deleteUser);

router.get('/profile/user/:id', async (req, res) => {
    const { id } = req.params;
    const profileRaw = await UserController.getUserById(id);
    if (!profileRaw) {
        console.log('Profile not found');
        return res.status(404).send('Profile not found');
    }
    const profile = profileRaw.toObject();
    const reviews  = (await ReviewController.getReviewsOfUser(id)).map(doc => doc.toObject());

    let user, mainLayout, mainTemplate;
    if ((req.isAuthenticated()) && (req.user._id == id)) {
        user = req.user.toObject();
        mainLayout = 'profile';
        mainTemplate = 'profileOwned';
    } else if ((req.isAuthenticated()) && (req.user._id != id)) {
        user = req.user.toObject();
        mainLayout = 'profile';
        mainTemplate = 'profileLogged';
    } else {
        mainLayout = 'profile';
        mainTemplate = 'profile';
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

router.put('/profile/user/:id', UserController.updateUser);

export default router;