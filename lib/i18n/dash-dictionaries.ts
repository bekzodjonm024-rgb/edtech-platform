import type { Locale } from "./dictionaries";

export type DashDict = {
  sidebarTeacher: {
    home: string;
    lessons: string;
    topics: string;
    assignments: string;
    classes: string;
    library: string;
    aiAssistant: string;
    reports: string;
    messages: string;
    settings: string;
  };
  sidebarStudent: {
    home: string;
    assignments: string;
    lessons: string;
    library: string;
    aiTutor: string;
    tests: string;
    achievements: string;
    settings: string;
  };
  search: string;
  teacherRole: string;
  studentRole: string;
  mainPanel: string;
  overview: string;
  stat: Record<
    "lessons" | "assignments" | "students" | "avgScore" | "completed" | "points",
    string
  >;
  recentLessons: string;
  viewAll: string;
  statusTitle: string;
  status: { submitted: string; inProgress: string; notSubmitted: string };
  quickCreate: string;
  qc: Record<
    "presentation" | "test" | "crossword" | "interactive" | "lessonPlan" | "quiz" | "flashcard" | "mindmap",
    string
  >;
  gen: {
    title: string;
    subtitle: string;
    klass: string;
    subject: string;
    topic: string;
    topicPlaceholder: string;
    duration: string;
    language: string;
    materialsToGenerate: string;
    button: string;
    generating: string;
    ready: string;
    slidesWord: string;
    questionsWord: string;
  };
  mat: Record<
    "presentation" | "lessonPlan" | "test" | "crossword" | "interactive" | "homework" | "rubric" | "export",
    string
  >;
  welcome: string;
  achievements: string;
  pointsWord: string;
  reports: {
    title: string;
    tabAll: string;
    tabLessons: string;
    tabStudents: string;
    distribution: string;
    dynamics: string;
    avgScore: string;
    completedRate: string;
    activeStudents: string;
    avgTime: string;
  };
  dist: Record<"excellent" | "good" | "satisfactory" | "poor", string>;
  ach: Record<"explorer" | "taskMaster" | "topStudent", string>;
  empty: { noMaterials: string; noSubmissions: string };
  essay: {
    task: string;
    guidance: string;
    criteria: string;
    expected: string;
    yourAnswer: string;
    placeholder: string;
    submit: string;
    submitting: string;
    submitted: string;
    feedbackTitle: string;
    strengths: string;
    improvements: string;
    detailed: string;
    scoreLabel: string;
    pending: string;
    notFound: string;
    back: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    avgScore: string;
    completion: string;
    active: string;
    submissions: string;
    distribution: string;
    timeline: string;
    students: string;
    insights: string;
    thStudent: string;
    thSubs: string;
    thAvg: string;
    thLast: string;
    noData: string;
  };
};

