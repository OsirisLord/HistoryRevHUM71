'use client'

import { useState, useCallback } from 'react'
import { mcqQuestions, tfQuestions, type MCQQuestion, type TFQuestion } from '@/lib/exam-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

type Mode = 'home' | 'flashcards' | 'quiz-mcq' | 'quiz-tf' | 'full-exam' | 'results' | 'full-exam-results'

// ============ UTILITY ============
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ============ HOME PAGE ============
function HomePage({ onStart }: { onStart: (mode: Mode) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مراجعة امتحان تاريخ الحضارات</h1>
          <p className="text-gray-600 text-lg">د. محمد علي منصور</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="text-sm py-1 px-3">25 سؤال اختيار من متعدد</Badge>
            <Badge variant="secondary" className="text-sm py-1 px-3">25 سؤال صح وخطأ</Badge>
          </div>
        </div>

        {/* Study Modes */}
        <div className="grid gap-4">
          {/* Flashcards */}
          <Card
            className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onStart('flashcards')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">🃏</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">البطاقات التعليمية</h3>
                  <p className="text-gray-500">اقلب البطاقات لحفظ المعلومات بسرعة - 55 سؤال اختيار من متعدد</p>
                </div>
                <div className="text-gray-400 group-hover:translate-x-[-4px] transition-transform">←</div>
              </div>
            </CardContent>
          </Card>

          {/* MCQ Quiz */}
          <Card
            className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onStart('quiz-mcq')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">✏️</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">اختيار من متعدد</h3>
                  <p className="text-gray-500">25 سؤال عشوائي - اختيار الإجابة الصحيحة</p>
                </div>
                <div className="text-gray-400 group-hover:translate-x-[-4px] transition-transform">←</div>
              </div>
            </CardContent>
          </Card>

          {/* T/F Quiz */}
          <Card
            className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onStart('quiz-tf')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">✅</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">صح وخطأ</h3>
                  <p className="text-gray-500">10 أسئلة عشوائية - حدد صحة العبارة</p>
                </div>
                <div className="text-gray-400 group-hover:translate-x-[-4px] transition-transform">←</div>
              </div>
            </CardContent>
          </Card>

          {/* Full Exam */}
          <Card
            className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-l from-amber-50 to-orange-50"
            onClick={() => onStart('full-exam')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">🏆</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-900 mb-1">امتحان كامل</h3>
                  <p className="text-amber-700">25 اختيار من متعدد + 10 صح وخطأ - مثل الامتحان الحقيقي</p>
                </div>
                <div className="text-amber-400 group-hover:translate-x-[-4px] transition-transform">←</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-6 border-0 shadow-md bg-emerald-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-emerald-900 mb-3">💡 نصائح للمراجعة في يوم واحد</h3>
            <ul className="space-y-2 text-emerald-800 text-sm">
              <li>• ابدأ بالبطاقات التعليمية لحفظ المعلومات الأساسية</li>
              <li>• ثم خذ الاختبارات للتأكد من فهمك</li>
              <li>• ركز على الأسئلة التي أخطأت فيها وأعدها</li>
              <li>• راجع المواضيع الصعبة أكثر من مرة</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============ FLASHCARD MODE ============
function FlashcardMode({ onBack }: { onBack: () => void }) {
  const [questions] = useState(() => shuffleArray(mcqQuestions))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set())

  const currentQ = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleKnown = () => {
    setKnownCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQ.id)) {
        newSet.delete(currentQ.id)
      } else {
        newSet.add(currentQ.id)
      }
      return newSet
    })
  }

  const optionLetters = ['أ', 'ب', 'ج', 'د']

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            → رجوع
          </Button>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {questions.length}
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            ✓ {knownCards.size} محفوظ
          </Badge>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        {/* Flashcard */}
        <div
          className="flip-card cursor-pointer mb-6"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ minHeight: '350px' }}
        >
          <div className={`flip-card-inner relative w-full ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '350px' }}>
            {/* Front */}
            <div className="flip-card-front absolute inset-0">
              <Card className="h-full border-0 shadow-lg bg-white">
                <CardContent className="p-8 flex flex-col items-center justify-center h-full">
                  <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                    {currentQ.topic}
                  </Badge>
                  <p className="text-xl font-semibold text-gray-900 text-center leading-relaxed">
                    {currentQ.question}
                  </p>
                  <p className="text-sm text-gray-400 mt-6">اضغط لرؤية الإجابة</p>
                </CardContent>
              </Card>
            </div>

            {/* Back */}
            <div className="flip-card-back absolute inset-0">
              <Card className="h-full border-0 shadow-lg bg-emerald-50">
                <CardContent className="p-8 flex flex-col justify-center h-full">
                  <Badge className="mb-4 self-center bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                    {currentQ.topic}
                  </Badge>
                  <p className="text-lg font-semibold text-gray-900 mb-4 text-center leading-relaxed">
                    {currentQ.question}
                  </p>
                  <div className="space-y-2">
                    {currentQ.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg text-center font-medium ${
                          i === currentQ.correctAnswer
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-gray-600'
                        }`}
                      >
                        {optionLetters[i]}) {opt}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1"
          >
            السابق
          </Button>
          <Button
            variant={knownCards.has(currentQ.id) ? 'default' : 'outline'}
            onClick={handleKnown}
            className={`${knownCards.has(currentQ.id) ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
          >
            {knownCards.has(currentQ.id) ? '✓ محفوظ' : 'حفظتُه'}
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="flex-1"
          >
            التالي
          </Button>
        </div>

        {/* Jump to card */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => { setCurrentIndex(i); setIsFlipped(false) }}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  i === currentIndex
                    ? 'bg-emerald-600 text-white'
                    : knownCards.has(q.id)
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ MCQ QUIZ MODE ============
function MCQQuizMode({ onBack, onFinish }: { onBack: () => void; onFinish: (score: number, total: number, wrongQuestions: number[]) => void }) {
  const [questions] = useState(() => shuffleArray(mcqQuestions).slice(0, 25))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([])

  const currentQ = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const optionLetters = ['أ', 'ب', 'ج', 'د']

  const handleSelect = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === currentQ.correctAnswer) {
      setScore(prev => prev + 1)
    } else {
      setWrongQuestions(prev => [...prev, currentQ.id])
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      onFinish(score, questions.length, wrongQuestions)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            → رجوع
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              النتيجة: {score}/{currentIndex + (answered ? 1 : 0)}
            </Badge>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <Badge className="mb-3 bg-blue-100 text-blue-800 hover:bg-blue-200">
              {currentQ.topic}
            </Badge>
            <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
              {currentIndex + 1}. {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                let btnClass = 'border-2 bg-white hover:bg-gray-50 border-gray-200'
                if (answered) {
                  if (i === currentQ.correctAnswer) {
                    btnClass = 'border-2 bg-emerald-50 border-emerald-500 text-emerald-900'
                  } else if (i === selectedAnswer && i !== currentQ.correctAnswer) {
                    btnClass = 'border-2 bg-red-50 border-red-500 text-red-900 shake'
                  }
                } else if (i === selectedAnswer) {
                  btnClass = 'border-2 bg-blue-50 border-blue-500 text-blue-900'
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full p-4 rounded-xl text-right font-medium transition-all ${btnClass}`}
                    disabled={answered}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                        {optionLetters[i]}
                      </span>
                      <span>{opt}</span>
                      {answered && i === currentQ.correctAnswer && (
                        <span className="mr-auto">✓</span>
                      )}
                      {answered && i === selectedAnswer && i !== currentQ.correctAnswer && (
                        <span className="mr-auto">✗</span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {answered && (
          <Button
            onClick={handleNext}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
          >
            {currentIndex < questions.length - 1 ? 'السؤال التالي ←' : 'عرض النتيجة 🏆'}
          </Button>
        )}
      </div>
    </div>
  )
}

