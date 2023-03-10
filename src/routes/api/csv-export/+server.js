import { getAllUserTiming } from "../../../lib/server/db";
import { writeFileSync } from "fs";

// An API for fetching users time logs from the database and writing them to a csv `timing_logs.csv`

export async function POST() {

    try {
        const timingLogs = getAllUserTiming();
        let csv = ``;

        for (let i = 0; i < timingLogs.length; i++) {
            const log = timingLogs[i];
            const { first_name_last_initial, start_time, end_time, time_elapsed_sec } = log;
            csv += `${first_name_last_initial},${start_time},${end_time},${time_elapsed_sec}\n`;
        }
        writeFileSync('./timing_logs.csv', csv, 'utf8', function (err) {
            if (err) {
              console.log('Error writing to CSV');
            } else {
              console.log('Success writing to CSV');
            }
        });

        return new Response(JSON.stringify({ "message": "Success!" }));
    } catch (e) {
        console.log(e);

        return new Response(JSON.stringify({ "message": "Error!" }));
    }
    
}