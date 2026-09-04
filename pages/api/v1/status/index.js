import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionVersion = databaseVersionResult.rows[0].server_version;
  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnectionsValue = openedConnectionsResult.rows[0].count;

  res.status(200).send({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnectionsValue,
      },
    },
  });
}

export default status;
