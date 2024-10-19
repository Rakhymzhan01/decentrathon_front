"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Loader from "@/components/Loader";

const questions = [
  { id: "gender", question: "Ваш пол?", options: ["Мужской", "Женский"], type: "text" },
  { id: "age", question: "Ваш возраст?", options: ["18-24", "25-35", "36+"], type: "text" },
  { id: "main_goal", question: "Главная финансовая цель?", options: ["Выйти на стабильный доход", "Финансовая независимость", "Пассивный доход"], type: "text" },
  { id: "income_source", question: "Основной источник дохода?", options: ["Работа", "Бизнес", "Стипендия"], type: "text" },
  { id: "goal_annual_income", question: "Желаемый годовой доход?", options: ["200,000₸ — 300,000₸", "300,000₸ — 500,000₸", "500,000₸ — 800,000₸", "800,000₸+"], type: "number" },
  { id: "anxious", question: "Что больше всего вас беспокоит в финансах?", options: ["Мне комфортно", "Хочу большей стабильности", "Мне не нравится моя текущая ситуация"], type: "text" },
  { id: "largest_debt", question: "Ваш самый крупный долг?", options: ["Ипотека", "Кредит на машину", "Образовательный кредит", "Долги в кредитной карте"], type: "text" },
  { id: "have_retirement_plan", question: "Есть ли пенсионный план?", options: ["Да", "Нет"], type: "boolean" },
  { id: "habit_saving", question: "Есть привычка откладывать деньги?", options: ["Да", "Нет"], type: "boolean" },
];

export default function Survey() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const user_id = "6712bc1c3ad4107aefcad775";

  const handleAnswerSelect = (answer: any) => {
    const question = questions[currentQuestion];
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        user_id: user_id,
        gender: answers.gender || "",
        age: answers.age || 0,
        main_goal: answers.main_goal || "",
        income_source: answers.income_source || "",
        goal_annual_income: answers.goal_annual_income || "",
        anxious: answers.anxious || "",
        largest_debt: answers.largest_debt || "",
        have_retirement_plan: answers.have_retirement_plan || "",
        habit_saving: answers.habit_saving || "",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user_info/${user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      console.log("Отправленные данные:", data);

      if (response.ok) {
        setTimeout(() => (window.location.href = "/game"), 2000);
      } else {
        alert("Произошла ошибка при отправке данных.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {isSubmitting && <Loader />}
      <Progress value={progress} className="mb-[15vh]" />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full mb-6">
            <CardHeader>
              <h2 className="text-2xl font-bold">
                {questions[currentQuestion].question}
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-colors ${
                      answers[questions[currentQuestion].id] === option
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <CardContent className="p-4">
                      <p className="text-lg">{option}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="mt-6 flex justify-between">
              <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
                Назад
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
