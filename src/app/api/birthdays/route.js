import clientPromise from '@/app/lib/mongodb';
import { addYears, differenceInCalendarDays } from 'date-fns';
export async function POST(req) {
    try {
        const { phoneNumber, birthdays } = await req.json();
        console.log(phoneNumber);

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

/* export async function GET(req) {
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
} */

const calculateDaysLeft = (day, month) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = monthNames.indexOf(month);
    const year = new Date().getFullYear();
    let birthday = new Date(year, monthIndex, day);

    console.log(new Date(year, monthIndex, day));

    const today = new Date();

    if (birthday < today) {
        birthday = addYears(birthday, 1);
    }

    const daysLeft = differenceInCalendarDays(birthday, today);

    return daysLeft;
};

export async function GET(req) {
    try {
        const url = new URL(req.url);
        let phoneNumber = url.searchParams.get('phoneNumber');

        const client = await clientPromise;
        const db = client.db('nextjs-mongo');
        const collection = db.collection('birthdays');

        if (phoneNumber) {
            phoneNumber = "+" + phoneNumber

            const userBirthdays = await collection.findOne({ phoneNumber });

            if (!userBirthdays) {
                return new Response(JSON.stringify({ success: false, message: 'No birthdays found for this user' }), {
                    status: 404,
                });
            }

            return new Response(JSON.stringify({ success: true, birthdays: userBirthdays.birthdays }), {
                status: 200,
            });
        } else {
            // Return all data if no phoneNumber is specified
            const allBirthdays = await collection.find({}).toArray();
            // console.log(allBirthdays);

            const result = allBirthdays.map(user => {
                const upcomingBirthdays = user.birthdays
                    .filter(birthday => calculateDaysLeft(birthday.date, birthday.month) <= 3)
                    .map(birthday => ({
                        name: birthday.name,
                        day: birthday.date,
                        month: birthday.month
                    }));
                
                console.log(upcomingBirthdays);

                if (upcomingBirthdays.length > 0) {
                    return {
                        phoneNumber: user.phoneNumber,
                        birthdays: upcomingBirthdays
                    };
                }
                return null;
            }).filter(entry => entry !== null);

            return new Response(JSON.stringify({ success: true, data: result }), {
                status: 200,
            });

            /* return new Response(JSON.stringify({ success: true, data: allBirthdays }), {
                status: 200,
            }); */
        }
    } catch (error) {
        console.error('Error retrieving birthdays:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}
