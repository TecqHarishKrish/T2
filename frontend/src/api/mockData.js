// Mock data for bypass mode
export const mockExams = [
  {
    _id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
    duration: 30,
    questions: [
      {
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: [
          'var myVariable = 5;',
          'variable myVariable = 5;',
          'v myVariable = 5;',
          'declare myVariable = 5;'
        ],
        correctAnswer: 0
      },
      {
        question: 'Which method is used to add an element to the end of an array?',
        options: [
          'push()',
          'pop()',
          'shift()',
          'unshift()'
        ],
        correctAnswer: 0
      },
      {
        question: 'What does "DOM" stand for?',
        options: [
          'Document Object Model',
          'Data Object Management',
          'Dynamic Object Model',
          'Document Order Model'
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    _id: '2',
    title: 'React Basics',
    description: 'Test your understanding of React components, props, and state management.',
    duration: 45,
    questions: [
      {
        question: 'What is React?',
        options: [
          'A JavaScript library for building user interfaces',
          'A database management system',
          'A CSS framework',
          'A programming language'
        ],
        correctAnswer: 0
      },
      {
        question: 'How do you pass data to a React component?',
        options: [
          'Props',
          'State',
          'Context',
          'Refs'
        ],
        correctAnswer: 0
      }
    ]
  }
];

export const mockResults = [
  {
    id: '1',
    exam: {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics',
      duration: 30
    },
    score: 2,
    totalQuestions: 3,
    percentage: 67,
    submitTime: new Date().toISOString()
  }
];
