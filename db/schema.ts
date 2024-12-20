import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";

// Definiuje tabelę "curses" w bazie danych PostgreSQL:
export const curses = pgTable("curses", {
  // Kolumna id - automatycznie inkrementowane pole będące kluczem głównym
  id: serial("id").primaryKey(),
  // Kolumna title - tekst, który nie może być pusty (NOT NULL)
  title: text("title").notNull(),
  // Kolumna image_src - tekst przechowujący ścieżkę do obrazka, nie może być pusty
  imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(curses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  // onDelete: "cascade" oznacza, że gdy kurs zostanie usunięty, wszystkie powiązane z nim jednostki również zostaną usunięte
  courseId: integer("course_id")
    .references(() => curses.id, { onDelete: "cascade" })
    .notNull(), // Referencja do kursu, do którego należy ta jednostka
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(curses, {
    fields: [units.courseId],
    references: [curses.id],
  }),
  lesson: many(lesson),
}));

export const lesson = pgTable("lesson", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

export const lessonRelations = relations(lesson, ({ one, many }) => ({
  unit: one(units, {
    fields: [lesson.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lesson.id, { onDelete: "cascade" })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ many, one }) => ({
  lesson: one(lesson, {
    fields: [challenges.lessonId],
    references: [lesson.id],
  }),
  challengesOptions: many(challengesOptions),
  challengesProgress: many(challengesProgress),
}));

export const challengesOptions = pgTable("challenges_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengesOptionsRelations = relations(
  challengesOptions,
  ({ one }) => ({
    challenges: one(challenges, {
      fields: [challengesOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengesProgress = pgTable("challenges_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengesProgressRelations = relations(
  challengesProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengesProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

// Definiuje tabelę "user_progress" w bazie danych PostgreSQL:
export const userProgress = pgTable("user_progress", {
  // Kolumna user_id - tekst będący kluczem głównym, identyfikuje użytkownika
  userId: text("user_id").primaryKey(),
  // Kolumna user_name - nazwa użytkownika, domyślnie "User"
  userName: text("user_name").notNull().default("User"),
  // Kolumna user_image_src - ścieżka do avatara użytkownika, domyślnie "/mascot.svg"
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  // Kolumna active_course_id - klucz obcy do tabeli curses, wskazuje aktywny kurs
  // onDelete: "cascade" oznacza że przy usunięciu kursu, usuwane są też powiązane rekordy
  activeCourseId: integer("active_course_id").references(() => curses.id, {
    onDelete: "cascade",
  }),
  // Kolumna hearts - liczba żyć użytkownika, domyślnie 5
  hearts: integer("hearts").notNull().default(5),
  // Kolumna point - liczba punktów użytkownika, domyślnie 0
  point: integer("point").notNull().default(0),
});

// Ten kod definiuje relację jeden-do-jednego (one-to-one) między tabelami userProgress i curses:
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  // activeCourse - nazwa relacji, która będzie używana w zapytaniach
  activeCourse: one(curses, {
    // fields - określa kolumnę w tabeli userProgress, która jest kluczem obcym
    fields: [userProgress.activeCourseId],
    // references - określa kolumnę w tabeli curses, do której odnosi się klucz obcy
    references: [curses.id],
  }),
}));
