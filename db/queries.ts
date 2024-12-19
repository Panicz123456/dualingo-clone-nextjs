import { cache } from "react";
import db from "./drizzle";

// ta funkcja pobiera wszystkie kursy z bazy danych
export const getCourses = cache(async () => {
  // db.query.curses.findMany() pobiera wszystkie rekordy z tabeli 'curses'
  const data = await db.query.curses.findMany();
  return data;
});
