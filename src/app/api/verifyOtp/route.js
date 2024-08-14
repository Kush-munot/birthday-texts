// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI; // MongoDB URI from environment variable
// const client = new MongoClient(uri);

// export async function handler(req, res) {
//     console.log(req.method);
//     if (req.method === 'POST') {
//         const { phoneNumber, otp } = req.body;

//         console.log(phoneNumber);
//         console.log(otp);
//         try {
//             await client.connect();
//             const database = client.db('nextjs-mongo');
//             const otpCollection = database.collection('otps');

//             // Check if the OTP is valid
//             const otpRecord = await otpCollection.findOne({ phoneNumber, otp });
//             console.log(otpRecord);

//             if (otpRecord) {
//                 // OTP is valid
//                 // await otpCollection.deleteOne({ phoneNumber, otp }); // Optionally delete the OTP after validation
//                 res.status(200).json({ message: 'OTP verified successfully!', key: phoneNumber });
//             } else {
//                 // OTP is invalid
//                 res.status(400).json({ message: 'Invalid OTP. Please try again.' });
//             }
//         } catch (error) {
//             res.status(500).json({ message: 'Internal server error.' });
//         } finally {
//             await client.close();
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

import clientPromise from '@/app/lib/mongodb';

export async function POST(req) {
    try {
        const { phoneNumber, otp } = await req.json();

        if (!phoneNumber || !otp) {
            return new Response(JSON.stringify({ message: 'Phone number and OTP are required' }), {
                status: 400,
            });
        }

        const client = await clientPromise;
        const db = client.db('nextjs-mongo');

        const collection = db.collection('otps');
        const otpRecord = await collection.findOne({ phoneNumber, otp });

        if (!otpRecord) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid OTP' }), {
                status: 400,
            });
        }

        // OTP is valid; perform any further actions (e.g., creating a user session)

        // Optionally, remove the OTP after verification
        await collection.deleteOne({ phoneNumber, otp });
        const cookie = `user=${phoneNumber}; Max-Age=${60 * 60 * 24}; Path=/; SameSite=Lax;`;

        return new Response(JSON.stringify({ success: true, message: 'OTP verified successfully!', key: phoneNumber }), {
            status: 200,
            headers: {
                'Set-Cookie': cookie,
            },
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}
