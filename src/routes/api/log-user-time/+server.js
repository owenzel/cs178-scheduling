import { updateUserTiming } from "../../../lib/server/db";

// An API for calling the relevant database function to save a user's time logs

export async function POST({ request }) {

    try {
        const data = await request.json();
        updateUserTiming(data);

        return new Response(JSON.stringify({ "message": "Success!" }));
    } catch (e) {
        console.log(e);

        return new Response(JSON.stringify({ "message": "Error!" }));
    }
    
}