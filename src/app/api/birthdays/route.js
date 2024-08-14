import clientPromise from '@/app/lib/mongodb';

export async function POST(req) {
    try {
        const { phoneNumber, birthdays } = await req.json();

        if (!phoneNumber || !birthdays || !Array.isArray(birthdays)) {
            return new Response(JSON.stringify({ message: 'Phone number and birthdays array are required' }), {
                status: 400,
            });
        }

        const client = await clientPromise;
        const db = client.db('nextjs-mongo');

        const collection = db.collection('birthdays');

        // Upsert: Insert if doesn't exist, update if exists
        await collection.updateOne(
            { phoneNumber },
            { $push: { birthdays: { $each: birthdays } } },
            { upsert: true }
        );

        return new Response(JSON.stringify({ success: true, message: 'Birthdays stored successfully!' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error storing birthdays:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const phoneNumber = url.searchParams.get('phoneNumber');

        if (!phoneNumber) {
            return new Response(JSON.stringify({ message: 'Phone number is required' }), {
                status: 400,
            });
        }

        const client = await clientPromise;
        const db = client.db('nextjs-mongo');

        const collection = db.collection('birthdays');
        const userBirthdays = await collection.findOne({ phoneNumber });

        if (!userBirthdays) {
            return new Response(JSON.stringify({ success: false, message: 'No birthdays found for this user' }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ success: true, birthdays: userBirthdays.birthdays }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error retrieving birthdays:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}
