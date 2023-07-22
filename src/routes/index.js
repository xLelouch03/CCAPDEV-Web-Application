import { Router } from 'express';

const router = Router();

const authenticateUser = (req, res, next) => {
    // Check if the user is authenticated, e.g., by checking session or cookie
    // Set the user information in the request object if authenticated
    // For example: req.user = { id: 123, username: 'user123' };
    // If not authenticated, redirect to login page or handle accordingly
    next();
};

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
        mainTemplate = 'establishments';
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
        mainTemplate = 'profiles';
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

router.get("/logout", (req,res) => {
    res.render("index", {
        title: "Juanlast Home Page"
    });
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