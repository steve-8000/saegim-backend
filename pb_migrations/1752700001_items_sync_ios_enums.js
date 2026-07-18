/// <reference path="../pb_data/types.d.ts" />

// items.kind/category select 옵션을 iOS enum과 정합화한다.
// ItemKind에 `note`(07 §0 "적히는 순간 죽지 않는다" 폴백), Category에 `memo`/`diary` 추가.
// 비파괴적 — 옵션 추가일 뿐이라 기존 행의 값은 모두 유효하게 유지된다.
migrate((app) => {
  const collection = app.findCollectionByNameOrId("items");
  collection.fields.getByName("kind").values = ["todo", "schedule", "routine", "note"];
  collection.fields.getByName("category").values = [
    "appointment", "exercise", "daily", "record", "family", "work", "chore", "memo", "diary", "uncategorized",
  ];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("items");
  collection.fields.getByName("kind").values = ["todo", "schedule", "routine"];
  collection.fields.getByName("category").values = [
    "appointment", "exercise", "daily", "record", "family", "work", "chore", "uncategorized",
  ];
  return app.save(collection);
});
