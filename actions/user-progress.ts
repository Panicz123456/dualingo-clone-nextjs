"use server";

import db from "@/db/drizzle";
import { getCoursesById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
  // Pobieramy ID zalogowanego użytkownika z Clerk Auth
  const { userId } = await auth();
  // Pobieramy dane zalogowanego użytkownika
  const user = await currentUser();

  // Sprawdzamy czy użytkownik jest zalogowany
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // Pobieramy kurs o podanym ID z bazy danych
  const course = await getCoursesById(courseId);

  // Sprawdzamy czy kurs istnieje
  if (!course) {
    throw new Error("Course not fount");
  }

  // TODO: włączyć gdy zostaną dodane jednostki i lekcje
  // Sprawdza czy kurs ma jakieś jednostki i lekcje
  // if(!course.units.length || !course.units[0].lesson.length) {
  //     throw new Error ("Course is Empty")
  // }

  // Pobieramy aktualny postęp użytkownika z bazy danych
  const existingUserProgress = await getUserProgress();

  // Jeśli użytkownik ma już jakiś postęp (rekord w bazie)
  // aktualizujemy jego activeCourseId na nowo wybrany kurs
  // Jeśli użytkownik ma już istniejący postęp w bazie danych,
  // aktualizujemy jego:
  // - aktywny kurs na nowo wybrany (courseId)
  // - nazwę użytkownika na imię z Clerk (lub "User" jeśli brak)
  // - zdjęcie profilowe na zdjęcie z Clerk (lub domyślną maskotkę)
  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  // Jeśli użytkownik nie ma jeszcze postępu w bazie danych,
  // tworzymy nowy rekord zawierający:
  // - ID użytkownika z Clerk
  // - ID aktywnego kursu
  // - nazwę użytkownika (imię z Clerk lub "User")
  // - zdjęcie profilowe (z Clerk lub domyślną maskotkę)
  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg",
  });

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};
