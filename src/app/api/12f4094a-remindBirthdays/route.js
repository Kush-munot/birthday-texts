import clientPromise from '@/app/lib/mongodb';
import { addYears, differenceInCalendarDays } from 'date-fns';


const calculateDaysLeft = (day, month) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = monthNames.indexOf(month);
    const year = new Date().getFullYear();
    let birthday = new Date(year, monthIndex, day);

    const today = new Date();

    if (birthday < today) {
        birthday = addYears(birthday, 1);
    }

    const daysLeft = differenceInCalendarDays(birthday, today);

    return daysLeft;
};

const sendMessage = async (phoneNumber, message) => {
    try {
        const response = await fetch('https://your-sms-api.com/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: phoneNumber,
                message: message,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.statusText}`);
        }

        console.log(`Message sent to ${phoneNumber}: ${response.status}`);
    } catch (error) {
        console.error(`Error sending message to ${phoneNumber}:`, error);
    }
};


export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db('nextjs-mongo');
        const collection = db.collection('birthdays');

        const allBirthdays = await collection.find({}).toArray();

        const result = allBirthdays.map(user => {
            const upcomingBirthdays = user.birthdays
                .filter(birthday => calculateDaysLeft(birthday.date, birthday.month) <= 3)
                .map(birthday => ({
                    name: birthday.name,
                    day: birthday.date,
                    month: birthday.month
                }));

            if (upcomingBirthdays.length > 0) {
                return {
                    phoneNumber: user.phoneNumber,
                    birthdays: upcomingBirthdays
                };
            }
            return null;
        }).filter(entry => entry !== null);

        for (const user of result) {
            const { phoneNumber, birthdays } = user;
            const message = `Hey, I am Bixyy from Birthdayremind.app,\nFollowing birthdays are about to come:\n` +
                birthdays.map(b => `${b.name} - ${b.day} ${b.month}`).join('\n');
            await sendMessage(phoneNumber, message);
        }

        return new Response(JSON.stringify({ success: true, message: 'Messages sent successfully!' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error sending birthday reminders:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}
