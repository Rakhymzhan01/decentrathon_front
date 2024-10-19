"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Определяем типы для вопросов и ответов
interface Answer {
  text: string;
  cost: number;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

const user_id = "6712bc1c3ad4107aefcad775";

export default function Game() {
  const router = useRouter();
  const pathname = usePathname(); // Получаем текущий путь
  const [balance, setBalance] = useState(1000); // Начальный баланс
  const [questionId, setQuestionId] = useState<number | null>(null); // ID вопроса
  const [loading, setLoading] = useState(true); // Загрузка
  const [questions, setQuestions] = useState<Question[]>([]); // Вопросы

  // Извлекаем ID вопроса из пути и устанавливаем начальный вопрос
  useEffect(() => {
    const pathParts = pathname.split('/'); // Разбиваем путь по "/"
    const idFromPath = parseInt(pathParts[pathParts.length - 1], 10); // Получаем последний элемент
    if (!isNaN(idFromPath)) {
      setQuestionId(idFromPath);
    } else {
      setQuestionId(1); // Устанавливаем начальный вопрос, если ID невалиден
    }
  }, [pathname]);

  // Функция для получения вопросов по теме
  const fetchQuestions = async (topic: string) => {
    setLoading(true); // Начинаем загрузку
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/question/topic/${topic}/user/${user_id}`);
      setQuestions(response.data); // Сохраняем вопросы из ответа
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false); // Заканчиваем загрузку
    }
  };

  // Вызов функции при монтировании компонента
  useEffect(() => {
    const topic = 'финансовая грамотность'; // Замените на вашу тему
    fetchQuestions(topic);
  }, []);

  const question = questions.find((q) => q.id === questionId);

  const handleAnswer = (cost: number) => {
    if (balance - cost < 0) {
      alert("Insufficient balance!"); // Предотвращаем отрицательный баланс
      return;
    }
    setBalance((prev) => prev - cost);

    // Переход к следующему вопросу или на итоговую страницу
    if (questionId && questionId < questions.length) {
      router.push(`/game/${questionId + 1}`);
    } else {
      router.push('/result'); // Переход на страницу с итогом
    }
  };

  // Проверяем, загружен ли вопрос
  if (loading) return <div>Loading...</div>; // Обрабатываем загрузку
  if (!question) return <div>No questions available.</div>; // Если вопросов нет

  return (
    <div className="flex h-screen items-center justify-center bg-white text-black">
      <div className="max-w-lg text-center">
        <div className="p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
          <p className="mb-6">Current Balance: ${balance}</p>
          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleAnswer(answer.cost)}
              >
                <p className="text-lg font-semibold">{answer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
