import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const databaseNameResult = await database.query("SELECT current_database();");
  const databaseName = databaseNameResult.rows[0].current_database;

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = databaseVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsResult.rows[0].max_connections;

  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnections = openedConnectionsResult.rows[0].count;

  res.status(200).json({
    updated_at: updatedAt,
    environment: process.env.VERCEL_ENV || "local",
    dependencies: {
      database: {
        project: process.env.DATABASE_PROJECT_NAME || "unknown",
        name: databaseName,
        version: databaseVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections,
      },
    },
  });
}

export default status;
