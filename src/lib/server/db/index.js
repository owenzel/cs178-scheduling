import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';

// Database constants:
export const MAIN_MEETING = {
    name: 'CS178'
};

const db = new Database(DB_PATH, { verbose: console.log });

export function startDb() {
    // Check to see if the database is already initialized
    let testDbStatement = db.prepare(
        `SELECT *
        FROM meetings
        WHERE
            name=${MAIN_MEETING.name}
        ;`
    );
    let row = testDbStatement.get();
    if (row === undefined) {
        console.log("Database appears empty. Initializing the datbase...");
        
        const sqlInitDb = `
            CREATE TABLE meetings (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                start_time INTEGER,
                end_time INTEGER,
                time_zone TEXT,
                deadline INTEGER
            );

            INSERT INTO meetings (name)
            VALUES (${MAIN_MEETING.name})
            ;

            CREATE TABLE user_responses (
                id INTEGER PRIMARY KEY,
                meeting_id INTEGER NOT NULL,
                user_name_initial TEXT NOT NULL,
                time_zone TEXT NOT NULL,
                start_time INTEGER NOT NULL,
                end_time INTEGER_NOT_NULL,
                start_location TEXT NOT NULL,
                end_location TEXT NOT NULL,
                FOREIGN KEY (name_id) REFERENCES person(id)
            );
        `;

        db.exec(sqlInitDb);
    }
}