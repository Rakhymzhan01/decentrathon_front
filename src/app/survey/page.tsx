"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const questions = [
  {
    id: 1,
    question: "Что такое инфляция?",
    options: [
      "Рост цен на товары и услуги",
      "Снижение цен на товары и услуги",
      "Увеличение заработной платы",
      "Уменьшение налогов"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Что такое диверсификация инвестиций?",
    options: [
      "Вложение всех денег в одну компанию",
      "Распределение инвестиций между различными активами",
      "Хранение всех денег в банке",
      "Инвестирование только в недвижимость"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Что такое кредитный рейтинг?",
    options: [
      "Сумма всех ваших кредитов",
      "Процентная ставка по кредиту",
      "Оценка вашей кредитоспособности",
      "Максимальная сумма, которую вам может одолжить банк"
    ],
    correctAnswer: 2
  }
]

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answerIndex }))
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    return Object.entries(answers).reduce((score, [questionId, answerIndex]) => {
      const question = questions[parseInt(questionId)]
      return question.correctAnswer === answerIndex ? score + 1 : score
    }, 0)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Progress value={progress} className="mb-4" />
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full mb-6">
              <CardHeader>
                <h2 className="text-2xl font-bold">{questions[currentQuestion].question}</h2>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-colors ${
                      answers[currentQuestion] === index ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <CardContent className="p-4">
                      <p className="text-lg">{option}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
                Назад
              </Button>
              <Button 
                onClick={() => handleAnswerSelect(answers[currentQuestion] || 0)} 
                disabled={answers[currentQuestion] === undefined}
              >
                {currentQuestion === questions.length - 1 ? "Завершить" : "Далее"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Результаты</h2>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  Вы ответили правильно на {calculateScore()} из {questions.length} вопросов.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers({})
                  setShowResults(false)
                }}>
                  Начать заново
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}