/* import { Paddle, EventName } from '@paddle/paddle-node-sdk';
import { env } from '@/env.mjs';

const paddle = new Paddle(process.env.PADDLE_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const signature = req.headers['paddle-signature'] || '';
    const eventData = paddle.webhooks.unmarshal(
        JSON.stringify(req.body),
        env.PADDLE_WEBHOOK_SECRET,
        signature
    );

    if (!eventData) {
        return res.json({
            message: 'Invalid webhook signature!',
        });
    }

    switch (eventData.eventType) {
        case EventName.SubscriptionActivated:
            const { customerId } = eventData.data;
            
    }

    return res.json({
        message: 'done',
    });
}
 */

import { Paddle, EventName } from '@paddle/paddle-node-sdk';

const paddle = new Paddle(process.env.PADDLE_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const signature = req.headers['paddle-signature'] || '';
        const eventData = paddle.webhooks.unmarshal(
            JSON.stringify(req.body),
            process.env.NEXT_PUBLIC_PADDLE_WEBHOOK_SECRET,
            signature
        );

        if (!eventData) {
            return res.status(400).json({
                message: 'Invalid webhook signature!',
            });
        }

        // Handle specific Paddle events
        switch (eventData.eventType) {
            case EventName.SubscriptionActivated:
                /* const { customerId } = eventData.data;

                // Connect to MongoDB
                const client = await clientPromise;
                const db = client.db('next-mongo');
                const collection = db.collection('birthdays');

                // Update or insert the customer subscription info
                await collection.updateOne(
                    { customerId }, 
                    { $set: { isSubscribed: true} }
                );*/

                //console.log(eventData.data);

                break;
            default:
                return res.status(200).json({ message: 'Event not handled' });
        }

        return res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
