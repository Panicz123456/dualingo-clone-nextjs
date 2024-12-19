"use client";

import { curses, userProgress } from "@/db/schema";
import { Card } from "./card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { upsertUserProgress } from "@/actions/user-progress";
import { toast } from "sonner";

type Props = {
  courses: (typeof curses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

// List to komponent React, który przyjmuje dwa parametry:
// - activeCourseId: numer ID aktywnego kursu
// - courses: tablica kursów pobranych z bazy danych
export const List = ({ activeCourseId, courses }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(() => {
      upsertUserProgress(id).catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {/* Mapowanie przez tablicę kursów i renderowanie komponentu Card dla każdego kursu */}
      {courses.map((course) => (
        <Card
          key={course.id} // Unikalny klucz dla React
          id={course.id} // ID kursu
          title={course.title} // Tytuł kursu
          imageSrc={course.imageSrc} // Ścieżka do obrazka kursu
          onClick={onClick} // Funkcja obsługująca kliknięcie - przekierowuje do /learn jeśli kurs jest aktywny lub ustawia nowy aktywny kurs
          disable={pending} // Wyłącza możliwość kliknięcia podczas oczekiwania na odpowiedź serwera
          active={course.id === activeCourseId} // Sprawdza czy ten kurs jest aktywny
        />
      ))}
    </div>
  );
};
