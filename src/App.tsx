import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';

//Components
import QuestionCard from './Components/QuestionCard';

//Types
import { QuestionState, Difficulty } from './API';
import { AwaitExpression } from 'typescript';
const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(1);
  const [gameOver, setGameOver] = useState(true);

  // test code
  console.log(questions);

  // start game
  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setLoading(false);
  };

  //check answer
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //user answer
      const answer = e.currentTarget.value;

      //check answer againist the correct value
      const correct = questions[number].correct_answer === answer;

      //add score if answer is correct
      if (correct) setScore((prevScore) => prevScore + 1);

      // save answer for in the array for the userAnswers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  //move to next question
  const NextQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    }else{
      setNumber(nextQuestion)
    }
  };

  return (
    <div className='App'>
      <h1>React Quiz</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className='start' onClick={startTrivia}>
          Start
        </button>
      ) : null}

      {!gameOver ? <p className='score'>Score:{score}</p> : null}

      {loading && <p>Loading Question...</p>}

      {!loading && !gameOver && (
        <QuestionCard
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}

      {!gameOver &&
      !loading &&
      userAnswers.length === number + 1 &&
      number !== TOTAL_QUESTIONS - 1 ? (
        <button className='next' onClick={NextQuestion}>
          Next Question
        </button>
      ) : null}
    </div>
  );
};

export default App;
