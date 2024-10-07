import clientPromise from '@/app/lib/mongodb';
import { addYears, differenceInCalendarDays } from 'date-fns';
import { use } from 'react';

const calculateDaysLeft = (day, month) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = monthNames.indexOf(month);
    const year = new Date().getFullYear();
    let birthday = new Date(year, monthIndex, day);

    //console.log(new Date(year, monthIndex, day));

    const today = new Date();

    if (birthday < today) {
        birthday = addYears(birthday, 1);
    }

    const daysLeft = differenceInCalendarDays(birthday, today);

    return daysLeft;
};

/* export async function POST(req) {
    try {
        let { phoneNumber, birthdays } = await req.json();
        phoneNumber = "+" + phoneNumber

        console.log("PHNO - ", phoneNumber);
        console.log("BDAY - ", birthdays);

        if (!phoneNumber || !birthdays || !Array.isArray(birthdays)) {
            return new Response(JSON.stringify({ message: 'Phone number and birthdays array are required' }), {
                status: 400,
            });
        }

        const client = await clientPromise;
        const db = client.db('nextjs_mongo');
        const collection = db.collection('birthdays');

        // Find the user's existing birthdays
        const user = await collection.findOne({ phoneNumber });

        let existingBirthdays = [];

        // If the user exists, use their existing birthdays, otherwise initialize an empty array
        if (user && user.birthdays) {
            existingBirthdays = user.birthdays;
        }

        //console.log("Existing Birthdays", existingBirthdays);

        // Filter out any duplicates (based on name, date, and month)
        const newBirthdays = birthdays.filter(newBday =>
            !existingBirthdays.some(existingBday =>
                existingBday.name === newBday.name &&
                existingBday.date === newBday.date &&
                existingBday.month === newBday.month
            )
        );
        //console.log("new Birthdays - ", newBirthdays);

        // Append the filtered birthdays (only new ones)
        if (newBirthdays.length > 0) {
            if (user) {
                // User exists, update their document
                await collection.updateOne(
                    { phoneNumber },
                    { $push: { birthdays: { $each: newBirthdays } } }
                );
            } else {
                // User does not exist, create a new document
                await collection.insertOne({
                    phoneNumber,
                    birthdays: newBirthdays
                });
            }
        }

        return new Response(JSON.stringify({ success: true, message: 'Birthdays stored successfully!' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error storing birthdays:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
} */

export async function POST(req) {
    try {
        let { phoneNumber, birthdays } = await req.json();
        phoneNumber = "+" + phoneNumber

        console.log("PHNO - ", phoneNumber);
        console.log("BDAY - ", birthdays);

        if (!phoneNumber || !birthdays || !Array.isArray(birthdays)) {
            return new Response(JSON.stringify({ message: 'Phone number and birthdays array are required' }), {
                status: 400,
            });
        }

        const client = await clientPromise;
        const db = client.db('nextjs_mongo');
        const collection = db.collection('birthdays');

        // Find the user's existing birthdays
        const user = await collection.findOne({ phoneNumber });

        console.log("USR - ", user);

        let existingBirthdays = [];

        // If the user exists, use their existing birthdays, otherwise initialize an empty array
        if (user && user.birthdays) {
            existingBirthdays = user.birthdays;
        }

        //console.log("Existing Birthdays", existingBirthdays);

        // Filter out any duplicates (based on name, date, and month)
        const newBirthdays = birthdays.filter(newBday =>
            !existingBirthdays.some(existingBday =>
                existingBday.name === newBday.name &&
                existingBday.date === newBday.date &&
                existingBday.month === newBday.month
            )
        );
        //console.log("new Birthdays - ", newBirthdays);

        // Append the filtered birthdays (only new ones)
        if (newBirthdays.length > 0) {
            if (user) {
                // User exists, update their document
                await collection.updateOne(
                    { phoneNumber },
                    { $push: { birthdays: { $each: newBirthdays } } }
                );
            } else {
                // User does not exist, create a new document
                await collection.insertOne({
                    phoneNumber,
                    birthdays: newBirthdays
                });
            }
        }

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
        let phoneNumber = url.searchParams.get('phoneNumber');

        const client = await clientPromise;
        const db = client.db('nextjs_mongo');
        const collection = db.collection('birthdays');

        if (phoneNumber) {
            phoneNumber = "+" + phoneNumber

            const userBirthdays = await collection.findOne({ phoneNumber });
            //console.log(userBirthdays);

            if (!userBirthdays) {
                return new Response(JSON.stringify({ success: false, message: 'No birthdays found for this user' }), {
                    status: 404,
                });
            }

            return new Response(JSON.stringify({ success: true, birthdays: userBirthdays.birthdays, isSubscribed: userBirthdays.isSubscribed }), {
                status: 200,
            });
        } else {
            // Return all data if no phoneNumber is specified
            const allBirthdays = await collection.find({}).toArray();
            // //console.log(allBirthdays);

            const result = allBirthdays.map(user => {
                const upcomingBirthdays = user.birthdays
                    // .filter(birthday => calculateDaysLeft(birthday.date, birthday.month) <= 3)
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

export async function PUT(req) {
    try {
        let { phoneNumber, birthdays } = await req.json();

        phoneNumber = "+" + phoneNumber
        birthdays = birthdays[0]

        const client = await clientPromise;
        const db = client.db('nextjs_mongo');
        const collection = db.collection('birthdays');

        const result = await collection.updateOne(
            { phoneNumber: phoneNumber, "birthdays.id": birthdays.id },
            { $set: { "birthdays.$": birthdays } }
        );

        if (result.modifiedCount === 1) {
            return new Response(JSON.stringify({ success: true, message: 'Birthday updated successfully' }), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Birthday not found or not updated' }), {
                status: 404,
            });
        }
    } catch (error) {
        console.error('Error updating birthday:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}

export async function DELETE(req) {
    try {
        let { phoneNumber, birthdayId } = await req.json(); // Expecting the UUID to delete

        phoneNumber = "+" + phoneNumber;

        const client = await clientPromise;
        const db = client.db('nextjs_mongo');
        const collection = db.collection('birthdays');

        // Remove the birthday using its UUID
        const result = await collection.updateOne(
            { phoneNumber: phoneNumber },
            { $pull: { birthdays: { id: birthdayId } } } // Use $pull to remove the birthday by UUID
        );

        if (result.modifiedCount === 1) {
            return new Response(JSON.stringify({ success: true, message: 'Birthday deleted successfully' }), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Birthday not found or not deleted' }), {
                status: 404,
            });
        }
    } catch (error) {
        console.error('Error deleting birthday:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}

