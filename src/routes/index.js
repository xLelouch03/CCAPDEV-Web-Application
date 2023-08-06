import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import ReviewController from '../controllers/review.controller.js';
import EstablishmentController from '../controllers/establishment.controller.js';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import Establishment from '../models/establishment.model.js';

const router = Router();

router.put('/api/update-establishment/:establishmentId', EstablishmentController.updateEstablishment);
router.put('/api/update-user/:username', UserController.updateUser);

router.get('/api/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch the user from the 'users' collection based on the provided user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user); // Respond with the user data as JSON
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/establishments', async (req, res) => {
  try {
    // Fetch all establishments from the 'establishments' collection
    const establishments = await Establishment.find({}, 'name'); // Return only the 'username' field
    res.json({ establishments: establishments }); // Respond with the users data as JSON
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch establishment data by ID
router.get('/api/establishments/:establishmentId', async (req, res) => {
  try {
    const establishmentId = req.params.establishmentId;
    // Fetch the establishment from the 'establishments' collection based on the provided user ID
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ error: 'Establishment not found' });
    }
    res.json(establishment);
  } catch (error) {
    console.error('Error fetching establishment data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch establishment data by ID
router.get('/api/reviews/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Received request for reviews with user ID:', userId);

    // Fetch the reviews associated with the provided user ID
    const reviews = await Review.find({ user: userId });
    console.log('Fetched reviews:', reviews);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
    const establishments = (await EstablishmentController.getEstablishments()).map(doc => doc.toObject());
    
    let user, mainLayout, mainTemplate;
    if (req.isAuthenticated()) {
      user = req.user.toObject();
      mainLayout = 'main';
      mainTemplate = 'indexLogged';
    } else {
      mainLayout = 'main';
      mainTemplate = 'index';
    }

    res.render(mainTemplate, {
      layout: mainLayout,
      title: "Juanderlust Landing Page",
      user: user,
      establishments: establishments
    });
});

router.get('/searchresult', async (req, res) => {
  const category = req.query.category;
  const query = req.query.q;

  let sortBy;
  if(req.query.sortby && req.query.sortby === 'rating') {
    sortBy = { 'rating': -1 };
  } else {
    sortBy = { 'name': 1 };
  }

  let user, results, mainLayout, mainTemplate;
  try {
    switch (category) {
      case 'destination':
        if(req.isAuthenticated()) {
          user = req.user.toObject();
          mainLayout = 'searchresult';
          mainTemplate = 'searchresultsLogged';
        } else {
          mainLayout = 'searchresult';
          mainTemplate = 'searchresults';
        }

        if (query) { // if a search term exists
          results = await Establishment.find({
            $text: {
              $search: query
            }
          }).sort(sortBy);
        } else { // if no search term, return all
          results = await Establishment.find().sort(sortBy);
        }

        res.render(mainTemplate, {
          layout: mainLayout,
          searchTerm: query,
          resultCount: results.length,
          establishments: results.map(doc => doc.toObject()),
          currentCategory: category, // the category from your server-side code
          currentQuery: query, // the query from your server-side code
          user: user
        });
        break;

      default:
        return res.status(400).send('Invalid category');
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/searchresultreview', async (req, res) => {
  const category = req.query.category;
  const query = req.query.q;

  let sortBy;
  if(req.query.sortby && req.query.sortby === 'rating') {
    sortBy = { 'rating': -1 };
  } else {
    sortBy = { 'name': 1 };
  }

  let user, results, mainLayout, mainTemplate;
  try {
    switch (category) {
      case 'review':
        if(req.isAuthenticated()) {
          user = req.user.toObject();
          mainLayout = 'searchresult';
          mainTemplate = 'searchresultsreviewsLogged';
        } else {
          mainLayout = 'searchresult';
          mainTemplate = 'searchresultsreviews';
        }

        await ReviewController.assignReplies();
        if (query) { // if a search term exists
          results = await Review.find({
            $text: {
              $search: query
            }
          }).populate(['reply', 'user']).sort(sortBy);
        } else { // if no search term, return all
          results = await Review.find().populate([
            { path: 'reply', populate: { path: 'establishment' } },
            'user'
          ])
          .sort(sortBy);
        }

        res.render(mainTemplate, {
          layout: mainLayout,
          searchTerm: query,
          resultCount: results.length,
          reviews: results.map(doc => doc.toObject()),
          currentCategory: category, // the category from your server-side code
          currentQuery: query, // the query from your server-side code
          user: user
        });
        break;

      default:
        return res.status(400).send('Invalid category');
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/profile/redirect/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserController.getUserById(id);
    if (user) {
      return res.redirect(`/profile/user/${id}`);
    }
    const establishment = await EstablishmentController.getEstablishmentById(id);
    if (establishment) {
      return res.redirect(`/profile/establishment/${id}`);
    }
    return res.status(404).send({ message: "Specified ID does not exist in either users or establishments" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/home", (req, res) => {
  res.redirect("/");
});

router.get('/about', async (req, res) => {  
  let user, mainLayout, mainTemplate;
  if (req.isAuthenticated()) {
    user = req.user.toObject();
    mainLayout = 'establishment';
    mainTemplate = 'aboutLogged';
  } else {
    mainLayout = 'establishment';
    mainTemplate = 'about';
  }

  res.render(mainTemplate, {
    layout: mainLayout,
    title: "About Juanderlust",
    user: user,
    });
});

router.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('back');
  });
});

router.use((req, res) => {
  res.render("error", {
      layout:'main',
      title: "Page not found."
  });
});

export default router;