export const dashDictionaries: Record<Locale, DashDict> = {
  uz: {
    sidebarTeacher: {
      home: "Asosiy",
      lessons: "Mening kurslarim",
      topics: "Mavzular",
      assignments: "Topshiriqlar",
      classes: "Guruhlar",
      library: "Kutubxona",
      aiAssistant: "AI Yordamchi",
      reports: "Hisobotlar",
      messages: "Xabarlar",
      settings: "Sozlamalar",
    },
    sidebarStudent: {
      home: "Asosiy",
      assignments: "Topshiriqlar",
      lessons: "Mening kurslarim",
      library: "Kutubxona",
      aiTutor: "AI Tutor",
      tests: "Testlar",
      achievements: "Yutuqlar",
      settings: "Sozlamalar",
    },
    search: "Qidirish...",
    teacherRole: "Professor-o'qituvchi",
    studentRole: "Talaba",
    mainPanel: "Asosiy panel",
    overview: "Bugungi faoliyatingiz umumiy nazar",
    stat: {
      lessons: "Ma'ruzalar",
      assignments: "Topshiriqlar",
      students: "Talabalar",
      avgScore: "O'rtacha natija",
      completed: "Yakunlangan",
      points: "Yutuqlar",
    },
    recentLessons: "So'nggi mashg'ulotlar",
    viewAll: "Barchasini ko'rish",
    statusTitle: "Topshiriqlar holati",
    status: { submitted: "Topshirilgan", inProgress: "Jarayonda", notSubmitted: "Topshirilmagan" },
    quickCreate: "Tezkor yaratish",
    qc: {
      presentation: "Taqdimot",
      test: "Test",
      crossword: "Krossvord",
      interactive: "Interaktiv topshiriq",
      lessonPlan: "Ma'ruza rejasi",
      quiz: "Quiz",
      flashcard: "Flashcard",
      mindmap: "Mind Map",
    },
    gen: {
      title: "AI Material Generator",
      subtitle: "Yangi material yaratish",
      klass: "Kurs",
      subject: "Fan",
      topic: "Mavzu",
      topicPlaceholder: "Masalan: Fotosintez molekulyar mexanizmi",
      duration: "Mashg'ulot davomiyligi",
      language: "Til",
      materialsToGenerate: "Yaratiladigan materiallar",
      button: "AI bilan yaratish",
      generating: "Yaratilmoqda...",
      ready: "Tayyor!",
      slidesWord: "slayd",
      questionsWord: "ta savol",
    },
    mat: {
      presentation: "Taqdimot",
      lessonPlan: "Ma'ruza rejasi",
      test: "Test",
      crossword: "Krossvord",
      interactive: "Interaktiv topshiriq",
      homework: "Uy vazifasi",
      rubric: "Baholash rubrikasi",
      export: "PDF va PPT formatda",
    },
    welcome: "Xush kelibsiz",
    achievements: "Yutuqlar",
    pointsWord: "ball",
    reports: {
      title: "Hisobotlar",
      tabAll: "Umumiy",
      tabLessons: "Kurslar bo'yicha",
      tabStudents: "Talabalar bo'yicha",
      distribution: "Natijalar taqsimoti",
      dynamics: "Natijalar dinamikasi",
      avgScore: "O'rtacha natija",
      completedRate: "Yakunlangan",
      activeStudents: "Faol talabalar",
      avgTime: "O'rtacha vaqt",
    },
    dist: {
      excellent: "A'lo (90-100)",
      good: "Yaxshi (70-89)",
      satisfactory: "Qoniqarli (50-69)",
      poor: "Qoniqarsiz (<50)",
    },
    ach: {
      explorer: "Izlanuvchi",
      taskMaster: "Topshiriq ustasi",
      topStudent: "A'lochi",
    },
    empty: {
      noMaterials: "Hali material yaratilmagan",
      noSubmissions: "Hali topshiriq topshirilmagan",
    },
    essay: {
      task: "Topshiriq",
      guidance: "Maslahat",
      criteria: "Baholash mezonlari",
      expected: "Taxminiy hajm",
      yourAnswer: "Sizning javobingiz",
      placeholder: "Javobingizni shu yerga yozing...",
      submit: "Topshirish va baholash",
      submitting: "Baholanmoqda...",
      submitted: "Topshirildi",
      feedbackTitle: "AI tahlili va fikri",
      strengths: "Kuchli tomonlar",
      improvements: "Yaxshilash mumkin",
      detailed: "Batafsil fikr",
      scoreLabel: "Baho",
      pending: "AI baholash hozircha mavjud emas — o'qituvchi qo'lda tekshiradi.",
      notFound: "Topshiriq topilmadi",
      back: "Orqaga",
    },
    analytics: {
      title: "Tahlil va statistika",
      subtitle: "Guruhlaringiz bo'yicha real ko'rsatkichlar",
      avgScore: "O'rtacha baho",
      completion: "Topshirish darajasi",
      active: "Faol talabalar",
      submissions: "Jami topshiriqlar",
      distribution: "Baholar taqsimoti",
      timeline: "Natijalar dinamikasi",
      students: "Talabalar progressi",
      insights: "Tavsiyalar",
      thStudent: "Talaba",
      thSubs: "Topshiriqlar",
      thAvg: "O'rtacha",
      thLast: "Oxirgi faollik",
      noData: "Hali ma'lumot yo'q. Talabalar topshiriqlarni bajargach, tahlil shu yerda chiqadi.",
    },
  },
  en: {
    sidebarTeacher: {
      home: "Overview",
      lessons: "My courses",
      topics: "Topics",
      assignments: "Assignments",
      classes: "Groups",
      library: "Library",
      aiAssistant: "AI Assistant",
      reports: "Reports",
      messages: "Messages",
      settings: "Settings",
    },
    sidebarStudent: {
      home: "Overview",
      assignments: "Assignments",
      lessons: "My courses",
      library: "Library",
      aiTutor: "AI Tutor",
      tests: "Tests",
      achievements: "Achievements",
      settings: "Settings",
    },
    search: "Search...",
    teacherRole: "Faculty",
    studentRole: "Student",
    mainPanel: "Dashboard",
    overview: "An overview of your activity today",
    stat: {
      lessons: "Lectures",
      assignments: "Assignments",
      students: "Students",
      avgScore: "Avg. score",
      completed: "Completed",
      points: "Points",
    },
    recentLessons: "Recent sessions",
    viewAll: "View all",
    statusTitle: "Assignment status",
    status: { submitted: "Submitted", inProgress: "In progress", notSubmitted: "Not submitted" },
    quickCreate: "Quick create",
    qc: {
      presentation: "Presentation",
      test: "Test",
      crossword: "Crossword",
      interactive: "Interactive task",
      lessonPlan: "Lecture plan",
      quiz: "Quiz",
      flashcard: "Flashcard",
      mindmap: "Mind Map",
    },
    gen: {
      title: "AI Material Generator",
      subtitle: "Create new material",
      klass: "Year",
      subject: "Subject",
      topic: "Topic",
      topicPlaceholder: "e.g. Photosynthesis mechanism",
      duration: "Session length",
      language: "Language",
      materialsToGenerate: "Materials to generate",
      button: "Generate with AI",
      generating: "Generating...",
      ready: "Ready!",
      slidesWord: "slides",
      questionsWord: "questions",
    },
    mat: {
      presentation: "Presentation",
      lessonPlan: "Lecture plan",
      test: "Test",
      crossword: "Crossword",
      interactive: "Interactive task",
      homework: "Homework",
      rubric: "Grading rubric",
      export: "PDF and PPT export",
    },
    welcome: "Welcome",
    achievements: "Achievements",
    pointsWord: "pts",
    reports: {
      title: "Reports",
      tabAll: "Overview",
      tabLessons: "By course",
      tabStudents: "By students",
      distribution: "Score distribution",
      dynamics: "Score dynamics",
      avgScore: "Avg. score",
      completedRate: "Completed",
      activeStudents: "Active students",
      avgTime: "Avg. time",
    },
    dist: {
      excellent: "Excellent (90-100)",
      good: "Good (70-89)",
      satisfactory: "Fair (50-69)",
      poor: "Poor (<50)",
    },
    ach: {
      explorer: "Explorer",
      taskMaster: "Task master",
      topStudent: "Top student",
    },
    empty: {
      noMaterials: "No materials created yet",
      noSubmissions: "No submissions yet",
    },
    essay: {
      task: "Task",
      guidance: "Guidance",
      criteria: "Grading criteria",
      expected: "Expected length",
      yourAnswer: "Your answer",
      placeholder: "Write your answer here...",
      submit: "Submit & grade",
      submitting: "Grading...",
      submitted: "Submitted",
      feedbackTitle: "AI analysis & feedback",
      strengths: "Strengths",
      improvements: "Areas to improve",
      detailed: "Detailed feedback",
      scoreLabel: "Score",
      pending: "AI grading is unavailable — your teacher will review it manually.",
      notFound: "Assignment not found",
      back: "Back",
    },
    analytics: {
      title: "Analytics & statistics",
      subtitle: "Real metrics across your groups",
      avgScore: "Average score",
      completion: "Completion rate",
      active: "Active students",
      submissions: "Total submissions",
      distribution: "Grade distribution",
      timeline: "Results trend",
      students: "Student progress",
      insights: "Insights",
      thStudent: "Student",
      thSubs: "Submissions",
      thAvg: "Average",
      thLast: "Last active",
      noData: "No data yet. Once students complete assignments, analytics will appear here.",
    },
  },
  ru: {
    sidebarTeacher: {
      home: "Обзор",
      lessons: "Мои курсы",
      topics: "Темы",
      assignments: "Задания",
      classes: "Группы",
      library: "Библиотека",
      aiAssistant: "ИИ-ассистент",
      reports: "Отчёты",
      messages: "Сообщения",
      settings: "Настройки",
    },
    sidebarStudent: {
      home: "Обзор",
      assignments: "Задания",
      lessons: "Мои курсы",
      library: "Библиотека",
      aiTutor: "ИИ-репетитор",
      tests: "Тесты",
      achievements: "Достижения",
      settings: "Настройки",
    },
    search: "Поиск...",
    teacherRole: "Преподаватель",
    studentRole: "Студент",
    mainPanel: "Панель",
    overview: "Обзор вашей активности за сегодня",
    stat: {
      lessons: "Лекции",
      assignments: "Задания",
      students: "Студенты",
      avgScore: "Средний балл",
      completed: "Завершено",
      points: "Очки",
    },
    recentLessons: "Недавние занятия",
    viewAll: "Смотреть все",
    statusTitle: "Статус заданий",
    status: { submitted: "Сдано", inProgress: "В процессе", notSubmitted: "Не сдано" },
    quickCreate: "Быстрое создание",
    qc: {
      presentation: "Презентация",
      test: "Тест",
      crossword: "Кроссворд",
      interactive: "Интерактив",
      lessonPlan: "План лекции",
      quiz: "Квиз",
      flashcard: "Карточки",
      mindmap: "Mind Map",
    },
    gen: {
      title: "ИИ-генератор материалов",
      subtitle: "Создать новый материал",
      klass: "Курс",
      subject: "Предмет",
      topic: "Тема",
      topicPlaceholder: "напр. Механизм фотосинтеза",
      duration: "Длительность занятия",
      language: "Язык",
      materialsToGenerate: "Материалы для генерации",
      button: "Создать с ИИ",
      generating: "Генерация...",
      ready: "Готово!",
      slidesWord: "слайдов",
      questionsWord: "вопросов",
    },
    mat: {
      presentation: "Презентация",
      lessonPlan: "План лекции",
      test: "Тест",
      crossword: "Кроссворд",
      interactive: "Интерактив",
      homework: "Домашнее задание",
      rubric: "Рубрика оценки",
      export: "Экспорт PDF и PPT",
    },
    welcome: "Добро пожаловать",
    achievements: "Достижения",
    pointsWord: "очк.",
    reports: {
      title: "Отчёты",
      tabAll: "Общий",
      tabLessons: "По курсам",
      tabStudents: "По ученикам",
      distribution: "Распределение оценок",
      dynamics: "Динамика результатов",
      avgScore: "Средний балл",
      completedRate: "Завершено",
      activeStudents: "Активные ученики",
      avgTime: "Среднее время",
    },
    dist: {
      excellent: "Отлично (90-100)",
      good: "Хорошо (70-89)",
      satisfactory: "Удовл. (50-69)",
      poor: "Плохо (<50)",
    },
    ach: {
      explorer: "Исследователь",
      taskMaster: "Мастер заданий",
      topStudent: "Отличник",
    },
    empty: {
      noMaterials: "Материалы ещё не созданы",
      noSubmissions: "Пока нет сдач",
    },
    essay: {
      task: "Задание",
      guidance: "Рекомендация",
      criteria: "Критерии оценки",
      expected: "Ожидаемый объём",
      yourAnswer: "Ваш ответ",
      placeholder: "Напишите ваш ответ здесь...",
      submit: "Отправить и оценить",
      submitting: "Оценивается...",
      submitted: "Отправлено",
      feedbackTitle: "Анализ и отзыв ИИ",
      strengths: "Сильные стороны",
      improvements: "Можно улучшить",
      detailed: "Подробный отзыв",
      scoreLabel: "Оценка",
      pending: "Оценка ИИ недоступна — преподаватель проверит вручную.",
      notFound: "Задание не найдено",
      back: "Назад",
    },
    analytics: {
      title: "Аналитика и статистика",
      subtitle: "Реальные показатели по вашим группам",
      avgScore: "Средний балл",
      completion: "Доля сдач",
      active: "Активные студенты",
      submissions: "Всего сдач",
      distribution: "Распределение оценок",
      timeline: "Динамика результатов",
      students: "Прогресс студентов",
      insights: "Рекомендации",
      thStudent: "Студент",
      thSubs: "Сдачи",
      thAvg: "Средний",
      thLast: "Активность",
      noData: "Данных пока нет. Когда студенты выполнят задания, аналитика появится здесь.",
    },
  },
};
