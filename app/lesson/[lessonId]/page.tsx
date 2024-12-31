import { getLesson, getUserProgress } from "@/db/queries";

import { redirect } from "next/navigation";
import { Quiz } from "../quiz";

type Props = {
  params: {
    lessonId: number;
  };
};

const lessonIdPage = async ({ params }: Props) => {
  const lessonData = getLesson(params.lessonId);
  const ProgressData = getUserProgress();

  const [lesson, userProgress] = await Promise.all([lessonData, ProgressData]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage =
    (lesson.challenges.filter((challenges) => challenges.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={null} // TODO:  Add user sub
    />
  );
};

export default lessonIdPage;
