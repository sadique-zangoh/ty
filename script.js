const questions = [
    {
        question: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correct: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correct: 2
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
    },
    {
        question: "Which programming language is known for web development?",
        answers: ["Python", "JavaScript", "C++", "Java"],
        correct: 1
    },
    {
        question: "What year did World War II end?",
        answers: ["1944", "1945", "1946", "1947"],
        correct: 1
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

const questionElement = document.getElementById('question');
const answerButtons = [
    document.getElementById('btn-1'),
    document.getElementById('btn-2'),
    document.getElementById('btn-3'),
    document.getElementById('btn-4')
];
const nextButton = document.getElementById('next-btn');
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    quizContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    
    answerButtons.forEach((button, index) => {
        button.textContent = currentQuestion.answers[index];
        button.classList.remove('selected', 'correct', 'wrong');
        button.disabled = false;
        button.onclick = () => selectAnswer(index);
    });
    
    nextButton.disabled = true;
    selectedAnswer = null;
}

function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return;
    
    selectedAnswer = answerIndex;
    const currentQuestion = questions[currentQuestionIndex];
    
    answerButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === currentQuestion.correct) {
            button.classList.add('correct');
        } else if (index === selectedAnswer) {
            button.classList.add('wrong');
        }
    });
    
    if (selectedAnswer === currentQuestion.correct) {
        score++;
    }
    
    nextButton.disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    
    const percentage = Math.round((score / questions.length) * 100);
    scoreElement.textContent = `Your score: ${score}/${questions.length} (${percentage}%)`;
}

function restartQuiz() {
    startQuiz();
}

nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartQuiz);

startQuiz();