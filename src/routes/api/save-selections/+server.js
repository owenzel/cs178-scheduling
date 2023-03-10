import { updateSelections } from "../../../lib/server/db";

// CONCEPT: Editing: an API to call the relevant database function to save a user's selections (so it can be retrieved later)

export async function POST({ request }) {

    try {
        const data = await request.json();
        updateSelections(data);

        return new Response(JSON.stringify({ "message": "Success!" }));
    } catch (e) {
        console.log(e);

        return new Response(JSON.stringify({ "message": "Error!" }));
    }
    
}