---
name: 04-baseline-performance
description: Strict constraints for detecting performance bottlenecks, memory leaks, and inefficient resource utilization.
version: 1.0.0
---

# ⚡ Baseline Performance Constraints

Your objective in this phase is to ensure the code scales efficiently and does not degrade system resources. You MUST scan the diff for the following performance anti-patterns. If ANY of these signatures are found, flag them as a `[BLOCKER]`.

## 1. The N+1 Query Ban (Database Efficiency)

- **Mandate:** You are strictly FORBIDDEN from passing code that executes database queries or network requests sequentially inside a loop.
- **Signature to detect:** An `await` keyword inside a `for...of` loop, a `while` loop, or inside a `.map()` callback wrapped in `Promise.all()` where the inner promise is an ORM call (e.g., `prisma.user.findUnique`, `repository.findOne`).
  ```typescript
  // Flag this immediately as a [BLOCKER]:
  for (const id of userIds) {
    const user = await db.users.find(id); // N+1 Query
  }
  ```
- **Mandatory Fix:** Demand batch querying using SQL `IN` clauses (e.g., Prisma `in`, TypeORM `In`, or MongoDB `$in`) to fetch all records in a single round-trip.

## 2. Event Loop Blocking (Node.js/Async Mandate)

- **Mandate:** Node.js is single-threaded. Flag any synchronous I/O or heavy cryptographic operation executed within a request lifecycle (controllers, middlewares, or route handlers).
- **Signature to detect:** Usage of `fs.readFileSync`, `fs.writeFileSync`, `crypto.pbkdf2Sync`, or `bcrypt.hashSync`.
- **Mandatory Fix:** Demand the asynchronous, Promise-based equivalent (e.g., `fs.promises.readFile`, `bcrypt.hash`).
- **Exception:** Synchronous methods are ONLY permitted in initial startup configuration scripts (e.g., loading `.env` before `app.listen()`).

## 3. Memory Leaks & Resource Exhaustion

- **Mandate:** Flag resources that are opened, listened to, or interval-triggered without explicit cleanup mechanisms.
- **Signature to detect:** - `setInterval()` without a corresponding `clearInterval()`.
  - `.on()` or `.addEventListener()` inside components or functions that mount/run multiple times without a corresponding `.off()` or `.removeEventListener()`.
  - Unclosed database cursors or file streams.
- **Mandatory Fix:** Demand the implementation of a cleanup phase (e.g., returning a cleanup function in a React `useEffect`, or using `finally` blocks to close streams).

## 4. Algorithmic Complexity (The O(N²) Ban)

- **Mandate:** Flag nested loops iterating over data structures that could scale infinitely.
- **Signature to detect:** Using `.find()`, `.filter()`, or `.includes()` inside another `.map()` or `for` loop over two separate arrays.
  ```typescript
  // Flag this O(N^2) operation as a [BLOCKER] for large datasets:
  const enrichedUsers = users.map((user) => {
    const role = roles.find((r) => r.id === user.roleId);
    return { ...user, role };
  });
  ```
- **Mandatory Fix:** Demand the creation of a Lookup Map (`Map` or `Record<string, any>`) or a `Set` before the loop to reduce the time complexity to O(N).

## 5. Over-fetching (Payload Size)

- **Mandate:** Flag database queries that fetch entire rows when only a subset of fields is required by the business logic or returned to the client.
- **Signature to detect:** `SELECT *` in raw SQL, or omitting the `select` clause in ORMs when the function clearly only utilizes 1-2 fields (e.g., returning only `email` but fetching the whole user object including password hashes).
- **Mandatory Fix:** Demand explicit field projection/selection (e.g., `select: { id: true, email: true }`).