// ============ T/F QUIZ MODE ============
function TFQuizMode({ onBack, onFinish }: { onBack: () => void; onFinish: (score: number, total: number, wrongQuestions: number[]) => void }) {
  const [questions] = useState(() => shuffleArray(tfQuestions).slice(0, 10))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([])

  const currentQ = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleSelect = (value: boolean) => {
    if (answered) return
    setSelectedAnswer(value)
    setAnswered(true)
    if (value === currentQ.correctAnswer) {
      setScore(prev => prev + 1)
    } else {
      setWrongQuestions(prev => [...prev, currentQ.id])
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      onFinish(score, questions.length, wrongQuestions)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            → رجوع
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              النتيجة: {score}/{currentIndex + (answered ? 1 : 0)}
            </Badge>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <Badge className="mb-3 bg-purple-100 text-purple-800 hover:bg-purple-200">
              {currentQ.topic}
            </Badge>
            <h3 className="text-xl font-bold text-gray-900 mb-8 leading-relaxed">
              {currentIndex + 1}. {currentQ.statement}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSelect(true)}
                className={`p-6 rounded-xl font-bold text-xl transition-all ${
                  answered
                    ? currentQ.correctAnswer === true
                      ? 'bg-emerald-500 text-white border-2 border-emerald-500 shadow-lg'
                      : selectedAnswer === true
                      ? 'bg-red-100 text-red-800 border-2 border-red-500 shake'
                      : 'bg-gray-50 text-gray-400 border-2 border-gray-200'
                    : 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400'
                }`}
                disabled={answered}
              >
                <div className="text-3xl mb-2">✓</div>
                صح
              </button>
              <button
                onClick={() => handleSelect(false)}
                className={`p-6 rounded-xl font-bold text-xl transition-all ${
                  answered
                    ? currentQ.correctAnswer === false
                      ? 'bg-emerald-500 text-white border-2 border-emerald-500 shadow-lg'
                      : selectedAnswer === false
                      ? 'bg-red-100 text-red-800 border-2 border-red-500 shake'
                      : 'bg-gray-50 text-gray-400 border-2 border-gray-200'
                    : 'bg-red-50 text-red-800 border-2 border-red-200 hover:bg-red-100 hover:border-red-400'
                }`}
                disabled={answered}
              >
                <div className="text-3xl mb-2">✗</div>
                خطأ
              </button>
            </div>

            {answered && (
              <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
                selectedAnswer === currentQ.correctAnswer
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer === currentQ.correctAnswer
                  ? '✓ إجابة صحيحة!'
                  : `✗ إجابة خاطئة! الإجابة الصحيحة: ${currentQ.correctAnswer ? 'صح' : 'خطأ'}`}
              </div>
            )}
          </CardContent>
        </Card>

        {answered && (
          <Button
            onClick={handleNext}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
          >
            {currentIndex < questions.length - 1 ? 'السؤال التالي ←' : 'عرض النتيجة 🏆'}
          </Button>
        )}
      </div>
    </div>
  )
}

