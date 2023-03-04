import { getInitialSelections } from "../../../../../lib/server/db";

export const load = (({ params }) => {
    const selections = getInitialSelections(params.first_name, params.last_initial);

    return {
        selections
    };
});