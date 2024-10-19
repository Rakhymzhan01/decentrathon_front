"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Определяем типы для вопросов и ответов
interface Answer {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}

interface Question {
  _id: string; // Используем _id как уникальный идентификатор
  question: string;
  answers: Answer[];
  topic: string;
  user_id: string;
}

const user_id = "6712bc1c3ad4107aefcad775";

export default function Game() {
  const router = useRouter();
  const pathname = usePathname(); // Получаем текущий путь
  const [balance, setBalance] = useState(1000); // Начальный баланс
  const [questionId, setQuestionId] = useState<string | null>(null); // ID вопроса
  const [loading, setLoading] = useState(true); // Загрузка
  const [questions, setQuestions] = useState<Question[]>([]); // Вопросы
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Извлекаем ID вопроса из пути и устанавливаем начальный вопрос
  useEffect(() => {
    const pathParts = pathname.split('/'); // Разбиваем путь по "/"
    const idFromPath = pathParts[pathParts.length - 1]; // Получаем последний элемент как ID вопроса
    setQuestionId(idFromPath); // Устанавливаем ID вопроса из пути
  }, [pathname]);

  // Функция для получения вопросов по теме
  const fetchQuestions = async (topic: string) => {
    setLoading(true); // Начинаем загрузку
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/question/topic/${topic}/user/${user_id}`);
      console.log("Questions response:", response.data);
      setQuestions(response.data); // Сохраняем вопросы из ответа
      setCurrentQuestion(response.data[0])
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

  // Найти текущий вопрос по ID

  const handleAnswer = (additionalData: any) => {
    // Здесь можно обработать данные ответа, если необходимо
    console.log("Выбранный ответ:", additionalData);

    // Переход к следующему вопросу
    if (currentQuestion) {
      const currentIndex = questions.findIndex(q => q._id === currentQuestion._id);
      if (currentIndex < questions.length - 1) {
        const nextQuestionId = questions[currentIndex + 1]._id;
        router.push(`/game/${nextQuestionId}`);
      } else {
        router.push('/result'); // Переход на страницу с итогом
      }
    }
  };

  // Проверяем, загружен ли вопрос
  if (loading) return <div>Загрузка...</div>; // Обрабатываем загрузку
  if (!currentQuestion) return <div>Нет доступных вопросов.</div>; // Если вопросов нет

  return (
    <div className="flex h-screen items-center justify-center bg-white text-black">
      <div className="max-w-lg text-center">
        <div className="p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
          <p className="mb-6">Текущий баланс: ${balance}</p>
          <div className="space-y-4">
            {currentQuestion.answers.map((answer, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleAnswer(answer)}
              >
                <p className="text-lg font-semibold">{answer.additionalProp1}</p>
                <p>{answer.additionalProp2}</p>
                <p>{answer.additionalProp3}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
