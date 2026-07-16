/// <reference path="../pb_data/types.d.ts" />

// Adds the display-ready `payload` JSON to share cards (약속 카드 / 스토리
// 카드 리치 렌더링). The payload carries ONLY pre-formatted display strings
// the sender chose to publish — never raw contact names, never coordinates:
//   {
//     dateText:  "7월 17일 (금)",       // pre-formatted, no timestamp
//     timeText:  "오후 3:00",
//     line:      "오늘 3가지를 해냈어요", // story auto-line
//     moments:   ["달리기", "장보기"],    // completed titles (sender-visible)
//     weather:   { icon: "rain", tempC: 26, precipProb: 60, headline: "비 소식" }
//   }
// The 02 §5/§8 privacy canon holds: person identity stays in `shareAlias`
// (alias only), place identity in `locationName` (public POI name only).
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shares");
  collection.fields.add(new Field({
    name: "payload",
    type: "json",
    maxSize: 4096,
  }));
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shares");
  collection.fields.removeByName("payload");
  return app.save(collection);
});
