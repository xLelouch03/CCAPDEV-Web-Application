import { Router } from 'express';

const router = Router();

router.get("/", (req,res) => {
    res.render("index", {
        
    });
});

router.get("/home", (req,res) => {
    res.redirect("/");
});

router.get("/loggedInMain", (req,res) => {
    res.render("loggedInMain", {
        title: "Main Page"
    });
});


router.use((req,res) => {
    res.render("error", {
        title: "Page not found."
    });
})
export default router;