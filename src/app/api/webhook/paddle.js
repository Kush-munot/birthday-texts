import { PrismaClient } from '@prisma/client';
import { Paddle, EventName } from '@paddle/paddle-node-sdk';
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
