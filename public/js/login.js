
const signinBtn = document.querySelector('.signinBtn');
const signupBtn = document.querySelector('.signupBtn');
const formBx = document.querySelector('.formBx');
const body = document.querySelector('body');


function signup() {
    formBx.classList.add('active');
    body.classList.add('active');
}
function signin() {
    formBx.classList.remove('active');
    body.classList.remove('active');
}



$(document).ready(function () {
    $(".btn").click(function () {
        console.log("hii")
        if ($(".pre") != $(".next")) {
            alert("Both Password are not Match")
        }
    });
});




