import { NextRequest, NextResponse } from 'next/server';
import { Paddle, EventName } from '@paddle/paddle-node-sdk';
import clientPromise from '../../../lib/mongodb';

const paddle = new Paddle(process.env.PADDLE_API_KEY);

export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('paddle-signature');
        // console.log("REQ", body);
        // console.log("REQ-H", request.headers.get('paddle-signature'));

        const eventData = paddle.webhooks.unmarshal(
            body,
            process.env.PADDLE_WEBHOOK_SECRET,
            signature
        );

        if (!eventData) {
            return NextResponse.json({ message: 'Invalid webhook signature!' }, { status: 400 });
        }


        let client = await clientPromise;
        let db = client.db('nextjs-mongo');
        let collection = db.collection('birthdays');
        let customerId;
        switch (eventData.eventType) {
            case EventName.SubscriptionCreated:
                customerId = eventData.data;
                await collection.updateOne(
                    { customerId },
                    { $set: { isSubscribed: true } }
                );
                console.log("Event Data - ", eventData.data);
                break;
            case EventName.SubscriptionPaused:
                customerId = eventData.data;
                await collection.updateOne(
                    { customerId },
                    { $set: { isSubscribed: false } }
                );
                console.log("Event Data - ", eventData.data);
                break;
            case EventName.SubscriptionResumed:
                customerId = eventData.data;
                await collection.updateOne(
                    { customerId },
                    { $set: { isSubscribed: false } }
                );
                console.log("Event Data - ", eventData.data);
                break;
            default:
                return NextResponse.json({ message: 'Event not handled' }, { status: 200 });
        }

        return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}