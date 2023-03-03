import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';

/*
Database constants
*/
export const MAIN_MEETING = {
    name: 'CS178'
};
// Meetings table constants
const MEETINGS_TABLE = 'meetings';
const MEETINGS_TABLE_FIELDS = {
    id: 'id',
    name: 'name',
    start_time: 'start_time',
    end_time: 'end_time',
    time_zone: 'time_zone',
    deadline: 'deadline',
};
// User responses table constants
const USER_RESPONSES_TABLE = 'user_responses';
const USER_RESPONSES_TABLE_FIELDS = {
    id: 'id',
    meeting_id: 'meeting_id',
    user_first_name: 'user_first_name',
    user_last_initial: 'user_last_initial',
    time_zone: 'time_zone',
    start_time: 'start_time',
    end_time: 'end_time',
    start_location: 'start_location',
    end_location: 'end_location',
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
        console.log("Database appears empty. Initializing the database...");
        
        const sqlInitDb = `
            CREATE TABLE ${MEETINGS_TABLE} (
                ${MEETINGS_TABLE_FIELDS.id} INTEGER PRIMARY KEY,
                ${MEETINGS_TABLE_FIELDS.name} TEXT NOT NULL,
                ${MEETINGS_TABLE_FIELDS.start_time} INTEGER,
                ${MEETINGS_TABLE_FIELDS.end_time} INTEGER,
                ${MEETINGS_TABLE_FIELDS.time_zone} TEXT,
                ${MEETINGS_TABLE_FIELDS.deadline} INTEGER
            );

            INSERT INTO ${MEETINGS_TABLE} (name)
            VALUES (${MAIN_MEETING.name})
            ;

            CREATE TABLE ${USER_RESPONSES_TABLE} (
                ${USER_RESPONSES_TABLE_FIELDS.id} INTEGER PRIMARY KEY,
                ${USER_RESPONSES_TABLE_FIELDS.meeting_id} INTEGER NOT NULL,
                ${USER_RESPONSES_TABLE_FIELDS.user_first_name} TEXT NOT NULL,
                ${USER_RESPONSES_TABLE_FIELDS.user_last_initial} TEXT NOT NULL,
                ${USER_RESPONSES_TABLE_FIELDS.time_zone} TEXT NOT NULL,
                ${USER_RESPONSES_TABLE_FIELDS.time_zone} INTEGER NOT NULL,
                ${USER_RESPONSES_TABLE_FIELDS.end_time} INTEGER_NOT_NULL,
                ${USER_RESPONSES_TABLE_FIELDS.start_location} TEXT NOT NULL,
                ${USER_RESPONSES_TABLE_FIELDS.end_location} TEXT NOT NULL,
                FOREIGN KEY (name_id) REFERENCES person(id)
            );
        `;

        db.exec(sqlInitDb);
    }
}

// WORK IN PROGRESS
export function getInitialSelections() {
    const sql = `
    select 
    from 
    `;
}