const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// IMPORTANT: Store these securely, e.g., in environment variables
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';
const RAZORPAY_KEY_SECRET = 'YOUR_RAZORPAY_KEY_SECRET';

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});

// **API Endpoint to get bill details**
// This is a MOCK endpoint. You MUST replace this with a real implementation.
app.get('/api/get-bill', (req, res) => {
    const { consumerId } = req.query;
    if (!consumerId) {
        return res.status(400).json({ error: 'Consumer ID is required' });
    }
    // TODO: Implement logic to securely fetch data from TNEB's official source
    // or a trusted third-party API provider.
    res.json({
        consumerId: consumerId,
        units: '210',
        amount: '1250.50',
        dueDate: '15-Jul-2025'
    });
});


// **API Endpoint to verify payment**
app.post('/api/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const notes = req.body.notes; // Contains consumer_id

    // Webhook validation logic from Razorpay docs
    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        console.log("Payment is successful and verified.");

        // **STEP 5: Send SMS Notification**
        // Integrate your chosen SMS gateway here (e.g., Twilio, MSG91)
        const consumerId = notes.consumer_id; // Get consumer ID from notes
        const message = `Dear Customer, your payment for TNEB Consumer ID ${consumerId} has been successfully processed. Thank you for using CurrentKart.`;
        // sendSms(customerPhoneNumber, message); // Call your SMS function
        console.log(`Sending SMS: ${message}`);


        res.json({status: 'success'});
    } else {
        res.status(400).json({status: 'failure'});
        console.log("Payment verification failed.");
    }
});


// Function to send SMS (Placeholder)
function sendSms(phoneNumber, message) {
    // This is where you would use the SDK or API of your SMS provider
    // Example using a hypothetical provider:
    // smsProvider.send({
    //   to: phoneNumber,
    //   message: message
    // });
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
}


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});