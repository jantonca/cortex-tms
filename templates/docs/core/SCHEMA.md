# Schema: Data Models & Relationships

<!-- This file documents your data models, database schema, and type definitions. -->
<!-- If your project doesn't use a database, you can document TypeScript types, API contracts, or state shape instead. -->

---

## Overview

**Database/Store Type**: [e.g., PostgreSQL, MongoDB, Redis, In-Memory]
**ORM/Query Tool**: [e.g., Prisma, TypeORM, Mongoose, Raw SQL]
**Schema Migration Strategy**: [e.g., Prisma Migrate, TypeORM migrations, Alembic]

---

## Core Entities

<!-- List your main data entities/tables/collections. For each, document: -->
<!-- - Purpose (what it represents) -->
<!-- - Key fields -->
<!-- - Relationships to other entities -->

### [Entity Name 1: e.g., User]

**Purpose**: [e.g., Stores user account information and authentication data]

**Fields**:

| Field | Type | Required | Default | Notes |
|:------|:-----|:---------|:--------|:------|
| `id` | [e.g., UUID, Integer] | Yes | Auto-generated | Primary key |
| `email` | [e.g., String] | Yes | - | Unique, validated |
| `passwordHash` | [e.g., String] | Yes | - | bcrypt hashed |
| `createdAt` | [e.g., Timestamp] | Yes | NOW() | UTC timezone |
| `updatedAt` | [e.g., Timestamp] | Yes | NOW() | Auto-updated |

**Relationships**:
- [e.g., One User has many Posts (1:N)]
- [e.g., One User belongs to one Organization (N:1)]

**Indexes**:
- [e.g., `email` (unique)]
- [e.g., `createdAt` (for sorting)]

**Validation Rules**:
- [e.g., Email must match regex pattern]
- [e.g., Password minimum 8 characters]

---

### [Entity Name 2: e.g., Post]

**Purpose**: [e.g., User-generated content items]

**Fields**:

| Field | Type | Required | Default | Notes |
|:------|:-----|:---------|:--------|:------|
| `id` | [Type] | Yes | Auto-generated | Primary key |
| `userId` | [Type] | Yes | - | Foreign key → User.id |
| `title` | [String] | Yes | - | Max 200 chars |
| `content` | [Text] | Yes | - | Markdown supported |
| `publishedAt` | [Timestamp] | No | NULL | NULL = draft |

**Relationships**:
- [e.g., One Post belongs to one User (N:1)]
- [e.g., One Post has many Comments (1:N)]

**Indexes**:
- [e.g., `userId` (for user's posts lookup)]
- [e.g., `publishedAt` (for recent posts)]

---

## Relationships

<!-- Document complex relationships, especially Many-to-Many (N:M) -->

### [Relationship Name: e.g., User ↔ Role (Many-to-Many)]

**Join Table**: [e.g., `user_roles`]

**Fields**:

| Field | Type | Required | Notes |
|:------|:-----|:---------|:------|
| `userId` | [Type] | Yes | FK → User.id |
| `roleId` | [Type] | Yes | FK → Role.id |
| `assignedAt` | [Timestamp] | Yes | When role was granted |

**Constraints**:
- [e.g., Unique constraint on (userId, roleId) - prevent duplicates]

---

## Enums & Constants

<!-- Document any enum types or constant values used in the schema -->

### [Enum Name: e.g., UserStatus]

**Values**:
- `ACTIVE` - [e.g., User can log in]
- `SUSPENDED` - [e.g., Temporarily blocked]
- `DELETED` - [e.g., Soft-deleted account]

**Storage**: [e.g., Stored as String in database]

---

## TypeScript Types

<!-- If using TypeScript, document your type definitions -->
<!-- This is especially important for frontend state or API contracts -->

### [Type Name: e.g., UserProfile]

**Purpose**: [e.g., Client-side user profile (excludes sensitive fields)]

```typescript
interface UserProfile {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: Date
  // Note: passwordHash is NOT included (security)
}
```

**Derived From**: [e.g., Database User entity, with passwordHash excluded]

---

## Migration History

<!-- Track significant schema changes -->

### [Date: e.g., 2026-01-15] - [Change: e.g., Add User.avatarUrl field]

**Reason**: [e.g., Support profile pictures]
**Migration File**: [e.g., `migrations/20260115_add_avatar_url.sql`]
**Breaking Change**: [Yes/No]

---

### [Date: e.g., 2026-01-20] - [Change: e.g., Split User table into User + UserProfile]

**Reason**: [e.g., Separate auth data from profile data]
**Migration File**: [e.g., `migrations/20260120_split_user_profile.sql`]
**Breaking Change**: Yes
**Rollback Plan**: [e.g., Reverse migration available in same file]

---

## Data Flow Diagrams

<!-- Optional: Visual representations of how data moves through the system -->

### [Flow Name: e.g., User Registration]

```
1. User submits email + password
   ↓
2. Hash password with bcrypt
   ↓
3. INSERT into User table
   ↓
4. Send verification email
   ↓
5. Create UserProfile record
```

---

## Validation Rules

<!-- Document business logic constraints that aren't enforced at the DB level -->

### [Rule: e.g., Post Publishing]

**Condition**: User can only publish a post if:
- Post.title length >= 10 characters
- User.status === 'ACTIVE'
- User has 'PUBLISHER' role

**Enforcement Location**: [e.g., `src/services/postService.ts`]

---

## Performance Considerations

### Query Patterns

**Most Common Queries**:
1. [e.g., `SELECT * FROM posts WHERE userId = ? ORDER BY publishedAt DESC LIMIT 20`]
2. [e.g., `SELECT * FROM users WHERE email = ?`]

**Indexes Supporting These**:
- [e.g., Index on `posts.userId` + `posts.publishedAt`]
- [e.g., Unique index on `users.email`]

### Expected Scale

**Projected Data Volume** (Year 1):
- [e.g., Users: ~10,000]
- [e.g., Posts: ~100,000]
- [e.g., Comments: ~500,000]

**Growth Strategy**: [e.g., Partition posts table by year after 1M records]

---

## Security Considerations

### Sensitive Fields

**Never expose in API responses**:
- `User.passwordHash`
- [e.g., `User.resetToken`]
- [e.g., `Payment.cardNumber` (store only last 4 digits)]

**Encryption at Rest**:
- [e.g., `User.email` - encrypted in production DB]

---

## AI Agent Notes

**When generating database queries**:
- ⚠️ Always use parameterized queries (prevent SQL injection)
- ⚠️ All timestamps are stored in UTC (convert to user timezone in frontend)
- ⚠️ Soft deletes: Check `deletedAt IS NULL` in WHERE clauses

**Common Mistakes to Avoid**:
- ❌ Don't use `SELECT *` in production code (explicit columns only)
- ❌ Don't expose `passwordHash` in any API response
- ❌ Don't perform N+1 queries (use JOINs or eager loading)

---

## References

- **ORM Documentation**: [Link to Prisma/TypeORM/etc. docs]
- **Database Docs**: [Link to PostgreSQL/MongoDB/etc. docs]
- **Migration Guide**: [Link to your migration strategy doc]

<!-- @cortex-tms-version 2.5.0 -->
