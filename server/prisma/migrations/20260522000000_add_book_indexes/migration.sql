-- Composite index: covers getApprovedBooks and getPendingBooks
-- Both filter by adminCheck and order by createdAt DESC
CREATE INDEX IF NOT EXISTS "Book_adminCheck_createdAt_idx"
  ON "Book" ("adminCheck", "createdAt" DESC);

-- Composite index: covers getMyBooks (seller dashboard)
-- Filters by sellerId, orders by createdAt DESC
CREATE INDEX IF NOT EXISTS "Book_sellerId_createdAt_idx"
  ON "Book" ("sellerId", "createdAt" DESC);

-- Composite index: covers getBookById
-- Filters by id (PK) + adminCheck status check
CREATE INDEX IF NOT EXISTS "Book_id_adminCheck_idx"
  ON "Book" ("id", "adminCheck");
