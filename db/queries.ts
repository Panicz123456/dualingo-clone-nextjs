import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { curses, userProgress } from "./schema";

//funkcja pobiera wszytskie userProgress z bazy danych
export const getUserProgress = cache(async () => {
  // Pobiera ID zalogowanego użytkownika z Clerk Auth
  const { userId } = await auth();

  // Jeśli użytkownik nie jest zalogowany, zwraca null
  if (!userId) {
    return null;
  }

  // Pobiera pierwszy rekord z tabeli userProgress dla danego userId
  // wraz z powiązanym aktywnym kursem (relacja activeCourse)
  const data = await db.query.userProgress.findFirst({
    // Wyszukuje po userId użytkownika
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});
// ta funkcja pobiera wszystkie kursy z bazy danych
export const getCourses = cache(async () => {
  // db.query.curses.findMany() pobiera wszystkie rekordy z tabeli 'curses'
  const data = await db.query.curses.findMany();
  return data;
});

// Ta funkcja pobiera pojedynczy kurs z bazy danych na podstawie jego ID
export const getCoursesById = cache(async (courseId: number) => {
  // Używamy metody findFirst() aby znaleźć pierwszy (i jedyny) kurs o podanym ID
  const data = await db.query.curses.findFirst({
    // Używamy eq() do porównania id z tabeli curses z przekazanym courseId
    where: eq(curses.id, courseId),
    // TODO: W przyszłości zostanie dodane pobieranie powiązanych jednostek i lekcji
  });

  return data;
});
