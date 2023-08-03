import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import EstablishmentController from '../controllers/establishment.controller.js';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import Establishment from '../models/establishment.model.js';

const router = Router();

router.put('/api/update-establishment/:establishmentId', EstablishmentController.updateEstablishment);
router.put('/api/update-user/:username', UserController.updateUser);

router.get('/users', async (req, res) => {
  try {
    // Fetch all users from the 'users' collection
    const users = await User.find({}, 'username'); // Return only the 'username' field
    res.json({ users: users }); // Respond with the users data as JSON
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

// Route to fetch reviews by user ID
/*router.get('/api/reviews/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Reviews request received: ", userId);
    // Fetch the reviews associated with the provided user ID
    const review = await Review.find({ user: userId });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/

router.get('/', async (req, res) => {
    // Retrieve data from DB
    const establishments = (await EstablishmentController.getEstablishments()).map(doc => doc.toObject());
    console.log(establishments);
    
    let mainLayout, mainTemplate;
  
    if (req.isAuthenticated()) {
      mainLayout = 'main';
      mainTemplate = 'loggedInMain'; 
    } else {
      mainLayout = 'main';
      mainTemplate = 'index';
    }

    res.render(mainTemplate, {
      layout: mainLayout,
      title: "Juanderlast Main Page",
      user: req.user,
      establishments: establishments 
    });
});

router.get('/establishment', (req, res) => {
    let mainLayout, mainTemplate;
  
      mainLayout = 'establishment';
      mainTemplate = 'establishments'; 
    
  
    res.render(mainTemplate, {
      layout: mainLayout,
      title: "Juanderlast Establishment Page",
      user: req.user
    });
});

router.get('/profile', (req, res) => {
  let mainLayout, mainTemplate;
  if(req.isAuthenticated()) {
    mainLayout = 'profile';
    mainTemplate = 'profilesLogged';
  } else {
    mainLayout = 'profile';
    mainTemplate = 'profiles';
  }
  
  res.render(mainTemplate, {
    layout: mainLayout,
    title: "Juanderlast Profile Page",
    user: req.user,
  });
});

// GET route to render the profile page
router.get('/profile/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userData = usersData.find(user => user._id === userId);
  const results  = (await ReviewController.getReviewsOffUser(userId));
  console.log(results);
  console.log(userData);

  if (!userData) {
    // User not found, handle error
    res.status(404).send('User not found');
    return;
  }

  let mainLayout, mainTemplate;
  if(req.isAuthenticated()) {
    mainLayout = 'profile';
    mainTemplate = 'profilesLogged';
  } else {
    mainLayout = 'profile';
    mainTemplate = 'profiles';
  }

  // Render the 'profilesLogged' view with the userData and reviews
  res.render(mainTemplate, { 
    layout: mainLayout,
    userData: userData, // Make sure 'userData' matches the name used in the template
    reviews: results.map(doc => doc.toObject())
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

  let results;
  let mainLayout;
  let mainTemplate;

  try {
    switch (category) {
      case 'destination':
        if(req.isAuthenticated()) {
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
          currentQuery: query // the query from your server-side code
        });
        console.log(results)
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

  let results;
  let mainLayout;
  let mainTemplate;

  try {
    switch (category) {
      case 'review':
        if(req.isAuthenticated()) {
          mainLayout = 'searchresult';
          mainTemplate = 'searchresultsreviewsLogged';
        } else {
          mainLayout = 'searchresult';
          mainTemplate = 'searchresultsreviews';
        }

        if (query) { // if a search term exists
          results = await Review.find({
            $text: {
              $search: query
            }
          }).populate(['reply', 'user']).sort(sortBy);
          console.log(results);
        } else { // if no search term, return all
          results = await Review.find().populate(['reply', 'user']).sort(sortBy);
          console.log(results);
        }

        res.render(mainTemplate, {
          layout: mainLayout,
          searchTerm: query,
          resultCount: results.length,
          reviews: results.map(doc => doc.toObject()),
          currentCategory: category, // the category from your server-side code
          currentQuery: query // the query from your server-side code
        });
        break;

      default:
        return res.status(400).send('Invalid category');
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/home", (req, res) => {
    res.redirect("/");
});

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.use((req, res) => {
  res.render("error", {
      layout:'main',
      title: "Page not found."
  });
});

export default router;