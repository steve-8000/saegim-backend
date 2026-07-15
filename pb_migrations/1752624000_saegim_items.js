/// <reference path="../pb_data/types.d.ts" />

// Sync collection for Saegim `Item` records (00 §7, Phase 4 scope note:
// schema only — the iOS Sync API client itself is deferred pending an
// external prerequisite decision on conflict/auth flow, tracked in
// docs/plan/02-development-plan.md §6 Phase 4).
migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "items",
    listRule: "@request.auth.id != '' && owner = @request.auth.id",
    viewRule: "@request.auth.id != '' && owner = @request.auth.id",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != '' && owner = @request.auth.id",
    deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
    fields: [
      { name: "owner", type: "relation", required: true, collectionId: "_pb_users_auth_", maxSelect: 1 },
      { name: "kind", type: "select", required: true, maxSelect: 1, values: ["todo", "schedule", "routine"] },
      { name: "title", type: "text", required: true, max: 500 },
      { name: "rawInputText", type: "text", required: true, max: 2000 },
      { name: "startAt", type: "date" },
      { name: "endAt", type: "date" },
      { name: "category", type: "select", maxSelect: 1, values: [
        "appointment", "exercise", "daily", "record", "family", "work", "chore", "uncategorized",
      ] },
      { name: "completedAt", type: "date" },
      { name: "rawJSON", type: "json" },
    ],
  });
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("items");
  return app.delete(collection);
});
