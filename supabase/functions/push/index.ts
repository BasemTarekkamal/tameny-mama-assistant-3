// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
    title: string;
    message: string;
    user_id?: string;
}

// Get the FCM Server Key from Supabase secrets
// Ensure you have set this via: supabase secrets set FIREBASE_SERVER_KEY=...
const FCM_SERVER_KEY = Deno.env.get('FIREBASE_SERVER_KEY');

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { title, message } = await req.json() as NotificationRequest;

        if (!FCM_SERVER_KEY) {
            throw new Error('FIREBASE_SERVER_KEY is not set in Edge Function secrets.');
        }

        const payload = {
            to: '/topics/all',
            notification: {
                title: title,
                body: message,
            },
            data: {
                url: '/notifications',
            },
        };

        console.log(`Sending Push to topic 'all':`, JSON.stringify(payload));

        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${FCM_SERVER_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('FCM Response:', data);

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
