import clientPromise from '@/app/lib/mongodb';

export async function POST(req) {
    try {
        let { phoneNumber, otp } = await req.json();
        phoneNumber = phoneNumber.replace("+", "");

        console.log(phoneNumber, otp);

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
