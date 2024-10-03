import clientPromise from '@/app/lib/mongodb';

export async function GET(req) {
    try {
        // Parse the URL for the phone number
        const url = new URL(req.url);
        let phoneNumber = url.searchParams.get('phoneNumber');
        //console.log(phoneNumber);

        if (!phoneNumber) {
            return new Response(JSON.stringify({ success: false, message: 'Phone number is required' }), {
                status: 400,
            });
        }
        phoneNumber = "+" + phoneNumber;

        const client = await clientPromise;
        const db = client.db('nextjs_mongo');
        const collection = db.collection('birthdays');

        // Search for a document where the phone number matches
        const user = await collection.findOne({ phoneNumber });

        //console.log(user);

        if (!user) {
            return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
                status: 404,
            });
        }

        // If the user has a customerId, return it
        if (user.customerId) {
            return new Response(JSON.stringify({ success: true, subsId: user.subscriptionId, isSubscribed: user.isSubscribed }), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Subscription ID not found for this user' }), {
                status: 404,
            });
        }
    } catch (error) {
        console.error('Error retrieving customerId:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}
