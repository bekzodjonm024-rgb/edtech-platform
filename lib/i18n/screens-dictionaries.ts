import type { Locale } from "./dictionaries";

export type ScreensDict = {
  lesson: {
    details: string;
    tabs: { main: string; assignments: string; students: string; reports: string; library: string };
    stat: { assignments: string; students: string; avgScore: string; completed: string };
    activeStudents: string;
    dynamics: string;
    newAssignment: string;
    edit: string;
    share: string;
  };
  present: {
    title: string;
    speakerNotes: string;
    keyConcepts: string;
    prev: string;
    next: string;
    edit: string;
    download: string;
    backToLesson: string;
  };
  quiz: {
    title: string;
    questions: string;
    answered: string;
    current: string;
    notAnswered: string;
    prev: string;
    next: string;
    submit: string;
    timeLeft: string;
    yourResult: string;
    correctLabel: string;
    incorrectLabel: string;
    skippedLabel: string;
    good: string;
    excellent: string;
    keepGoing: string;
    reviewMistakes: string;
    retry: string;
    back: string;
    review: string;
    yourAnswer: string;
    correctAnswer: string;
    skippedAnswer: string;
  };
  tutor: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    greeting: string;
    canned: string;
    suggest1: string;
    suggest2: string;
  };
};

export const screensDictionaries: Record<Locale, ScreensDict> = {
  uz: {
    lesson: {
      details: "Mashg'ulot tafsilotlari",
      tabs: { main: "Asosiy", assignments: "Topshiriqlar", students: "Talabalar", reports: "Hisobotlar", library: "Kutubxona" },
      stat: { assignments: "Topshiriqlar", students: "Talabalar", avgScore: "O'rtacha natija", completed: "Yakunlangan" },
      activeStudents: "Faol talabalar",
      dynamics: "Natijalar dinamikasi",
      newAssignment: "Yangi topshiriq yaratish",
      edit: "Tahrirlash",
      share: "Ulashish",
    },
    present: {
      title: "Taqdimot",
      speakerNotes: "Spiker izohlari",
      keyConcepts: "Asosiy tushunchalar",
      prev: "Oldingi",
      next: "Keyingi",
      edit: "Tahrirlash",
      download: "Yuklab olish",
      backToLesson: "Mashg'ulotga qaytish",
    },
    quiz: {
      title: "Fotosintez testi",
      questions: "Savollar",
      answered: "Javob berilgan",
      current: "Joriy savol",
      notAnswered: "Javob berilmagan",
      prev: "Oldingi",
      next: "Keyingi",
      submit: "Topshirish",
      timeLeft: "Qolgan vaqt",
      yourResult: "Sizning natijangiz",
      correctLabel: "To'g'ri javoblar",
      incorrectLabel: "Noto'g'ri javoblar",
      skippedLabel: "Tashlab ketilgan",
      good: "Yaxshi!",
      excellent: "Ajoyib!",
      keepGoing: "Davom eting!",
      reviewMistakes: "Xatolarni ko'rish",
      retry: "Qaytadan",
      back: "Panelga qaytish",
      review: "Javoblarni ko'rish",
      yourAnswer: "Sizning javobingiz",
      correctAnswer: "To'g'ri javob",
      skippedAnswer: "O'tkazib yuborilgan",
    },
    tutor: {
      title: "AI Tutor",
      subtitle: "Savolingizni yozing — tushuntirib beraman",
      placeholder: "Savol yozing...",
      send: "Yuborish",
      greeting: "Salom, Ali! Men sizning AI tutoringizman. Fotosintez yoki boshqa mavzu bo'yicha savol bering.",
      canned:
        "Fotosintez — o'simliklar quyosh nuri, suv va karbonat angidriddan organik modda (glyukoza) va kislorod hosil qiladigan jarayon. Xlorofill yorug'lik energiyasini yutadi va uni kimyoviy energiyaga aylantiradi.",
      suggest1: "Fotosintez nima?",
      suggest2: "Xlorofillning vazifasi nima?",
    },
  },
  en: {
    lesson: {
      details: "Session details",
      tabs: { main: "Overview", assignments: "Assignments", students: "Students", reports: "Reports", library: "Library" },
      stat: { assignments: "Assignments", students: "Students", avgScore: "Avg. score", completed: "Completed" },
      activeStudents: "Active students",
      dynamics: "Score dynamics",
      newAssignment: "Create new assignment",
      edit: "Edit",
      share: "Share",
    },
    present: {
      title: "Presentation",
      speakerNotes: "Speaker notes",
      keyConcepts: "Key concepts",
      prev: "Prev",
      next: "Next",
      edit: "Edit",
      download: "Download",
      backToLesson: "Back to session",
    },
    quiz: {
      title: "Photosynthesis quiz",
      questions: "Questions",
      answered: "Answered",
      current: "Current",
      notAnswered: "Not answered",
      prev: "Prev",
      next: "Next",
      submit: "Submit",
      timeLeft: "Time left",
      yourResult: "Your result",
      correctLabel: "Correct answers",
      incorrectLabel: "Wrong answers",
      skippedLabel: "Skipped",
      good: "Good!",
      excellent: "Excellent!",
      keepGoing: "Keep going!",
      reviewMistakes: "Review mistakes",
      retry: "Try again",
      back: "Back to dashboard",
      review: "Review answers",
      yourAnswer: "Your answer",
      correctAnswer: "Correct answer",
      skippedAnswer: "Skipped",
    },
    tutor: {
      title: "AI Tutor",
      subtitle: "Ask a question — I'll explain it",
      placeholder: "Type a question...",
      send: "Send",
      greeting: "Hi Ali! I'm your AI tutor. Ask me about photosynthesis or any topic.",
      canned:
        "Photosynthesis is the process by which plants make organic matter (glucose) and oxygen from sunlight, water and carbon dioxide. Chlorophyll absorbs light energy and converts it into chemical energy.",
      suggest1: "What is photosynthesis?",
      suggest2: "What does chlorophyll do?",
    },
  },
  ru: {
    lesson: {
      details: "Детали занятия",
      tabs: { main: "Обзор", assignments: "Задания", students: "Ученики", reports: "Отчёты", library: "Библиотека" },
      stat: { assignments: "Задания", students: "Ученики", avgScore: "Средний балл", completed: "Завершено" },
      activeStudents: "Активные ученики",
      dynamics: "Динамика результатов",
      newAssignment: "Создать задание",
      edit: "Редактировать",
      share: "Поделиться",
    },
    present: {
      title: "Презентация",
      speakerNotes: "Заметки докладчика",
      keyConcepts: "Ключевые понятия",
      prev: "Назад",
      next: "Далее",
      edit: "Редактировать",
      download: "Скачать",
      backToLesson: "К занятию",
    },
    quiz: {
      title: "Тест по фотосинтезу",
      questions: "Вопросы",
      answered: "Отвечено",
      current: "Текущий",
      notAnswered: "Без ответа",
      prev: "Назад",
      next: "Далее",
      submit: "Отправить",
      timeLeft: "Осталось",
      yourResult: "Ваш результат",
      correctLabel: "Верные ответы",
      incorrectLabel: "Неверные ответы",
      skippedLabel: "Пропущено",
      good: "Хорошо!",
      excellent: "Отлично!",
      keepGoing: "Продолжайте!",
      reviewMistakes: "Разбор ошибок",
      retry: "Заново",
      back: "На панель",
      review: "Просмотр ответов",
      yourAnswer: "Ваш ответ",
      correctAnswer: "Правильный ответ",
      skippedAnswer: "Пропущено",
    },
    tutor: {
      title: "ИИ-репетитор",
      subtitle: "Задайте вопрос — я объясню",
      placeholder: "Введите вопрос...",
      send: "Отправить",
      greeting: "Привет, Али! Я твой ИИ-репетитор. Спроси про фотосинтез или другую тему.",
      canned:
        "Фотосинтез — процесс, при котором растения из солнечного света, воды и углекислого газа создают органическое вещество (глюкозу) и кислород. Хлорофилл поглощает энергию света и превращает её в химическую.",
      suggest1: "Что такое фотосинтез?",
      suggest2: "Что делает хлорофилл?",
    },
  },
};
