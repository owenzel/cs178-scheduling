export async function POST({ request }) {
    // putSelections(params.first_name, params.last_initial, data.selections);

    console.log('hit!');

    const data = await request.json();
    console.log(data);

    return new Response(JSON.stringify({"test": "hi"}));
}