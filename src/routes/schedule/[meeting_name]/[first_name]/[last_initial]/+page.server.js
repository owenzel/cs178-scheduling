import { getInitialSelections } from "../../../../../lib/server/db";

// CONCEPT: Editing: This calls the relevant database function to fetch a logged in user's previously saved selections (if any exists) and display them on their page
export const load = (({ params }) => {
    const initialSelections = getInitialSelections(params.first_name, params.last_initial);

    return {
        first_name: params.first_name,
        last_initial: params.last_initial,
        initialSelections: initialSelections
    };
});