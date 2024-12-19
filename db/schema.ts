import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";


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
}));

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
