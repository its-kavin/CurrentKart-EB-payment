document.addEventListener('DOMContentLoaded', () => {
    const billForm = document.getElementById('bill-form');
    const billDetailsDiv = document.getElementById('bill-details');
    const paymentStatusDiv = document.getElementById('payment-status');

    billForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const consumerId = document.getElementById('consumer-id').value;

        // **STEP 1: Call your backend to get bill details**
        // This is a placeholder. You need to replace this with a real API call.
        const billData = await fetchBillDetails(consumerId);

        if (billData) {
            document.getElementById('display-consumer-id').innerText = billData.consumerId;
            document.getElementById('display-units').innerText = billData.units;
            document.getElementById('display-amount').innerText = billData.amount;
            document.getElementById('display-due-date').innerText = billData.dueDate;
            billDetailsDiv.classList.remove('hidden');
        } else {
            alert('Could not retrieve bill details. Please check the consumer ID.');
        }
    });

    document.getElementById('pay-now-btn').addEventListener('click', () => {
        const billAmount = document.getElementById('display-amount').innerText;
        const consumerId = document.getElementById('display-consumer-id').innerText;
        initiatePayment(billAmount, consumerId);
    });
});

// **Placeholder Function:** Replace with a `fetch` call to your backend API
async function fetchBillDetails(consumerId) {
    // For demonstration, we return a hardcoded object.
    // In reality: const response = await fetch(`/api/get-bill?consumerId=${consumerId}`);
    // const data = await response.json();
    // return data;
    console.log(`Fetching bill for: ${consumerId}`);
    return {
        consumerId: consumerId,
        units: '210',
        amount: '1250.50',
        dueDate: '15-Jul-2025'
    };
}

function initiatePayment(amount, consumerId) {
    const options = {
        "key": "YOUR_RAZORPAY_KEY_ID", // Get this from your Razorpay Dashboard
        "amount": parseFloat(amount) * 100, // Amount in the smallest currency unit (paise)
        "currency": "INR",
        "name": "CurrentKart",
        "description": `TNEB Bill for Consumer ID: ${consumerId}`,
        "image": "/logo.png", // URL to your logo
        "handler": function (response) {
            // This function is called after the payment is successful
            document.getElementById('payment-status').innerText = `Payment Successful! Payment ID: ${response.razorpay_payment_id}`;
            document.getElementById('payment-status').style.color = 'green';
            document.getElementById('payment-status').classList.remove('hidden');

            // **STEP 4: Send payment details to your backend to verify and send SMS**
            verifyPaymentAndSendSms(response);
        },
        "prefill": {
            "name": "Customer Name", // You can prefill these if the user is logged in
            "email": "customer@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "consumer_id": consumerId
        },
        "theme": {
            "color": "#007bff"
        }
    };
    const rzp = new Razorpay(options);
    rzp.open();
}

async function verifyPaymentAndSendSms(paymentResponse) {
    // In a real application, you would send the paymentResponse to your backend
    // For example:
    // await fetch('/api/verify-payment', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(paymentResponse)
    // });
    console.log("Payment details sent to backend for verification and SMS.");
}