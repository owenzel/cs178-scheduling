import { getInitialSelections } from "../../../../../lib/server/db";

export const load = (({ params }) => {
    const initialSelections = getInitialSelections(params.first_name, params.last_initial);

    return {
        first_name: params.first_name,
        last_initial: params.last_initial,
        initialSelections: initialSelections
    };
});