# Security Specification & Dirty Dozen Payloads

## 1. Data Invariants
1. **No Public PII Exposure**: `users`, `job_applications`, `applicationFiles`, and `supportMessages` contain personal data (`email`, `phone`, `city`, `coverLetter`, `cvDownloadUrl`) and MUST NEVER be readable by unauthenticated users or non-admin peers.
2. **Identity Integrity**: Every user-created document (`users/{uid}`, `favorites`, `job_applications`, `applicationFiles`, `supportMessages`) MUST bind its owner UID field strictly to `request.auth.uid`, with `request.auth.token.email_verified == true`.
3. **Immutable Audit & Ownership Fields**: `applicantUid`, `createdAt`, `registeredAt`, and `senderUid` MUST never change after creation.
4. **Admin Privilege Isolation**: Non-admins CANNOT create or modify `/admins/{uid}`, `/vacancies/{vacancyId}`, or update another applicant's application status (`pending` -> `under_review` / `shortlisted` / `rejected`).
5. **Strict Timestamp & Schema Validation**: All `createdAt`/`updatedAt`/`savedAt` timestamps MUST equal `request.time`. All strings, numbers, booleans, CV file constraints (5MB max; PDF/DOC/DOCX/PNG/JPG only), and enums MUST pass `isValid*()` size/type/regex checks with `hasOnly` key allowlists to block shadow fields.
6. **Query Enforcer (`allow list`)**: Non-admin list queries on `/job_applications` and `/supportMessages` MUST evaluate `resource.data.applicantUid == request.auth.uid` (or `senderUid == request.auth.uid`) directly in rules.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Application Read**: Unauthenticated `get` / `list` on `/job_applications` -> `PERMISSION_DENIED`.
2. **Cross-Applicant PII Snooping**: Authenticated Applicant A attempting `get` on `/job_applications/{appOfB}` -> `PERMISSION_DENIED`.
3. **Blanket List Query Scraping**: Authenticated Applicant A running `list` on `/job_applications` without `where('applicantUid', '==', uidA)` -> `PERMISSION_DENIED`.
4. **Identity Spoofing on Create**: Applicant A submitting `/job_applications/{id}` with `applicantUid: "uidB"` -> `PERMISSION_DENIED`.
5. **Status Shortcutting on Create**: Applicant A submitting `/job_applications/{id}` with `status: "shortlisted"` instead of `"pending"` -> `PERMISSION_DENIED`.
6. **Shadow Field Injection**: Applicant A submitting `/job_applications/{id}` with extra field `isAdminApproved: true` -> `PERMISSION_DENIED`.
7. **Self-Service Status Escalation**: Applicant A updating their own `/job_applications/{id}` to `status: "shortlisted"` -> `PERMISSION_DENIED`.
8. **Privilege Escalation to Admin**: Applicant A attempting `create` on `/admins/{uidA}` -> `PERMISSION_DENIED`.
9. **Spoofed Unverified Email Admin Claim**: User with `email: "sirrodstephen@gmail.com"` and `email_verified: false` attempting admin read -> `PERMISSION_DENIED`.
10. **Fake Vacancy Injection**: Non-admin attempting `create` on `/vacancies/{id}` -> `PERMISSION_DENIED`.
11. **Path ID Poisoning / DoW**: Submitting doc ID with 500-char junk or slashes `/job_applications/bad$$$id` -> `PERMISSION_DENIED`.
12. **Client Timestamp Forgery**: Submitting `createdAt` with a backdated client timestamp instead of `request.time` -> `PERMISSION_DENIED`.
