const stars = document.querySelectorAll(".star");
const result = document.getElementById("result");

let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener("click", () => {
    const rating = parseInt(star.getAttribute("data-rating"));
    selectedRating = rating;
    updateStars();
  });

  star.addEventListener("mouseover", () => {
    const rating = parseInt(star.getAttribute("data-rating"));
    highlightStars(rating);
  });

  star.addEventListener("mouseout", () => {
    updateStars();
  });
});

function updateStars() {
  stars.forEach((star, index) => {
    if (index < selectedRating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });

  result.value = `${selectedRating}`;
}

function highlightStars(rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}
