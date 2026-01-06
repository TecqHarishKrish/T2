const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Exam = require('./models/Exam');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/exam-portal');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Exam.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@examportal.com',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();

    // Create student user
    const studentPassword = await bcrypt.hash('password123', 10);
    const student = new User({
      username: 'student',
      email: 'student@examportal.com',
      password: studentPassword,
      role: 'student'
    });
    await student.save();

    // Create sample exams
    const sampleExams = [
      {
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
          },
          {
            question: 'Which of the following is not a JavaScript data type?',
            options: [
              'Number',
              'String',
              'Float',
              'Boolean'
            ],
            correctAnswer: 2
          },
          {
            question: 'How do you write a comment in JavaScript?',
            options: [
              '// This is a comment',
              '# This is a comment',
              '<!-- This is a comment -->',
              '/* This is a comment */'
            ],
            correctAnswer: 0
          }
        ],
        createdBy: admin._id
      },
      {
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
          },
          {
            question: 'What hook is used to manage state in functional components?',
            options: [
              'useState',
              'useEffect',
              'useContext',
              'useReducer'
            ],
            correctAnswer: 0
          },
          {
            question: 'Which method is used to render a React component?',
            options: [
              'ReactDOM.render()',
              'component.render()',
              'React.render()',
              'renderComponent()'
            ],
            correctAnswer: 0
          },
          {
            question: 'What is JSX?',
            options: [
              'A syntax extension for JavaScript',
              'A type of CSS',
              'A database query language',
              'A version of Java'
            ],
            correctAnswer: 0
          }
        ],
        createdBy: admin._id
      },
      {
        title: 'Web Development Basics',
        description: 'General questions about HTML, CSS, and web development concepts.',
        duration: 25,
        questions: [
          {
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Markup Language'
            ],
            correctAnswer: 0
          },
          {
            question: 'Which CSS property is used to change the text color?',
            options: [
              'text-color',
              'color',
              'font-color',
              'text-style'
            ],
            correctAnswer: 1
          },
          {
            question: 'What is the purpose of the <head> tag in HTML?',
            options: [
              'To contain metadata about the document',
              'To display the main content',
              'To create a header section',
              'To add navigation links'
            ],
            correctAnswer: 0
          },
          {
            question: 'Which HTML element is used for the largest heading?',
            options: [
              '<h1>',
              '<h6>',
              '<heading>',
              '<header>'
            ],
            correctAnswer: 0
          },
          {
            question: 'What does CSS stand for?',
            options: [
              'Cascading Style Sheets',
              'Computer Style Sheets',
              'Creative Style Sheets',
              'Colorful Style Sheets'
            ],
            correctAnswer: 0
          }
        ],
        createdBy: admin._id
      }
    ];

    for (const examData of sampleExams) {
      const exam = new Exam(examData);
      await exam.save();
    }

    console.log('Database seeded successfully!');
    console.log('Admin login: admin@examportal.com / admin123');
    console.log('Student login: student@examportal.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
