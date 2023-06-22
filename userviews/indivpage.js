$(document).ready(function() {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });
});

function showAllReviews() {
    var x = document.getElementsByClassName("review-container");
    for(i = 0; i < x.length; i++) {
        x[i].style.display = "flex";
    }
}

function showPhotoReviews() {
    var x = document.getElementsByClassName("text-only-review");
    for(i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
}
