function myFunction(index) {
  var dots = document.getElementById("dots"+ index);
  var moreText = document.getElementById("more"+ index);
  var btnText = document.getElementById("myBtn"+ index);

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less";
    moreText.style.display = "inline";

}
}

// function myFunction2(){
//   var dots2 = document.getElementById("dots2");
//   var moreText2 = document.getElementById("more2");
//   var btnText2 = document.getElementById("myBtn2");

//   if (dots2.style.display === "none") {
//     dots2.style.display = "inline";
//     btnText2.innerHTML = "Read more";
//     moreText2.style.display = "none";
//   } else {
//     dots2.style.display = "none";
//     btnText2.innerHTML = "Read less";
//     moreText2.style.display = "inline";
//   }
// }

// function myFunction3(){
// var dots3 = document.getElementById("dots3");
// var moreText3 = document.getElementById("more3");
// var btnText3 = document.getElementById("myBtn3");

// if (dots3.style.display === "none") {
//   dots3.style.display = "inline";
//   btnText3.innerHTML = "Read more";
//   moreText3.style.display = "none";
// } else {
//   dots3.style.display = "none";
//   btnText3.innerHTML = "Read less";
//   moreText3.style.display = "inline";
// }
// }

