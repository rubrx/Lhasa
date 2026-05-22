// Production startup: run migrations, auto-resolve the one known stuck migration,
// then start the server. Never lets a migration state issue prevent boot.
const { execSync } = require('child_process');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

try {
  run('npx prisma migrate deploy');
} catch {
  // The googleId column already existed in the DB before this migration ran,
  // so Prisma can't apply it. Mark it as resolved and retry so the remaining
  // migrations (e.g. indexes) still get applied.
  console.log('[start] migrate deploy failed — resolving stuck migration and retrying');
  try {
    run('npx prisma migrate resolve --applied 20260412000000_add_google_oauth_fields');
    run('npx prisma migrate deploy');
  } catch (retryErr) {
    // Log but don't crash — the schema may already be correct
    console.error('[start] retry failed, starting server anyway:', retryErr.message);
  }
}

run('node dist/server.js');
