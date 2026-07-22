/// <reference path="../pb_data/types.d.ts" />

// Per-user share subdomains (justsend). Each public share may carry a random
// `subdomain` token; saegim-share-pod serves {token}.share.justsend.cloud by
// resolving it to this record. Also opens `deleteRule` so the app's "공유 중지"
// can revoke a share (delete the record → the link dies). The record id and the
// subdomain token are both unguessable, matching the existing public createRule.
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shares");
  collection.fields.add(new Field({
    name: "subdomain",
    type: "text",
    max: 64,
    pattern: "^[a-z0-9]{6,64}$",
  }));
  collection.deleteRule = "";
  collection.indexes.push(
    "CREATE UNIQUE INDEX `idx_shares_subdomain` ON `shares` (`subdomain`) WHERE `subdomain` != ''"
  );
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shares");
  collection.fields.removeByName("subdomain");
  collection.deleteRule = null;
  collection.indexes = collection.indexes.filter((idx) => !idx.includes("idx_shares_subdomain"));
  return app.save(collection);
});
