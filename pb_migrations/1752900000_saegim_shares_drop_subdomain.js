/// <reference path="../pb_data/types.d.ts" />

// The per-user subdomain scheme was replaced by single-host path routing
// (share.justsend.cloud/p/{id} — the record id itself is the unguessable token),
// so the `subdomain` field and its unique index are now unused. Drop them.
// `deleteRule` stays open ("") — the app's "공유 중지" still revokes a share by
// deleting the record (the link dies).
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shares");
  collection.fields.removeByName("subdomain");
  collection.indexes = collection.indexes.filter((idx) => !idx.includes("idx_shares_subdomain"));
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shares");
  collection.fields.add(new Field({
    name: "subdomain",
    type: "text",
    max: 64,
    pattern: "^[a-z0-9]{6,64}$",
  }));
  collection.indexes.push(
    "CREATE UNIQUE INDEX `idx_shares_subdomain` ON `shares` (`subdomain`) WHERE `subdomain` != ''"
  );
  return app.save(collection);
});
