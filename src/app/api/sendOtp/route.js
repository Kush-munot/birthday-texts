import clientPromise from '@/app/lib/mongodb';
import crypto from 'crypto';

export async function POST(req, res) {
    const { phoneNumber } = await req.json();

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

    // Simulate sending OTP (log it)
    console.log(`OTP sent to ${phoneNumber}: ${otp}`);

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
    });
}
