/// <reference path="../pb_data/types.d.ts" />

// Public share-card snapshots (00 §8, 02 §6 Phase 5). A share record is a
// READ-ONLY public snapshot — it never stores the owner's real contact name,
// only `shareAlias` (02 §5 ContactRef.shareAlias policy: "연락처 원본은
// 소유자 전용, 외부 공개 카드는 별칭만 노출"). No `attendeeName`/`ownerName`
// field exists in this schema at all, by design — the policy is enforced by
// the absence of the field, not by an access rule that could be bypassed.
//
// createRule is public for now: real Auth (Apple/Google Sign-In) is deferred
// pending OAuth credentials (Phase 4/5 scope note), so there is no session
// to gate creation on yet. Tracked as a follow-up once Auth lands.
migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "shares",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "kind", type: "select", required: true, maxSelect: 1, values: ["item", "story"] },
      { name: "title", type: "text", required: true, max: 200 },
      { name: "subtitle", type: "text", max: 200 },
      { name: "shareAlias", type: "text", max: 100 },
      { name: "locationName", type: "text", max: 200 },
    ],
  });
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shares");
  return app.delete(collection);
});
