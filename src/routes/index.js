import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import EstablishmentController from '../controllers/establishment.controller.js';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import Establishment from '../models/establishment.model.js';

const router = Router();

const authenticateUser = (req, res, next) => {
    // Check if the user is authenticated, e.g., by checking session or cookie
    // Set the user information in the request object if authenticated
    // For example: req.user = { id: 123, username: 'user123' };
    // If not authenticated, redirect to login page or handle accordingly
    next();
};
router.post('/signup', UserController.createUser);
router.post('/signup-owner', EstablishmentController.createEstablishment);
router.post('/login', UserController.loginUser);  
//router.put('/api/users/:username', UserController.updateUser);
router.put('/api/update-establishment/:establishmentId', EstablishmentController.updateEstablishment);
router.put('/api/update-user/:username', UserController.updateUser);
router.post('/login-owner', EstablishmentController.loginEstablishment);

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

    // Assuming you have a variable to store the authentication status
    const isAuthenticated = req.user ? true : false;
  
    // Determine which layout and template to use based on authentication status
    let mainLayout, mainTemplate;
  
    if (isAuthenticated) {
      mainLayout = 'main';
      mainTemplate = 'loggedInMain'; // Replace 'reviews' with the appropriate template for the logged-in page
    } else {
      mainLayout = 'main';
      mainTemplate = 'index';
    }

    // Render the appropriate Handlebars template with the chosen layout
    res.render(mainTemplate, {
      layout: mainLayout,
      title: "Juanderlast Main Page",
      user: req.user,
      establishments: establishments // Pass retrieved data to Handlebars
    });
});

router.get('/loggedInMain', async (req, res) => {
  // Retrieve data from DB
  const establishments = (await EstablishmentController.getEstablishments()).map(doc => doc.toObject());
  console.log(establishments);

  // Assuming you have a variable to store the authentication status
  const isAuthenticated = req.user ? true : false;

  // Determine which layout and template to use based on authentication status

  let mainLayout, mainTemplate;
    mainLayout = 'main';
    mainTemplate = 'loggedInMain'; // Replace 'reviews' with the appropriate template for the logged-in page


  // Render the appropriate Handlebars template with the chosen layout
  res.render(mainTemplate, {
    layout: mainLayout,
    title: "Juanderlast Main Page",
    user: req.user,
    establishments: establishments // Pass retrieved data to Handlebars
  });
});

router.get('/establishmentLogged', (req, res) => {
  // Render the Handlebars template for the establishment page without specifying a layout
  const isAuthenticated = req.user ? true : false;

  // Determine which layout and template to use based on authentication status
  let mainLayout, mainTemplate;

    mainLayout = 'establishment';
    mainTemplate = 'establishmentLogged'; 


  // Render the appropriate Handlebars template with the chosen layout
  res.render(mainTemplate, {
    layout: mainLayout,
    title: "Juanderlast Establishment Page",
    user: req.user,
    // Other data that the template might need
    // ...
  });
});

router.get('/establishment', (req, res) => {
    // Render the Handlebars template for the establishment page without specifying a layout
    const isAuthenticated = req.user ? true : false;
  
    // Determine which layout and template to use based on authentication status
    let mainLayout, mainTemplate;
  
      mainLayout = 'establishment';
      mainTemplate = 'establishments'; 
    
  
    // Render the appropriate Handlebars template with the chosen layout
    res.render(mainTemplate, {
      layout: mainLayout,
      title: "Juanderlast Establishment Page",
      user: req.user,
      // Other data that the template might need
      // ...
    });
});

router.get('/profileLogged', (req, res) => {
  // Render the Handlebars template for the establishment page without specifying a layout
  const isAuthenticated = req.user ? true : false;

  // Determine which layout and template to use based on authentication status
  let mainLayout, mainTemplate;

      mainLayout = 'profile';
      mainTemplate = 'profilesLogged';
  

  // Render the appropriate Handlebars template with the chosen layout
  res.render(mainTemplate, {
    layout: mainLayout,
    title: "Juanderlast Profile Page",
    user: req.user,
    // Other data that the template might need
    // ...
  });
});

router.get('/profile', (req, res) => {
  // Render the Handlebars template for the establishment page without specifying a layout
  const isAuthenticated = req.user ? true : false;

  // Determine which layout and template to use based on authentication status
  let mainLayout, mainTemplate;

      mainLayout = 'profile';
      mainTemplate = 'profiles';
  

  // Render the appropriate Handlebars template with the chosen layout
  res.render(mainTemplate, {
    layout: mainLayout,
    title: "Juanderlast Profile Page",
    user: req.user,
    // Other data that the template might need
    // ...
  });
});

router.get('/profileLogged/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userData = usersData.find(user => user._id === userId);
  const results = (await ReviewController.getReviewsOffUser(userId)).map(doc => doc.toObject());
  console.log(results);
  console.log(userData);


  if (!userData) {
    // User not found, handle error
    res.status(404).send('User not found');
    return;
  }
  const mainLayout = 'profile';
  const mainTemplate = 'profilesLogged';

  // Render the 'profilesLogged' view with the userData and reviews
  res.render(mainTemplate, { 
    layout: mainLayout,
    userData,
    reviews: results.map(doc => doc.toObject())
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

  const mainLayout = 'profile';
  const mainTemplate = 'profiles';

  // Render the 'profilesLogged' view with the userData and reviews
  res.render(mainTemplate, { 
    layout: mainLayout,
    userData,
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
        mainLayout = 'searchresult';
        mainTemplate = 'searchresults';
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

router.get('/searchresultLogged', async (req, res) => {
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
        mainLayout = 'searchresult';
        mainTemplate = 'searchresultsLogged';
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
        mainLayout = 'searchresult';
        mainTemplate = 'searchresultsreviews';
        if (query) { // if a search term exists
          results = await Review.find({
            $text: {
              $search: query
            }
          }).sort(sortBy);
        } else { // if no search term, return all
          results = await Review.find().sort(sortBy);
        }
        res.render(mainTemplate, {
          layout: mainLayout,
          searchTerm: query,
          resultCount: results.length,
          reviews: results.map(doc => doc.toObject()),
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

router.get('/searchresultreviewLogged', async (req, res) => {
  const category = req.query.category;
  const query = req.query.q;

  let sortBy;
  if(req.query.sortby && req.query.sortby === 'rating') {
    sortBy = { 'rating': -1 };
  } else {
    sortBy = { 'name': 1 };
  }

  let data;
  let results;
  let mainLayout;
  let mainTemplate;

  try {
    switch (category) {
      case 'review':
        mainLayout = 'searchresult';
        mainTemplate = 'searchresultsreviewsLogged';
        if (query) { // if a search term exists
          data = await Review.find({
            $text: {
              $search: query
            }
          }).populate(['reply', 'user']);
          console.log(data);
          results = data.sort(sortBy);
        } else { // if no search term, return all
          data = await Review.find().populate(['reply', 'user']);
          console.log(data);
          results = data.sort(sortBy);
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

router.get("/logout", (req,res) => {
    res.redirect("/");
});

router.get("/home", (req,res) => {
    res.redirect("/");
});

router.get("/loggedInMain", (req,res) => {
    res.render("loggedInMain", {
        title: "Juanderlast Main Page"
    });
});

router.use((req,res) => {
    res.render("error", {
        layout:'main',
        title: "Page not found."
    });
})
export default router;