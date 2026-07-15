# saegim-backend

Saegim(새김) iOS 앱의 PocketBase 백엔드 — `clab-cluster`에 ArgoCD GitOps로 배포된다.

## 구성

- `deploy/k8s/statefulset.yaml` — PocketBase StatefulSet (replica=1, SQLite 단일 writer 제약 — 00 §5.1).
- `deploy/k8s/service.yaml` — ClusterIP :8090.
- `deploy/k8s/ingress.yaml` — `api.saegim.clab.one`, traefik + cert-manager(letsencrypt-prod).
- `pb_migrations/` — 컬렉션 스키마(items). PocketBase가 부팅 시 자동 적용.
- `kustomization.yaml` — `pb_migrations/*.js`를 ConfigMap으로 마운트(내용 변경 시 자동 롤아웃, 이미지 빌드 불필요 — steve-8000/test-agents와 동일 패턴).

## 배포

ArgoCD `clab-app-root`(app-of-apps)가 `clab-one/clab-app` 저장소의 `argocd/applications/saegim-backend.yaml`을 통해 이 저장소를 자동 sync한다.

## 범위 밖 (Phase 4 계획 문서 명시)

- Google/Apple OAuth 자격증명(Auth provider 설정)은 외부 크리덴셜 발급 후 추가.
- litestream S3 백업 사이드카는 오브젝트 스토리지 버킷 크리덴셜 확보 후 추가.
- iOS Sync API 클라이언트(GRDB ↔ PocketBase 증분 동기화)는 후속 Phase.
