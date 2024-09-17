import clientPromise from '@/app/lib/mongodb';

export async function POST(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { subscriptionId, isSubscribed } = await req.json();
        console.log(subscriptionId, isSubscribed);

        // Validate the input
        if (!subscriptionId) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid input' }), {
                status: 400,
            });
        }

        // Connect to the database
        const client = await clientPromise;
        const db = client.db('nextjs-mongo');
        const collection = db.collection('birthdays'); // Modify with your actual collection name

        // Update the subscription status
        const result = await collection.updateOne(
            { subscriptionId }, // Find the document with the matching subscriptionId
            {
                $set: {
                    isSubscribed: isSubscribed // Update the subscription status
                }
            }
        );

        // Check if the document was matched and updated
        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ success: false, message: 'Customer not found' }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ success: true, message: 'Subscription status updated successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error updating subscription:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
            status: 500,
        });
    }
}

