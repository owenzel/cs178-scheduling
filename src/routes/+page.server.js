import { redirect } from '@sveltejs/kit';
import { MAIN_MEETING } from '../lib/server/db';

export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        const route = `/schedule/${MAIN_MEETING.name}/${data.get('firstName')}-${data.get('lastInitial')}`;

        throw redirect(303, route);
    }
};