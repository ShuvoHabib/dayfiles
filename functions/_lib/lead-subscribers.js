const D1_BINDING = 'DAYFILES_EMAIL_SUBSCRIBERS_DB';
const TABLE_NAME = 'email_subscribers';

let bootstrapPromise;

function normalizeStatement(sql) {
  return sql.replace(/\s+/g, ' ').trim();
}

export function getLeadSubscribersDb(env) {
  return env?.[D1_BINDING] ?? null;
}

export async function ensureLeadSubscribersTable(db) {
  if (!db) {
    throw new Error('Missing D1 binding for lead subscribers.');
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const statements = [
        `
          CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            lead_magnet_id TEXT NOT NULL DEFAULT 'site-wide-footer',
            source_path TEXT,
            client_id TEXT,
            consent_granted INTEGER NOT NULL DEFAULT 0,
            delivery_status TEXT NOT NULL DEFAULT 'subscribed',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(email, lead_magnet_id)
          )
        `,
        `CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_created_at ON ${TABLE_NAME}(created_at DESC)`,
        `CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_lead_magnet_id ON ${TABLE_NAME}(lead_magnet_id)`
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

export async function saveLeadSubscriber(db, subscriber) {
  await ensureLeadSubscribersTable(db);

  const statement = normalizeStatement(`
    INSERT INTO ${TABLE_NAME} (
      email,
      lead_magnet_id,
      source_path,
      client_id,
      consent_granted,
      delivery_status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(email, lead_magnet_id) DO UPDATE SET
      source_path = excluded.source_path,
      client_id = COALESCE(excluded.client_id, ${TABLE_NAME}.client_id),
      consent_granted = CASE
        WHEN excluded.consent_granted = 1 THEN 1
        ELSE ${TABLE_NAME}.consent_granted
      END,
      delivery_status = excluded.delivery_status,
      updated_at = CURRENT_TIMESTAMP
  `);

  await db
    .prepare(statement)
    .bind(
      subscriber.email,
      subscriber.leadMagnetId,
      subscriber.sourcePath,
      subscriber.clientId,
      subscriber.consentGranted ? 1 : 0,
      subscriber.deliveryStatus ?? 'subscribed'
    )
    .run();
}

export { D1_BINDING, TABLE_NAME };
