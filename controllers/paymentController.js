const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const { Email_id, Email_password } = process.env;
const nodemailer = require("nodemailer")

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: Email_id,
        pass: Email_password
    },
    connectionTimeout: 1 * 60 * 1000
});


const renderProductPage = async (req, res) => {
    try {
        res.render('booking');
    } catch (error) {
        console.log(error.message);
    }
}

const createOrder = async (req, res) => {
    try {
        const amount = req.body.amount * 100
        console.log(amount)
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }


        console.log("success");
        razorpayInstance.orders.create(options,
            (err, order) => {
                console.log(order);
                if (!err) {
                    console.log("ruchir");

                    res.status(200).send({
                        success: true,
                        msg: 'Order Created',
                        order_id: order.id,
                        amount: amount,
                        key_id: RAZORPAY_ID_KEY,
                        product_name: req.body.name,
                        description: req.body.description,
                        contact: "9173497345",
                        name: "Ruchir Parmar",
                        email: "ruchirgparmar@gmail.com"
                    });
                   
                }
                else {
                    res.status(400).send({ success: false, msg: 'Something went wrong!' });
                    console.log("error");

                }
            }

            
        );
        var mailOptions = {
            from: "ruchirgparmar@gmail.com",
            to: req.body.email,
            subject: "Joureneyr Account Register",
            text: `Thank you ${req.body.firstName} ${req.body.lastName}
    
                            Your Booking Successfully Done!..
    
                            Package Name: ${req.body.packageName}
                            Hotel Name: ${req.body.hotelName}
                            Room Type: ${req.body.roomType}
                            Date: ${req.body.date}
                            Phone No.: ${req.body.phone}
                            Adhar No.: ${req.body.adharNumber}
    
                            I Hope all above details are correct.
    
                            If any mistake then call the below number and mail
                            Mo.: 9173497345
                            E-mail: ruchirgparmar@gmail.com
    
                            Further Information proveide soon..
                 Thank You!
    
                            `
        }
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log("Email Sent Succesfully")
            }
        })



    } catch (error) {
        console.log(error.message);

    }
    console.log("createOrder");
    console.log(req.body.email);
    // var mailOptions = {
    //     from: "ruchirgparmar@gmail.com",
    //     to: req.body.email,
    //     subject: "Joureneyr Account Register",
    //     text: `Thank you ${req.body.firstName} ${req.body.lastName}

    //                     Your Booking Successfully Done!..

    //                     Package Name: ${req.body.packageName}
    //                     Hotel Name: ${req.body.hotelName}
    //                     Room Type: ${req.body.roomType}
    //                     Date: ${req.body.date}
    //                     Phone No.: ${req.body.phone}
    //                     Adhar No.: ${req.body.adharNumber}

    //                     I Hope all above details are correct.

    //                     If any mistake then call the below number and mail
    //                     Mo.: 9173497345
    //                     E-mail: ruchirgparmar@gmail.com

    //                     Further Information proveide soon..
    //          Thank You!

    //                     `
    // }

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.log(error)
    //     }
    //     else {
    //         console.log("Email Sent Succesfully")
    //     }
    // })
}


module.exports = {
    renderProductPage,
    createOrder
}