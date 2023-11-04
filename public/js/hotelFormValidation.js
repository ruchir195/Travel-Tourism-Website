
function validateForm(form) {
    var fname = form.fname.value;
    var lname = form.lname.value;
    var phone = form.phone.value;
    var email = form.email.value;
    var ano = form.ano.value;

    var regName = /^[a-zA-Z]+$/;
    var regPhone = /^[0-9]{10}$/;
    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var regAno = /^[0-9]{12}$/;

    document.getElementById('fname-error').textContent = '';
    document.getElementById('lname-error').textContent = '';
    document.getElementById('phone-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('ano-error').textContent = '';

    if (!regName.test(fname)) {
        document.getElementById('fname-error').textContent = 'Invalid Name';
        form.fname.value = '';
        return false;
    }

    if (!regName.test(lname)) {
        document.getElementById('lname-error').textContent = 'Invalid Name';
        form.lname.value = '';
        return false;
    }

    if (!regPhone.test(phone)) {
        document.getElementById('phone-error').textContent = 'Invalid Number';
        form.phone.value = '';
        return false;
    }

    if (!regEmail.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid Email-id';
        form.email.value = '';
        return false;
    }

    if (!regAno.test(ano)) {
        document.getElementById('ano-error').textContent = 'Invalid Adhar Number';
        form.ano.value = '';
        return false;
    }

    return true;
} 


// Get the current date
const today = new Date();

// Calculate the date two days from now
const minDate = new Date(today);
minDate.setDate(today.getDate() + 3);

// Format the minimum date in the format YYYY-MM-DD
const minDateFormatted = minDate.toISOString().split('T')[0];

// Set the minimum attribute of the date input to two days from now
document.getElementById('idate').setAttribute('min', minDateFormatted);