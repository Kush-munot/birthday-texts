import clientPromise from '@/app/lib/mongodb';
import crypto from 'crypto';

export async function POST(req, res) {
    let { phoneNumber } = await req.json();

    phoneNumber = phoneNumber.replace("+", "");

    if (!phoneNumber) {
        return new Response(JSON.stringify({ message: 'Phone number is required' }), {
            status: 400,
        });
    }

    // Generate a random OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('nextjs-mongo');

    // Insert the phone number and OTP into the database
    const collection = db.collection('otps');
    await collection.insertOne({ phoneNumber, otp, createdAt: new Date() });

    console.log(otp);

    // API URL and body
    const apiUrl = `${process.env.API_BASE_URL}/${process.env.VENDOR_UID}/contact/send-template-message?token=${process.env.TOKEN}`;
    const requestBody = {
        "from_phone_number_id": `${process.env.FROM_PHONE_NUMBER_ID}`,
        "phone_number": phoneNumber,
        "template_name": "authentication",
        "template_language": "en",
        "field_1": otp,
        "button_0": otp
    };

    // Send OTP message via WhatsApp API
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other required headers here, such as Authorization
            },
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Failed to send message:', responseData);
            return new Response(JSON.stringify({ success: false, message: 'Failed to send OTP message' }), {
                status: 500,
            });
        }

        console.log(`OTP sent to ${phoneNumber}: ${otp}`);
        console.log('WhatsApp API response:', responseData);

        return new Response(JSON.stringify({ success: true, message: `Thank you for registering on Birthdayremind. Your One-Time-Password is - ${otp}` }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error sending OTP message' }), {
            status: 500,
        });
    }
}