// ============ FULL EXAM MODE ============
function FullExamMode({ onBack, onFinish }: {
  onBack: () => void
  onFinish: (mcqScore: number, mcqTotal: number, tfScore: number, tfTotal: number, wrongQuestions: number[]) => void
}) {
  const [mcqQuestions_shuffled] = useState(() => shuffleArray(mcqQuestions).slice(0, 25))
  const [tfQuestions_shuffled] = useState(() => shuffleArray(tfQuestions).slice(0, 10))

  const [phase, setPhase] = useState<'mcq' | 'tf'>('mcq')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null)
  const [answered, setAnswered] = useState(false)

  const [mcqScore, setMcqScore] = useState(0)
  const [tfScore, setTfScore] = useState(0)
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([])

  const questions = phase === 'mcq' ? mcqQuestions_shuffled : tfQuestions_shuffled
  const currentQ = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const optionLetters = ['أ', 'ب', 'ج', 'د']

  const handleSelectMCQ = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    const q = currentQ as MCQQuestion
    if (index === q.correctAnswer) {
      setMcqScore(prev => prev + 1)
    } else {
      setWrongQuestions(prev => [...prev, q.id])
    }
  }

  const handleSelectTF = (value: boolean) => {
    if (answered) return
    setSelectedAnswer(value)
    setAnswered(true)
    const q = currentQ as TFQuestion
    if (value === q.correctAnswer) {
      setTfScore(prev => prev + 1)
    } else {
      setWrongQuestions(prev => [...prev, q.id])
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else if (phase === 'mcq') {
      // Switch to T/F phase
      setPhase('tf')
      setCurrentIndex(0)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      // Exam finished
      onFinish(mcqScore, mcqQuestions_shuffled.length, tfScore, tfQuestions_shuffled.length, wrongQuestions)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            → رجوع
          </Button>
          <div className="flex items-center gap-3">
            <Badge className={phase === 'mcq' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
              {phase === 'mcq' ? `اختيار من متعدد: ${mcqScore}/${currentIndex + (answered ? 1 : 0)}` : `صح وخطأ: ${tfScore}/${currentIndex + (answered ? 1 : 0)}`}
            </Badge>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className={`flex-1 h-2 rounded-full ${phase === 'mcq' ? 'bg-blue-400' : 'bg-blue-200'}`} />
          <div className={`flex-1 h-2 rounded-full ${phase === 'tf' ? 'bg-purple-400' : 'bg-purple-200'}`} />
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <Badge className={`mb-3 ${phase === 'mcq' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
              {currentQ.topic}
            </Badge>
            <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
              {currentIndex + 1}. {currentQ.question || (currentQ as TFQuestion).statement}
            </h3>

            {phase === 'mcq' ? (
              <div className="space-y-3">
                {(currentQ as MCQQuestion).options.map((opt, i) => {
                  const mcq = currentQ as MCQQuestion
                  let btnClass = 'border-2 bg-white hover:bg-gray-50 border-gray-200'
                  if (answered) {
                    if (i === mcq.correctAnswer) {
                      btnClass = 'border-2 bg-emerald-50 border-emerald-500 text-emerald-900'
                    } else if (i === selectedAnswer && i !== mcq.correctAnswer) {
                      btnClass = 'border-2 bg-red-50 border-red-500 text-red-900 shake'
                    }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectMCQ(i)}
                      className={`w-full p-4 rounded-xl text-right font-medium transition-all ${btnClass}`}
                      disabled={answered}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                          {optionLetters[i]}
                        </span>
                        <span>{opt}</span>
                        {answered && i === mcq.correctAnswer && <span className="mr-auto">✓</span>}
                        {answered && i === selectedAnswer && i !== mcq.correctAnswer && <span className="mr-auto">✗</span>}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectTF(true)}
                  className={`p-6 rounded-xl font-bold text-xl transition-all ${
                    answered
                      ? (currentQ as TFQuestion).correctAnswer === true
                        ? 'bg-emerald-500 text-white border-2 border-emerald-500 shadow-lg'
                        : selectedAnswer === true
                        ? 'bg-red-100 text-red-800 border-2 border-red-500 shake'
                        : 'bg-gray-50 text-gray-400 border-2 border-gray-200'
                      : 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400'
                  }`}
                  disabled={answered}
                >
                  <div className="text-3xl mb-2">✓</div>
                  صح
                </button>
                <button
                  onClick={() => handleSelectTF(false)}
                  className={`p-6 rounded-xl font-bold text-xl transition-all ${
                    answered
                      ? (currentQ as TFQuestion).correctAnswer === false
                        ? 'bg-emerald-500 text-white border-2 border-emerald-500 shadow-lg'
                        : selectedAnswer === false
                        ? 'bg-red-100 text-red-800 border-2 border-red-500 shake'
                        : 'bg-gray-50 text-gray-400 border-2 border-gray-200'
                      : 'bg-red-50 text-red-800 border-2 border-red-200 hover:bg-red-100 hover:border-red-400'
                  }`}
                  disabled={answered}
                >
                  <div className="text-3xl mb-2">✗</div>
                  خطأ
                </button>
              </div>
            )}

            {answered && phase === 'tf' && (
              <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
                selectedAnswer === (currentQ as TFQuestion).correctAnswer
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer === (currentQ as TFQuestion).correctAnswer
                  ? '✓ إجابة صحيحة!'
                  : `✗ إجابة خاطئة! الإجابة الصحيحة: ${(currentQ as TFQuestion).correctAnswer ? 'صح' : 'خطأ'}`}
              </div>
            )}
          </CardContent>
        </Card>

        {answered && (
          <Button
            onClick={handleNext}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg"
          >
            {phase === 'mcq' && currentIndex === questions.length - 1
              ? 'الانتقال لأسئلة صح وخطأ ←'
              : currentIndex < questions.length - 1
              ? 'السؤال التالي ←'
              : 'عرض النتيجة 🏆'}
          </Button>
        )}
      </div>
    </div>
  )
}

// ============ FULL EXAM RESULTS PAGE ============
function FullExamResultsPage({
  mcqScore, mcqTotal, tfScore, tfTotal, wrongQuestionIds, onRetry, onHome,
}: {
  mcqScore: number; mcqTotal: number; tfScore: number; tfTotal: number
  wrongQuestionIds: number[]; onRetry: () => void; onHome: () => void
}) {
  const totalScore = mcqScore + tfScore
  const totalQuestions = mcqTotal + tfTotal
  const percentage = Math.round((totalScore / totalQuestions) * 100)
  const allWrongQs = [...mcqQuestions, ...tfQuestions].filter(q => wrongQuestionIds.includes(q.id))

  let emoji = '🎉', message = 'ممتاز! أداء رائع'
  if (percentage < 50) { emoji = '💪'; message = 'تحتاج مراجعة أكثر - لا تستسلم!' }
  else if (percentage < 70) { emoji = '📖'; message = 'جيد لكن تحتاج مراجعة أكثر' }
  else if (percentage < 90) { emoji = '👍'; message = 'جيد جداً! استمر في المراجعة' }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-xl mb-6">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
            <div className="my-6">
              <div className="text-6xl font-bold text-amber-600">{percentage}%</div>
              <p className="text-gray-500 mt-2">{totalScore} من {totalQuestions} إجابة صحيحة</p>
            </div>
            <div className="flex justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{mcqScore}/{mcqTotal}</div>
                <div className="text-xs text-gray-500">اختيار من متعدد</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{tfScore}/{tfTotal}</div>
                <div className="text-xs text-gray-500">صح وخطأ</div>
              </div>
            </div>
            <Progress value={percentage} className="h-3 mb-6" />
          </CardContent>
        </Card>

        {allWrongQs.length > 0 && (
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-red-800">❌ الأسئلة التي أخطأت فيها - راجعها جيداً</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {allWrongQs.map((q) => (
                <div key={q.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-semibold text-gray-900 mb-2">{q.question || q.statement}</p>
                  <div className="text-sm">
                    <span className="text-emerald-700 font-medium">
                      الإجابة الصحيحة: {'options' in q ? (q as MCQQuestion).options[(q as MCQQuestion).correctAnswer] : ((q as TFQuestion).correctAnswer ? 'صح ✓' : 'خطأ ✗')}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onRetry} className="py-6 text-lg bg-amber-600 hover:bg-amber-700">🔄 حاول مرة أخرى</Button>
          <Button onClick={onHome} variant="outline" className="py-6 text-lg">🏠 الرئيسية</Button>
        </div>
      </div>
    </div>
  )
}

// ============ RESULTS PAGE ============
function ResultsPage({
  score, total, wrongQuestionIds, quizType, onRetry, onHome,
}: {
  score: number; total: number; wrongQuestionIds: number[]
  quizType: 'mcq' | 'tf'; onRetry: () => void; onHome: () => void
}) {
  const percentage = Math.round((score / total) * 100)
  const allQuestions = quizType === 'mcq' ? mcqQuestions : tfQuestions
  const wrongQs = allQuestions.filter(q => wrongQuestionIds.includes(q.id))

  let emoji = '🎉', message = 'ممتاز! أداء رائع', color = 'emerald'
  if (percentage < 50) { emoji = '💪'; message = 'تحتاج مراجعة أكثر - لا تستسلم!'; color = 'red' }
  else if (percentage < 70) { emoji = '📖'; message = 'جيد لكن تحتاج مراجعة أكثر'; color = 'amber' }
  else if (percentage < 90) { emoji = '👍'; message = 'جيد جداً! استمر في المراجعة'; color = 'blue' }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-xl mb-6">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
            <div className="my-6">
              <div className="text-6xl font-bold text-emerald-600">{percentage}%</div>
              <p className="text-gray-500 mt-2">{score} من {total} إجابة صحيحة</p>
            </div>
            <Progress value={percentage} className="h-3 mb-6" />
          </CardContent>
        </Card>

        {wrongQs.length > 0 && (
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-red-800">❌ الأسئلة التي أخطأت فيها - راجعها جيداً</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {wrongQs.map((q) => (
                <div key={q.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-semibold text-gray-900 mb-2">{q.question || q.statement}</p>
                  {quizType === 'mcq' ? (
                    <div className="text-sm">
                      <span className="text-emerald-700 font-medium">
                        الإجابة الصحيحة: {(q as MCQQuestion).options[(q as MCQQuestion).correctAnswer]}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <span className="text-emerald-700 font-medium">
                        الإجابة الصحيحة: {(q as TFQuestion).correctAnswer ? 'صح ✓' : 'خطأ ✗'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onRetry} className="py-6 text-lg bg-emerald-600 hover:bg-emerald-700">🔄 حاول مرة أخرى</Button>
          <Button onClick={onHome} variant="outline" className="py-6 text-lg">🏠 الرئيسية</Button>
        </div>
      </div>
    </div>
  )
}

// ============ MAIN APP ============
export default function Home() {
  const [mode, setMode] = useState<Mode>('home')
  const [refreshKey, setRefreshKey] = useState(0)
  const [results, setResults] = useState<{
    score: number; total: number; wrongQuestions: number[]; quizType: 'mcq' | 'tf'
  } | null>(null)
  const [fullExamResults, setFullExamResults] = useState<{
    mcqScore: number; mcqTotal: number; tfScore: number; tfTotal: number; wrongQuestions: number[]
  } | null>(null)

  const handleStart = useCallback((newMode: Mode) => {
    setResults(null)
    setFullExamResults(null)
    setRefreshKey(prev => prev + 1) // Force re-mount to reshuffle questions
    setMode(newMode)
  }, [])

  const handleFinish = useCallback((score: number, total: number, wrongQuestions: number[], quizType: 'mcq' | 'tf') => {
    setResults({ score, total, wrongQuestions, quizType })
    setMode('results')
  }, [])

  const handleFullExamFinish = useCallback((mcqScore: number, mcqTotal: number, tfScore: number, tfTotal: number, wrongQuestions: number[]) => {
    setFullExamResults({ mcqScore, mcqTotal, tfScore, tfTotal, wrongQuestions })
    setMode('full-exam-results')
  }, [])

  const handleBack = useCallback(() => {
    setMode('home')
    setResults(null)
    setFullExamResults(null)
  }, [])

  const handleRetry = useCallback(() => {
    setRefreshKey(prev => prev + 1)
    setResults(null)
    if (results?.quizType === 'mcq') {
      setMode('quiz-mcq')
    } else {
      setMode('quiz-tf')
    }
  }, [results])

  const handleFullExamRetry = useCallback(() => {
    setRefreshKey(prev => prev + 1)
    setFullExamResults(null)
    setMode('full-exam')
  }, [])

  switch (mode) {
    case 'home':
      return <HomePage onStart={handleStart} />
    case 'flashcards':
      return <FlashcardMode key={refreshKey} onBack={handleBack} />
    case 'quiz-mcq':
      return <MCQQuizMode key={refreshKey} onBack={handleBack} onFinish={(s, t, w) => handleFinish(s, t, w, 'mcq')} />
    case 'quiz-tf':
      return <TFQuizMode key={refreshKey} onBack={handleBack} onFinish={(s, t, w) => handleFinish(s, t, w, 'tf')} />
    case 'full-exam':
      return <FullExamMode key={refreshKey} onBack={handleBack} onFinish={handleFullExamFinish} />
    case 'results':
      return results ? (
        <ResultsPage
          score={results.score}
          total={results.total}
          wrongQuestionIds={results.wrongQuestions}
          quizType={results.quizType}
          onRetry={handleRetry}
          onHome={handleBack}
        />
      ) : null
    case 'full-exam-results':
      return fullExamResults ? (
        <FullExamResultsPage
          mcqScore={fullExamResults.mcqScore}
          mcqTotal={fullExamResults.mcqTotal}
          tfScore={fullExamResults.tfScore}
          tfTotal={fullExamResults.tfTotal}
          wrongQuestionIds={fullExamResults.wrongQuestions}
          onRetry={handleFullExamRetry}
          onHome={handleBack}
        />
      ) : null
    default:
      return <HomePage onStart={handleStart} />
  }
}
