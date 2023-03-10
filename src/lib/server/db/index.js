import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';

// CONCEPT: Editing: database functionality for saving and loading users' selections (and their associated locations)

/*
Database constants
*/
export const MAIN_MEETING = {
    id: '1',
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
    row: 'row',
    column: 'column',
    start_location: 'start_location',
    end_location: 'end_location',
};
// User time logs table constants
const USER_TIMING_TABLE = 'user_timing';
const USER_TIMING_TABLE_FIELDS = {
    id: 'id',
    first_name_last_initial: 'first_name_last_initial',
    start_time: 'start_time',
    end_time: 'end_time',
    time_elapsed_sec: 'time_elapsed_sec'
}

const db = new Database(DB_PATH, { verbose: console.log });

// Initialize the database: create a meetings and user responses table and insert a starter meeting (for the competition)
const sqlCreateTables = `
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
    ${USER_RESPONSES_TABLE_FIELDS.row} INTEGER NOT NULL,
    ${USER_RESPONSES_TABLE_FIELDS.column} INTEGER_NOT_NULL,
    ${USER_RESPONSES_TABLE_FIELDS.start_location} TEXT NOT NULL,
    ${USER_RESPONSES_TABLE_FIELDS.end_location} TEXT NOT NULL,
    FOREIGN KEY (${USER_RESPONSES_TABLE_FIELDS.meeting_id}) REFERENCES ${MEETINGS_TABLE}(${MEETINGS_TABLE_FIELDS.id})
);

CREATE TABLE IF NOT EXISTS ${USER_TIMING_TABLE} (
    ${USER_TIMING_TABLE_FIELDS.id} INTEGER PRIMARY KEY,
    ${USER_TIMING_TABLE_FIELDS.first_name_last_initial} TEXT NOT NULL,
    ${USER_TIMING_TABLE_FIELDS.start_time} INTEGER,
    ${USER_TIMING_TABLE_FIELDS.end_time} INTEGER,
    ${USER_TIMING_TABLE_FIELDS.time_elapsed_sec} INTEGER
);
`;

db.exec(sqlCreateTables);

const sqlTestTables = `SELECT * FROM ${MEETINGS_TABLE} LIMIT 1;`;
const testTablesStmt = db.prepare(sqlTestTables);
const testTablesRows = testTablesStmt.all();

if (testTablesRows.length == 0) {
    const sqlInsertStarterMeeting = `
        INSERT INTO ${MEETINGS_TABLE} (${MEETINGS_TABLE_FIELDS.id}, ${MEETINGS_TABLE_FIELDS.name}) VALUES (${MAIN_MEETING.id}, '${MAIN_MEETING.name}');
    `;

    db.exec(sqlInsertStarterMeeting);
}

export function getInitialSelections(firstName, lastInitial) {
    const firstNameLastInitial = `${firstName}_${lastInitial}`;

    const sql = `
    SELECT 
        ${USER_RESPONSES_TABLE_FIELDS.time_zone},
        ${USER_RESPONSES_TABLE_FIELDS.row},
        ${USER_RESPONSES_TABLE_FIELDS.column},
        ${USER_RESPONSES_TABLE_FIELDS.start_location},
        ${USER_RESPONSES_TABLE_FIELDS.end_location}
    FROM ${USER_RESPONSES_TABLE}
    WHERE ${USER_RESPONSES_TABLE_FIELDS.first_name_last_initial} = '${firstNameLastInitial}';
    `;

    const stmt = db.prepare(sql);
    const rows = stmt.all();
    console.log("FETCHED SELECTIONS:");
    console.log(rows);
    return rows;
}

export function updateSelections(selections) {
    // TODO: Update from hard coded value (if add support for time zones)
    const TIME_ZONE = 'EST';

    let sql = ``;

    // First item is just object with first name and last initial
    const firstItem = selections[0];
    const firstNameLastInitial = `${firstItem.first_name}_${firstItem.last_initial}`;

    // Remove original selections
    sql += `
    DELETE FROM ${USER_RESPONSES_TABLE} WHERE ${USER_RESPONSES_TABLE_FIELDS.first_name_last_initial} = '${firstNameLastInitial}';
    
    `;

    // Insert latest selections
    // Index from 1 b/c the first item is just the first name & last initial; others are actual selections
    for (let i = 1; i < selections.length; i++) {
        const selection = selections[i];

        sql += `
        INSERT INTO ${USER_RESPONSES_TABLE} (
            ${USER_RESPONSES_TABLE_FIELDS.meeting_id},
            ${USER_RESPONSES_TABLE_FIELDS.first_name_last_initial},
            ${USER_RESPONSES_TABLE_FIELDS.time_zone},
            ${USER_RESPONSES_TABLE_FIELDS.row},
            ${USER_RESPONSES_TABLE_FIELDS.column},
            ${USER_RESPONSES_TABLE_FIELDS.start_location},
            ${USER_RESPONSES_TABLE_FIELDS.end_location}
        ) VALUES (
            ${MAIN_MEETING.id},
            '${firstNameLastInitial}',
            '${TIME_ZONE}',
            ${selection.row},
            ${selection.column},
            '${selection.start_location}',
            '${selection.end_location}'
        );

        `;
    }

    // TODO: Handle success/failure
    db.exec(sql);
}

export function updateUserTiming(log) {
    const { first_name, last_initial, start_time, end_time, time_elapsed_sec } = log;

    const firstNameLastInitial = `${first_name}_${last_initial}`;

    let sql = ``;

    // Delete the existing time record
    sql += `
    DELETE FROM ${USER_TIMING_TABLE} WHERE ${USER_TIMING_TABLE_FIELDS.first_name_last_initial} = '${firstNameLastInitial}';
    
    `;

    sql += `
        INSERT INTO ${USER_TIMING_TABLE} (
            ${USER_TIMING_TABLE_FIELDS.first_name_last_initial},
            ${USER_TIMING_TABLE_FIELDS.start_time},
            ${USER_TIMING_TABLE_FIELDS.end_time},
            ${USER_TIMING_TABLE_FIELDS.time_elapsed_sec}
        ) VALUES (
            '${firstNameLastInitial}',
            ${start_time},
            ${end_time},
            ${time_elapsed_sec}
        );
    `;

    // TODO: Handle success/failure
    db.exec(sql);
}

export function getAllUserTiming() {
    let sql = `SELECT * FROM ${USER_TIMING_TABLE}`;
    const stmt = db.prepare(sql);
    const rows = stmt.all();
    return rows;
}
