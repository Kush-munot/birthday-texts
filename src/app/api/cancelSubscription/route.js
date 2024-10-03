
export async function POST(req) {
    try {
        const { subsId } = await req.json();

        console.log("SUBS_ID", subsId);
        const paddleApiUrl = `https://sandbox-api.paddle.com/subscriptions/${subsId}/cancel`;
        console.log("API_URL", paddleApiUrl);
        const response = await fetch(paddleApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
            },
            body: JSON.stringify({
                effective_from: 'immediately',
            }),
        });

        //console.log(response);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify({ success: true, data: data }), {
            status: 200,
        });

    } catch (error) {
        console.error('Error in pausing subscription:', error);
        return new Response(JSON.stringify({ success: true, message: error.message }), {
            status: 500,
        });
    }
}
