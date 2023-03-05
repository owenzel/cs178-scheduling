import { getInitialSelections, putSelections } from "../../../../../lib/server/db";

export const load = (({ params }) => {
    const initialSelections = getInitialSelections(params.first_name, params.last_initial);

    return {
        initialSelections
    };
});