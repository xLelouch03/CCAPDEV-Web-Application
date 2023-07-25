import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import EstablishmentController from '../controllers/establishment.controller.js';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
const router = Router();

const authenticateUser = (req, res, next) => {
    // Check if the user is authenticated, e.g., by checking session or cookie
    // Set the user information in the request object if authenticated
    // For example: req.user = { id: 123, username: 'user123' };
    // If not authenticated, redirect to login page or handle accordingly
    next();
};
router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);  
router.put('/api/users/:username', UserController.updateUser);

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

// Route to fetch reviews by user ID
router.get('/api/reviews/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch the reviews associated with the provided user ID
    const reviews = await Review.find({ user: userId });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', (req, res) => {
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
      // Other data that the template might need
      // ...
    });
});

router.get('/establishment', (req, res) => {
    // Render the Handlebars template for the establishment page without specifying a layout
    const isAuthenticated = req.user ? true : false;
  
    // Determine which layout and template to use based on authentication status
    let mainLayout, mainTemplate;
  
    if (isAuthenticated) {
      mainLayout = 'establishment';
      mainTemplate = 'establishmentLogged'; 
    } else {
        mainLayout = 'establishment';
        mainTemplate = 'establishmentLogged';
    }
  
    // Render the appropriate Handlebars template with the chosen layout
    res.render(mainTemplate, {
      layout: mainLayout,
      title: "Juanderlast Establishment Page",
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
  
    if (isAuthenticated) {
      mainLayout = 'profile';
      mainTemplate = 'profilesLogged'; 
    } else {
        mainLayout = 'profile';
        mainTemplate = 'profilesLogged';
    }
  
    // Render the appropriate Handlebars template with the chosen layout
    res.render(mainTemplate, {
      layout: mainLayout,
      title: "Juanderlast Profile Page",
      user: req.user,
      // Other data that the template might need
      // ...
    });
});

// GET route to render the profile page
router.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  const userData = usersData.find(user => user._id === userId);

  if (!userData) {
    // User not found, handle error
    res.status(404).send('User not found');
    return;
  }

  // Render the 'profile' view with the userData
  res.render('profile', { userData });
});

// Retrieve existing establishments and render searchresults
router.get('/searchresult', async (req, res) => {
  try {
      const establishments = (await EstablishmentController.getEstablishments()).map(doc => doc.toObject());
      console.log(establishments);

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