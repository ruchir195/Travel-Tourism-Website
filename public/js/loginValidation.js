   
function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    console.log("Hello Ruchir")

    let valid = true;

   
    if (!emailRegex.test(email)) {
        emailError.innerText = 'Invalid email format';
        valid = false;
    } else {
        emailError.innerText = '';
    }

    if (!passwordRegex.test(password)) {
        passwordError.innerText = `Password must be at least 8 characters long and 
        contain at least one lowercase letter, one uppercase letter, 
        one digit, and one special character.`;
        valid = false;
    } else {
        passwordError.innerText = '';
    }

    return valid;
} 

function validateRegisterForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const name = document.getElementById('name').value;
    const nameRegex = /^[a-zA-Z]{3,8}[0-9]{2,3}/
    const nameError = document.getElementById('name-error');

    let valid = true;

   
    if (!emailRegex.test(email)) {
        emailError.innerText = 'Invalid email format';
        valid = false;
    } else {
        emailError.innerText = '';
    }

    if (!passwordRegex.test(password)) {
        passwordError.innerText = `Password must be at least 8 characters long and 
        contain at least one lowercase letter, one uppercase letter, 
        one digit, and one special character.`;
        valid = false;
    } else {
        passwordError.innerText = '';
    }


    if (!nameRegex.test(name)) {
        nameError.innerText = 'Invalid Username format';
        valid = false;
    } else {
        nameError.innerText = '';
    }

    return valid;
}    


function validateEmail(){
    const email = document.getElementById('username').value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const emailError = document.getElementById('email-error');

    let valid = true;

   
    if (!emailRegex.test(email)) {
        emailError.innerText = 'Invalid email format';
        valid = false;
    } else {
        emailError.innerText = '';
    }

    return valid;
}

function validateOtp(){
    const otp = document.getElementById('otpCheck').value;
    const otpRegex = /^\d{6}$/;
    const otpError = document.getElementById('otp-error');

    let valid = true;

    if (!otpRegex.test(otp)) {
        otpError.innerText = 'Invalid OTP';
        valid = false;
    } else {
        otpError.innerText = '';
    }

    return valid;
}

function validatePassword(){
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const passwordError = document.getElementById('password-error');

    let valid = true;

    if (!passwordRegex.test(password1)) {
        passwordError.innerText = `Password must be at least 8 characters long and 
        contain at least one lowercase letter, one uppercase letter, 
        one digit, and one special character.`;
        valid = false;
    } else {
        passwordError.innerText = '';
    }

    if (!passwordRegex.test(password2)) {
        passwordError.innerText = `Password must be at least 8 characters long and 
        contain at least one lowercase letter, one uppercase letter, 
        one digit, and one special character.`;
        valid = false;
    } else {
        passwordError.innerText = '';
    }

    return valid;

}






