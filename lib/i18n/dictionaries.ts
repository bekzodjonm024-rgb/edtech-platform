export type Locale = "uz" | "en" | "ru";

export const locales: Locale[] = ["uz", "en", "ru"];

export const localeNames: Record<Locale, string> = {
  uz: "O'zbek",
  en: "English",
  ru: "Русский",
};

type Dict = {
  nav: {
    features: string;
    pricing: string;
    about: string;
    launch: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stat1: string;
    stat1Label: string;
    stat2: string;
    stat2Label: string;
    stat3: string;
    stat3Label: string;
  };
  problems: {
    title: string;
    subtitle: string;
    teachers: string;
    students: string;
    teacherItems: string[];
    studentItems: string[];
  };
  vision: {
    title: string;
    subtitle: string;
    forTeachers: string;
    forStudents: string;
    teacherPoints: string[];
    studentPoints: string[];
  };
  features: {
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  how: {
    title: string;
    subtitle: string;
    steps: { title: string; desc: string }[];
  };
  roadmap: {
    title: string;
    subtitle: string;
    phases: { period: string; title: string; desc: string }[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    tagline: string;
    product: string;
    company: string;
    rights: string;
  };
  demo: {
    teacherTitle: string;
    studentTitle: string;
    back: string;
    todayClasses: string;
    quickActions: string;
    createPresentation: string;
    createQuiz: string;
    classPerformance: string;
    topic: string;
    grade: string;
    duration: string;
    language: string;
    generate: string;
    generating: string;
    preview: string;
    slides: string;
    questions: string;
    addQuestion: string;
    assignments: string;
    deadline: string;
    progress: string;
    overallProgress: string;
    achievements: string;
    submit: string;
    submitted: string;
    placeholderTopic: string;
  };
};

export const dictionaries: Record<Locale, Dict> = {
  uz: {
    nav: {
      features: "Imkoniyatlar",
      pricing: "Narxlar",
      about: "Loyiha haqida",
      launch: "Boshlash",
    },
    hero: {
      badge: "AI bilan ishlaydigan ta'lim platformasi",
      title1: "Bitta mavzu —",
      title2: "to'liq o'quv ekotizimi",
      subtitle:
        "EduAI OS professor-o'qituvchilar va talabalar uchun bitta mavzudan to'liq o'quv materiallarini avtomatik yaratadi: ma'ruza taqdimotlari, testlar, topshiriqlar va tahlil.",
      ctaPrimary: "Boshlash",
      ctaSecondary: "Imkoniyatlar",
      stat1: "10x",
      stat1Label: "tezroq tayyorgarlik",
      stat2: "3",
      stat2Label: "til qo'llab-quvvatlash",
      stat3: "24/7",
      stat3Label: "AI yordamchi",
    },
    problems: {
      title: "Ta'limdagi haqiqiy muammolar",
      subtitle: "Professor-o'qituvchi ham, talaba ham bir xil to'siqlarga duch keladi.",
      teachers: "O'qituvchilar uchun",
      students: "O'quvchilar uchun",
      teacherItems: [
        "Darsga tayyorgarlik soatlab vaqt oladi",
        "Har bir guruh uchun alohida material",
        "Testlarni qo'lda tuzish charchatadi",
        "Baholash va tahlil sekin",
        "Zamonaviy resurslar yetishmaydi",
        "Har bir talabaga e'tibor qiyin",
      ],
      studentItems: [
        "Material zerikarli va bir xil",
        "Shaxsiy yondashuv yo'q",
        "Tushunmagan joyni so'rash qiyin",
        "Fikr-mulohaza kech keladi",
        "Motivatsiya tez yo'qoladi",
        "Bilim darajasi nazoratsiz",
      ],
    },
    vision: {
      title: "Bizning yechimimiz",
      subtitle: "Bir platforma — ikki tomon uchun ham kuch.",
      forTeachers: "O'qituvchilarga",
      forStudents: "O'quvchilarga",
      teacherPoints: [
        "Mavzudan avtomatik taqdimot va test",
        "Sinf bo'yicha tahlil va statistika",
        "Topshiriqlarni bir tugma bilan tarqatish",
        "Vaqtni 10 barobar tejash",
      ],
      studentPoints: [
        "Shaxsiy o'quv yo'li",
        "Darhol fikr-mulohaza va baho",
        "Interaktiv testlar va yutuqlar",
        "Istalgan vaqtda AI yordamchi",
      ],
    },
    features: {
      title: "Asosiy imkoniyatlar",
      subtitle: "Ta'lim jarayonini boshidan oxirigacha qamrab oladi.",
      items: [
        { title: "Taqdimot generatori", desc: "Mavzu kiriting — tayyor slaydlar oling." },
        { title: "Aqlli testlar", desc: "Har xil murakkablikdagi savollar avtomatik." },
        { title: "Topshiriqlar", desc: "Yaratish, tarqatish va baholash bir joyda." },
        { title: "Tahlil paneli", desc: "Guruh va talaba progressini real vaqtda." },
        { title: "3 til", desc: "O'zbek, Ingliz va Rus tillarida ishlaydi." },
        { title: "AI yordamchi", desc: "24/7 savol-javob va tushuntirish." },
      ],
    },
    how: {
      title: "Qanday ishlaydi",
      subtitle: "Uch oddiy qadam.",
      steps: [
        { title: "Mavzuni kiriting", desc: "Masalan: 'Fotosintez mexanizmi, 2-kurs'." },
        { title: "AI yaratadi", desc: "Taqdimot, test va topshiriq sekundlarda tayyor." },
        { title: "Darsda foydalaning", desc: "Tarqating, baholang, progressni kuzating." },
      ],
    },
    roadmap: {
      title: "Rivojlanish rejasi",
      subtitle: "3 yillik aniq yo'l xaritasi.",
      phases: [
        { period: "2026 Q1–Q2", title: "MVP ishga tushishi", desc: "Landing va asosiy generatorlar." },
        { period: "2026 Q3–Q4", title: "Real AI integratsiya", desc: "Backend, baza va Claude API ulanishi." },
        { period: "2027", title: "Universitetlar uchun", desc: "Guruh boshqaruvi, reyting jurnali va hisobotlar." },
        { period: "2028", title: "Mobil va miqyos", desc: "Mobil ilova va xalqaro kengayish." },
      ],
    },
    cta: {
      title: "Ta'limni birga o'zgartiramiz",
      subtitle: "Bepul ro'yxatdan o'ting va bugundan AI bilan dars yaratishni boshlang.",
      button: "Boshlash",
    },
    footer: {
      tagline: "Bitta mavzu — to'liq o'quv ekotizimi.",
      product: "Mahsulot",
      company: "Kompaniya",
      rights: "Barcha huquqlar himoyalangan.",
    },
    demo: {
      teacherTitle: "O'qituvchi paneli",
      studentTitle: "O'quvchi paneli",
      back: "Bosh sahifa",
      todayClasses: "Bugungi darslar",
      quickActions: "Tezkor amallar",
      createPresentation: "Taqdimot yaratish",
      createQuiz: "Test yaratish",
      classPerformance: "Sinf ko'rsatkichlari",
      topic: "Mavzu",
      grade: "Sinf",
      duration: "Davomiyligi (daqiqa)",
      language: "Til",
      generate: "Yaratish",
      generating: "Yaratilmoqda...",
      preview: "Ko'rinish",
      slides: "Slaydlar",
      questions: "Savollar",
      addQuestion: "Savol qo'shish",
      assignments: "Topshiriqlar",
      deadline: "Muddat",
      progress: "Bajarildi",
      overallProgress: "Umumiy progress",
      achievements: "Yutuqlar",
      submit: "Topshirish",
      submitted: "Topshirildi ✓",
      placeholderTopic: "Masalan: Fotosintez",
    },
  },
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      about: "About",
      launch: "Get started",
    },
    hero: {
      badge: "AI-powered education platform",
      title1: "One topic —",
      title2: "a complete learning ecosystem",
      subtitle:
        "EduAI OS turns a single topic into complete learning materials for university faculty and students: lecture decks, quizzes, assignments and analytics.",
      ctaPrimary: "Get started",
      ctaSecondary: "See features",
      stat1: "10x",
      stat1Label: "faster prep",
      stat2: "3",
      stat2Label: "languages supported",
      stat3: "24/7",
      stat3Label: "AI assistant",
    },
    problems: {
      title: "Real problems in education",
      subtitle: "Teachers and students hit the same walls.",
      teachers: "For teachers",
      students: "For students",
      teacherItems: [
        "Lesson prep takes hours",
        "Separate materials for each group",
        "Building quizzes by hand is tiring",
        "Grading and analysis are slow",
        "Modern resources are scarce",
        "Hard to focus on every student",
      ],
      studentItems: [
        "Materials are dull and uniform",
        "No personal approach",
        "Hard to ask about what's unclear",
        "Feedback arrives too late",
        "Motivation fades quickly",
        "Knowledge level goes untracked",
      ],
    },
    vision: {
      title: "Our solution",
      subtitle: "One platform — power for both sides.",
      forTeachers: "For teachers",
      forStudents: "For students",
      teacherPoints: [
        "Auto presentations and quizzes from a topic",
        "Class-level analytics and statistics",
        "Distribute assignments in one click",
        "Save 10x the time",
      ],
      studentPoints: [
        "A personal learning path",
        "Instant feedback and grades",
        "Interactive quizzes and achievements",
        "An AI assistant anytime",
      ],
    },
    features: {
      title: "Core features",
      subtitle: "Covers the whole learning loop end to end.",
      items: [
        { title: "Presentation generator", desc: "Enter a topic — get ready-made slides." },
        { title: "Smart quizzes", desc: "Questions of varied difficulty, automatically." },
        { title: "Assignments", desc: "Create, distribute and grade in one place." },
        { title: "Analytics panel", desc: "Group and student progress in real time." },
        { title: "3 languages", desc: "Works in Uzbek, English and Russian." },
        { title: "AI assistant", desc: "24/7 Q&A and explanations." },
      ],
    },
    how: {
      title: "How it works",
      subtitle: "Three simple steps.",
      steps: [
        { title: "Enter a topic", desc: "For example: 'Photosynthesis mechanism, year 2'." },
        { title: "AI generates", desc: "Slides, quiz and assignment ready in seconds." },
        { title: "Use it in class", desc: "Distribute, grade and track progress." },
      ],
    },
    roadmap: {
      title: "Roadmap",
      subtitle: "A clear three-year path.",
      phases: [
        { period: "2026 Q1–Q2", title: "MVP launch", desc: "Landing and core generators." },
        { period: "2026 Q3–Q4", title: "Real AI integration", desc: "Backend, database and Claude API." },
        { period: "2027", title: "For universities", desc: "Group management, gradebook and reports." },
        { period: "2028", title: "Mobile and scale", desc: "Mobile app and international expansion." },
      ],
    },
    cta: {
      title: "Let's reshape education together",
      subtitle: "Sign up free and start creating AI-powered lessons today.",
      button: "Get started",
    },
    footer: {
      tagline: "One topic — a complete learning ecosystem.",
      product: "Product",
      company: "Company",
      rights: "All rights reserved.",
    },
    demo: {
      teacherTitle: "Teacher dashboard",
      studentTitle: "Student dashboard",
      back: "Home",
      todayClasses: "Today's classes",
      quickActions: "Quick actions",
      createPresentation: "Create presentation",
      createQuiz: "Create quiz",
      classPerformance: "Class performance",
      topic: "Topic",
      grade: "Grade",
      duration: "Duration (min)",
      language: "Language",
      generate: "Generate",
      generating: "Generating...",
      preview: "Preview",
      slides: "Slides",
      questions: "Questions",
      addQuestion: "Add question",
      assignments: "Assignments",
      deadline: "Deadline",
      progress: "Done",
      overallProgress: "Overall progress",
      achievements: "Achievements",
      submit: "Submit",
      submitted: "Submitted ✓",
      placeholderTopic: "e.g. Photosynthesis",
    },
  },
  ru: {
    nav: {
      features: "Возможности",
      pricing: "Цены",
      about: "О проекте",
      launch: "Начать",
    },
    hero: {
      badge: "Образовательная платформа на базе ИИ",
      title1: "Одна тема —",
      title2: "целая экосистема обучения",
      subtitle:
        "EduAI OS превращает одну тему в полный комплект учебных материалов для преподавателей и студентов вузов: лекционные презентации, тесты, задания и аналитику.",
      ctaPrimary: "Начать",
      ctaSecondary: "Возможности",
      stat1: "10x",
      stat1Label: "быстрее подготовка",
      stat2: "3",
      stat2Label: "языка поддержки",
      stat3: "24/7",
      stat3Label: "ИИ-ассистент",
    },
    problems: {
      title: "Реальные проблемы в образовании",
      subtitle: "И преподаватели, и студенты сталкиваются с одними барьерами.",
      teachers: "Для учителей",
      students: "Для студентов",
      teacherItems: [
        "Подготовка к уроку занимает часы",
        "Отдельные материалы для каждой группы",
        "Составлять тесты вручную утомительно",
        "Оценивание и анализ медленные",
        "Не хватает современных ресурсов",
        "Сложно уделить внимание каждому",
      ],
      studentItems: [
        "Материалы скучные и одинаковые",
        "Нет индивидуального подхода",
        "Трудно спросить о непонятном",
        "Обратная связь приходит поздно",
        "Мотивация быстро падает",
        "Уровень знаний не отслеживается",
      ],
    },
    vision: {
      title: "Наше решение",
      subtitle: "Одна платформа — сила для обеих сторон.",
      forTeachers: "Учителям",
      forStudents: "Ученикам",
      teacherPoints: [
        "Авто-презентации и тесты из темы",
        "Аналитика и статистика по группе",
        "Раздача заданий в один клик",
        "Экономия времени в 10 раз",
      ],
      studentPoints: [
        "Персональная траектория обучения",
        "Мгновенная обратная связь и оценки",
        "Интерактивные тесты и достижения",
        "ИИ-ассистент в любое время",
      ],
    },
    features: {
      title: "Основные возможности",
      subtitle: "Покрывает весь учебный цикл от начала до конца.",
      items: [
        { title: "Генератор презентаций", desc: "Введите тему — получите готовые слайды." },
        { title: "Умные тесты", desc: "Вопросы разной сложности автоматически." },
        { title: "Задания", desc: "Создание, раздача и оценка в одном месте." },
        { title: "Панель аналитики", desc: "Прогресс группы и студента в реальном времени." },
        { title: "3 языка", desc: "Работает на узбекском, английском и русском." },
        { title: "ИИ-ассистент", desc: "Вопросы и объяснения 24/7." },
      ],
    },
    how: {
      title: "Как это работает",
      subtitle: "Три простых шага.",
      steps: [
        { title: "Введите тему", desc: "Например: «Механизм фотосинтеза, 2 курс»." },
        { title: "ИИ генерирует", desc: "Слайды, тест и задание готовы за секунды." },
        { title: "Используйте на уроке", desc: "Раздайте, оцените, следите за прогрессом." },
      ],
    },
    roadmap: {
      title: "Дорожная карта",
      subtitle: "Чёткий трёхлетний путь.",
      phases: [
        { period: "2026 Q1–Q2", title: "Запуск MVP", desc: "Лендинг и базовые генераторы." },
        { period: "2026 Q3–Q4", title: "Реальная интеграция ИИ", desc: "Бэкенд, база и Claude API." },
        { period: "2027", title: "Для вузов", desc: "Управление группой, рейтинговый журнал и отчёты." },
        { period: "2028", title: "Мобайл и масштаб", desc: "Мобильное приложение и выход за рубеж." },
      ],
    },
    cta: {
      title: "Изменим образование вместе",
      subtitle: "Зарегистрируйтесь бесплатно и начните создавать уроки с ИИ уже сегодня.",
      button: "Начать",
    },
    footer: {
      tagline: "Одна тема — целая экосистема обучения.",
      product: "Продукт",
      company: "Компания",
      rights: "Все права защищены.",
    },
    demo: {
      teacherTitle: "Панель учителя",
      studentTitle: "Панель ученика",
      back: "Главная",
      todayClasses: "Сегодняшние уроки",
      quickActions: "Быстрые действия",
      createPresentation: "Создать презентацию",
      createQuiz: "Создать тест",
      classPerformance: "Успеваемость класса",
      topic: "Тема",
      grade: "Класс",
      duration: "Длительность (мин)",
      language: "Язык",
      generate: "Сгенерировать",
      generating: "Генерация...",
      preview: "Предпросмотр",
      slides: "Слайды",
      questions: "Вопросы",
      addQuestion: "Добавить вопрос",
      assignments: "Задания",
      deadline: "Срок",
      progress: "Выполнено",
      overallProgress: "Общий прогресс",
      achievements: "Достижения",
      submit: "Отправить",
      submitted: "Отправлено ✓",
      placeholderTopic: "напр. Фотосинтез",
    },
  },
};
