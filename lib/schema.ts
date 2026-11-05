import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core"

/** Tracks per-learner progress for each course slug */
export const learningActivity = pgTable("learning_activity", {
  id: varchar("id", { length: 255 }).primaryKey(),
  learnerId: varchar("learner_id", { length: 255 }).notNull(),
  courseSlug: varchar("course_slug", { length: 255 }).notNull(),
  progress: integer("progress").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(0),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type LearningActivity = typeof learningActivity.$inferSelect
export type NewLearningActivity = typeof learningActivity.$inferInsert
