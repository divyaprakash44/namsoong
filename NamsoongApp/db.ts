import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

// Enable promises for easier async/await syntax
enablePromise(true);

const DATABASE_NAME = 'Inscribe.db';

export type Highlight = {
  id: number;
  pdf_id: string; // We'll use the PDF file name or a unique ID
  page: number;
  text: string;
  timestamp: string;
};

// 1. Function to open or create the database
export const getDBConnection = async () => {
  return openDatabase({name: DATABASE_NAME, location: 'default'});
};

// 2. Function to create our 'highlights' table if it doesn't exist
export const createTables = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pdf_id TEXT NOT NULL,
      page INTEGER NOT NULL,
      text TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `;
  await db.executeSql(query);
};

// 3. Function to get all highlights for a specific PDF
export const getHighlights = async (
  db: SQLiteDatabase,
  pdfId: string,
): Promise<Highlight[]> => {
  try {
    const highlights: Highlight[] = [];
    const results = await db.executeSql(
      'SELECT * FROM highlights WHERE pdf_id = ? ORDER BY timestamp ASC',
      [pdfId],
    );
    // --- THIS IS THE FIX for the 'result' error ---
    results.forEach((result: any) => {
      for (let i = 0; i < result.rows.length; i++) {
        highlights.push(result.rows.item(i));
      }
    });
    return highlights;
  } catch (error) {
    console.error('Error getting highlights', error);
    throw error;
  }
};

// 4. Function to add a new highlight
export const addHighlight = async (
  db: SQLiteDatabase,
  pdfId: string,
  page: number,
  text: string,
) => {
  const insertQuery = `
    INSERT INTO highlights (pdf_id, page, text, timestamp)
    VALUES (?, ?, ?, ?)
  `;
  const timestamp = new Date().toISOString();
  await db.executeSql(insertQuery, [pdfId, page, text, timestamp]);
  console.log('Highlight added successfully!');
};

// 5. Main initialization function
export const initDatabase = async () => {
  try {
    const db = await getDBConnection();
    await createTables(db);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed', error);
  }
};
