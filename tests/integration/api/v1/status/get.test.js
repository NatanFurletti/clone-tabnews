test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const maxConnections = responseBody.dependencies.database.max_connections;
  expect(maxConnections).toBe(100);

  const openedConnectionsValue =
    responseBody.dependencies.database.opened_connections;
  expect(openedConnectionsValue).toBe(1);

  const databaseVersion = responseBody.dependencies.database.version;
  expect(databaseVersion).toBe("16.0");
});
