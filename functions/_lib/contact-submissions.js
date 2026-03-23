const D1_BINDING = 'DAYFILES_EMAIL_SUBSCRIBERS_DB';
const TABLE_NAME = 'contact_submissions';

let bootstrapPromise;

function normalizeStatement(sql) {
  return sql.replace(/\s+/g, ' ').trim();
}

export function getContactSubmissionsDb(env) {
  return env?.[D1_BINDING] ?? null;
}

export async function ensureContactSubmissionsTable(db) {
  if (!db) {
    throw new Error('Missing D1 binding for contact submissions.');
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const statements = [
        `
          CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            topic TEXT NOT NULL DEFAULT '',
            message TEXT NOT NULL,
            source_path TEXT,
            client_id TEXT,
            delivery_status TEXT NOT NULL DEFAULT 'skipped',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        `CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_created_at ON ${TABLE_NAME}(created_at DESC)`,
        `CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_client_id ON ${TABLE_NAME}(client_id)`,
        `CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_email ON ${TABLE_NAME}(email)`
      ];

      for (const statement of statements) {
        await db.prepare(normalizeStatement(statement)).run();
      }
    })().catch((error) => {
      bootstrapPromise = undefined;
      throw error;
    });
  }

  await bootstrapPromise;
}

export async function saveContactSubmission(db, submission) {
  await ensureContactSubmissionsTable(db);

  const statement = normalizeStatement(`
    INSERT INTO ${TABLE_NAME} (
      name,
      email,
      topic,
      message,
      source_path,
      client_id,
      delivery_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  await db
    .prepare(statement)
    .bind(
      submission.name,
      submission.email,
      submission.topic,
      submission.message,
      submission.sourcePath,
      submission.clientId,
      submission.deliveryStatus ?? 'skipped'
    )
    .run();
}

export async function countRecentContactSubmissions(db, clientId, windowMinutes) {
  await ensureContactSubmissionsTable(db);

  if (!clientId) {
    return 0;
  }

  const statement = normalizeStatement(`
    SELECT COUNT(*) AS total
    FROM ${TABLE_NAME}
    WHERE client_id = ?
      AND created_at >= datetime('now', ?)
  `);

  const result = await db
    .prepare(statement)
    .bind(clientId, `-${Math.max(1, windowMinutes)} minutes`)
    .first();

  return Number(result?.total || 0);
}

export { D1_BINDING, TABLE_NAME };
