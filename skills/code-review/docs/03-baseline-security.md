---
name: 03-baseline-security
description: Strict constraints for detecting critical security vulnerabilities (Injection, AuthZ, Secrets).
version: 1.0.0
---

# 🛡️ Baseline Security Constraints

Your sole objective in this phase is to protect the system from malicious exploits. You MUST scan the diff for the following exact anti-patterns. If ANY of these signatures are found, immediately flag them as a `[BLOCKER]`.

## 1. Injection Vulnerabilities (The "String Concatenation" Ban)

- **Mandate:** You are strictly FORBIDDEN from passing code that constructs database queries, shell commands, or dynamic HTML by directly concatenating or interpolating untrusted user input.
- **Signature to detect:** Template literals or `+` operators used to insert variables into SQL/NoSQL queries or `exec()` commands.
  ```typescript
  // Flag this immediately as a [BLOCKER]:
  const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
  db.execute(query);
  ```
- **Mandatory Fix:** Demand parameterized queries (e.g., Prisma, TypeORM, or parameterized raw SQL like `$1`, `?`) or strict escaping utilities.

## 2. Hardcoded Secrets (The "Plaintext" Ban)

- **Mandate:** Flag any plaintext cryptographic materials, API keys, internal network IPs, passwords, or salts committed directly into the source code.
- **Signature to detect:** Variables named `*key*`, `*secret*`, `*token*`, or `*password*` assigned to static string literals (excluding obvious test mocks in test files).
- **Mandatory Fix:** Demand the use of Environment Variables (e.g., `process.env.SECRET_KEY`) or a secure Vault/Secret Manager.

## 3. Broken Access Control (The "AuthZ" Mandate)

- **Mandate:** Verify that endpoints or functions mutating data (POST, PUT, DELETE, or equivalent service layers) verify the _Permissions_ (Authorization), not just the _Identity_ (Authentication) of the user.
- **Signature to detect:** A route/function that accepts an entity ID to mutate (e.g., `deleteUser(req.params.id)`) but fails to verify if the requesting user `req.user.id` actually owns that entity or has `ADMIN` roles.
- **Mandatory Fix:** Demand an ownership check or Role-Based Access Control (RBAC) middleware before the database mutation occurs.

## 4. Prototype Pollution & Mass Assignment

- **Mandate:** Flag any code that blindly merges or assigns untrusted external payload objects directly into system state or database models without explicit field filtering.
- **Signature to detect:** Direct usage of `Object.assign(target, req.body)`, `lodash.merge({}, req.body)`, or saving `req.body` directly to an ORM without picking specific fields.
  ```typescript
  // Flag this as a [BLOCKER] for Mass Assignment / Prototype Pollution:
  await db.user.update(req.params.id, req.body);
  ```
- **Mandatory Fix:** Demand a strict Data Transfer Object (DTO) schema validation (e.g., Zod, Joi) or explicit property picking (e.g., `lodash.pick(req.body, ['name', 'email'])`).

## 5. XSS (Cross-Site Scripting) Prevention

- **Mandate:** If the PR touches frontend components (React, Vue) or template engines, flag any mechanism that bypasses the framework's native HTML escaping.
- **Signature to detect:** Usage of `dangerouslySetInnerHTML` in React, `v-html` in Vue, or direct `innerHTML` assignments in vanilla JS using unvalidated inputs.
