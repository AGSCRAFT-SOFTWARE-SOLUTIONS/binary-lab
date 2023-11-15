import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  bigint,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

export const role = pgEnum("role", ["admin", "teacher", "student"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  phone: text("phone"),
  location: text("location").notNull(),
  institute: text("institute").notNull(),
  name: text("name").notNull(),
  role: role("role").default("student"),
});

export const userRelations = relations(users, ({ many }) => ({
  userCourses: many(userCourses),
  userChapters: many(userChapters),
  certificates: many(certificates),
}));

export const credentials = pgTable("credentials", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  hashedPassword: text("hashed_password"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
});

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  thumbnailLink: text("thumbnail_link").notNull(),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const courseRelations = relations(courses, ({ many }) => ({
  chapters: many(chapters),
  userCourses: many(userCourses),
}));

export const chapters = pgTable("chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id"),
  title: text("title").notNull(),
  videoLink: text("video_link").notNull(),
  descriptionFileLink: text("description_file_link").notNull(),
  thumbnailLink: text("thumbnail_link").notNull(),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  tasks: text("tasks"),
});

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  userChapters: many(userChapters),
}));

export const userCourses = pgTable("user_courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  courseId: uuid("course_id"),
  progress: integer("progress"),
  purchasedDate: timestamp("purchased_date").defaultNow(),
  paymentMethod: text("payment_method"),
});

export const userCoursesRelations = relations(userCourses, ({ one }) => ({
  user: one(users, { fields: [userCourses.userId], references: [users.id] }),
  course: one(courses, {
    fields: [userCourses.courseId],
    references: [courses.id],
  }),
}));

export const userChapters = pgTable("user_chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  chapterId: uuid("chapter_id"),
  completed: boolean("completed").default(false),
  completionDate: timestamp("completion_date"),
});

export const userChaptersRelations = relations(userChapters, ({ one }) => ({
  user: one(users, { fields: [userChapters.userId], references: [users.id] }),
  chapter: one(chapters, {
    fields: [userChapters.chapterId],
    references: [chapters.id],
  }),
}));

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  link: text("link"),
});

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
}));
