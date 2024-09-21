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

/* const sendMessage = async (phoneNumber, message) => {
    const apiUrl = `${process.env.API_BASE_URL}/${process.env.VENDOR_UID}/contact/send-template-message?token=${process.env.TOKEN}`;
    const requestBody = {
        "from_phone_number_id": `${process.env.FROM_PHONE_NUMBER_ID}`,
        "phone_number": phoneNumber,
        "template_name": "today_birthday",
        "template_language": "en",
        "field_1": message,
      };
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

        //console.log(`Reminder Message sent to ${phoneNumber}: ${message}`);
        //console.log('WhatsApp API response:', responseData);

        return new Response(JSON.stringify({ success: true, message: `Reminder Message Sent` }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error sending Reminder Message' }), {
            status: 500,
        });
    }
};
 */

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db('nextjs_mongo');
        const collection = db.collection('birthdays');

        const allBirthdays = await collection.find({}).toArray();

        const result = allBirthdays.map(user => {
            const upcomingBirthdays = user.birthdays
                .filter(birthday => calculateDaysLeft(birthday.date, birthday.month) <= 1)
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

        //console.log("RESULT - ", result);

        /* for (const user of result) {
            let { phoneNumber, birthdays } = user;
            phoneNumber = phoneNumber.replace("+", "");
            //console.log(phoneNumber);
            const message = birthdays.map(b => `${b.name} - ${b.day} ${b.month}`).join(', ');
            // await sendMessage(phoneNumber, message);
        } */

        return new Response(JSON.stringify({ success: true, data: result, message: 'Messages sent successfully!' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error sending birthday reminders:', error);
        return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
            status: 500,
        });
    }
}
