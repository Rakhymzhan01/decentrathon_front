'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner'



interface Answer {
  variant: string;
  reaction: string;
}

interface Question {
  question: string;
  answers: Answer[];
  topic: string;
  user_id: string;
}

const user_id = "6712bc1c3ad4107aefcad775";

export default function Game() {
  const router = useRouter();
  const pathname = usePathname();
  const [balance, setBalance] = useState(1000);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentDay, setCurrentDay] = useState(1);

  // Fetch question from the API
  const fetchQuestion = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/llm/question`, {
        text: "string",
        user_info: {},
        iteration: 0,
        last_answers: [],
        last_questions: [],
        last_reactions: []
      });
      setCurrentQuestion(response.data.response);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswer = async (selectedAnswer: Answer) => {
    console.log("Выбранный ответ:", selectedAnswer);

    // Update the balance based on the selected answer
    let newBalance = balance;

    // Logic to change balance based on the selected answer
    if (selectedAnswer.variant === "Исследовать предлагаемый проект и провести финансовый анализ.") {
      newBalance += 100; // Increase balance
    } else if (selectedAnswer.variant === "Отклонить предложение, так как кажется слишком рискованным.") {
      newBalance -= 50; // Decrease balance
    } else if (selectedAnswer.variant === "Согласиться без дополнительного изучения, рассчитывая на удачу.") {
      newBalance -= 100; // Higher risk, higher penalty
    }

    setBalance(newBalance);

    // Show Sonner notification for reaction
    toast.info(selectedAnswer.reaction);

    // Send new request with the selected answer
    try {
      await axios.post('/api/llm/question', {
        text: "string",
        user_info: {},
        iteration: 1,
        last_answers: [selectedAnswer.variant],
        last_questions: [currentQuestion?.question || ""],
        last_reactions: [selectedAnswer.reaction]
      });
    } catch (error) {
      console.error("Error sending answer:", error);
    }

    // Check if the balance is negative
    if (newBalance < 0) {
      router.push('/game-over');
      return;
    }

    // Delay before fetching the next question
    setTimeout(() => {
      fetchQuestion();
      setCurrentDay(prev => prev + 1);
    }, 3000);
  };

  if (!currentQuestion) return <div></div>;

  return (
    <div className="flex h-screen items-center justify-center bg-white text-black">
      <div className="absolute top-4 left-4 text-xl font-bold">
        <p>Баланс: ${balance}</p>
      </div>
      <div className="absolute top-4 right-4 text-xl font-bold">
        <p>День: {currentDay}</p>
      </div>
      <div className="max-w-lg text-center">
        <div className="p-6 mb-4">
          <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
          <div className="space-y-4">
            {currentQuestion.answers.map((answer, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-200 cursor-pointer mx-auto"
                onClick={() => handleAnswer(answer)}
              >
                <p className="text-lg font-semibold">{answer.variant}</p>
                {/* <p>{answer.reaction}</p> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
