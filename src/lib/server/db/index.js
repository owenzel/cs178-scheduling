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
    first_name_last_initial: 'first_name_last_initial',
    time_zone: 'time_zone',
    start_time: 'start_time',
    end_time: 'end_time',
    start_location: 'start_location',
    end_location: 'end_location',
};

const db = new Database(DB_PATH, { verbose: console.log });

// Initialize the database: create a meetings and user responses table and insert a starter meeting (for the competition)
const sqlInitDb = `
    CREATE TABLE IF NOT EXISTS ${MEETINGS_TABLE} (
        ${MEETINGS_TABLE_FIELDS.id} INTEGER PRIMARY KEY,
        ${MEETINGS_TABLE_FIELDS.name} TEXT NOT NULL,
        ${MEETINGS_TABLE_FIELDS.start_time} INTEGER,
        ${MEETINGS_TABLE_FIELDS.end_time} INTEGER,
        ${MEETINGS_TABLE_FIELDS.time_zone} TEXT,
        ${MEETINGS_TABLE_FIELDS.deadline} INTEGER
    );

    CREATE TABLE IF NOT EXISTS ${USER_RESPONSES_TABLE} (
        ${USER_RESPONSES_TABLE_FIELDS.id} INTEGER PRIMARY KEY,
        ${USER_RESPONSES_TABLE_FIELDS.meeting_id} INTEGER NOT NULL,
        ${USER_RESPONSES_TABLE_FIELDS.first_name_last_initial} TEXT NOT NULL,
        ${USER_RESPONSES_TABLE_FIELDS.time_zone} TEXT NOT NULL,
        ${USER_RESPONSES_TABLE_FIELDS.start_time} INTEGER NOT NULL,
        ${USER_RESPONSES_TABLE_FIELDS.end_time} INTEGER_NOT_NULL,
        ${USER_RESPONSES_TABLE_FIELDS.start_location} TEXT NOT NULL,
        ${USER_RESPONSES_TABLE_FIELDS.end_location} TEXT NOT NULL,
        FOREIGN KEY (${USER_RESPONSES_TABLE_FIELDS.first_name_last_initial}) REFERENCES ${MEETINGS_TABLE}(${MEETINGS_TABLE_FIELDS.id})
    );

    INSERT INTO ${MEETINGS_TABLE} (${MEETINGS_TABLE_FIELDS.name}) VALUES ('${MAIN_MEETING.name}');
`;

db.exec(sqlInitDb);

export function getInitialSelections(firstName, lastInitial) {
    const firstNameLastInitial = `${firstName}_${lastInitial}`;

    const sql = `
    SELECT 
        ${USER_RESPONSES_TABLE_FIELDS.time_zone},
        ${USER_RESPONSES_TABLE_FIELDS.start_time},
        ${USER_RESPONSES_TABLE_FIELDS.end_time},
        ${USER_RESPONSES_TABLE_FIELDS.start_location},
        ${USER_RESPONSES_TABLE_FIELDS.end_location}
    FROM ${USER_RESPONSES_TABLE}
    WHERE ${USER_RESPONSES_TABLE_FIELDS.first_name_last_initial} = '${firstNameLastInitial}'
    `;

    const stmt = db.prepare(sql);
    const rows = stmt.all();
    console.log("FETCHED ROWS:");
    console.log(rows);
    return rows;
}