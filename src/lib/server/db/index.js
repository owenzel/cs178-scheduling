import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';

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
`;

db.exec(sqlCreateTables);

const sqlTestTables = `SELECT * FROM ${MEETINGS_TABLE} LIMIT 1`;
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
    WHERE ${USER_RESPONSES_TABLE_FIELDS.first_name_last_initial} = '${firstNameLastInitial}'
    `;

    const stmt = db.prepare(sql);
    const rows = stmt.all();
    console.log("FETCHED ROWS:");
    console.log(rows);
    return rows;
}

export function putSelections(firstName, lastInitial, selection) {
    const firstNameLastInitial = `${firstName}_${lastInitial}`;
    const TIME_ZONE = 'EST';

    const sql = `
    INSERT INTO ${USER_RESPONSES_TABLE} (
        ${USER_RESPONSES_TABLE_FIELDS.meeting_id},
        ${USER_RESPONSES_TABLE_FIELDS.first_name_last_initial},
        ${USER_RESPONSES_TABLE_FIELDS.time_zone},
        ${USER_RESPONSES_TABLE_FIELDS.row},
        ${USER_RESPONSES_TABLE_FIELDS.column},
        ${USER_RESPONSES_TABLE_FIELDS.start_location},
        ${USER_RESPONSES_TABLE_FIELDS.end_location},
    )
    VALUES
    (
        ${MAIN_MEETING.id},
        '${firstNameLastInitial}',
        '${TIME_ZONE}',
        '${selection.row}',
        '${selection.column}',
        '${selection.start_location}',
        '${selection.end_location}',
    )
    `;

    // TODO: Handle success/failure
    db.exec(sql);
}