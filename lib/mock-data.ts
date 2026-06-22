// Mock data for the demo dashboards (no backend required).

/* ---------------- Teacher dashboard ---------------- */

export const teacherStats = [
  { key: "lessons", value: "12", delta: "+2", color: "violet", icon: "book" },
  { key: "assignments", value: "8", delta: "3", color: "blue", icon: "clipboard" },
  { key: "students", value: "156", delta: "+12", color: "emerald", icon: "users" },
  { key: "avgScore", value: "78%", delta: "+5%", color: "amber", icon: "target" },
] as const;

export const recentLessons = [
  { title: "Fotosintezning molekulyar mexanizmi", meta: "2-kurs · Molekulyar biologiya", time: "10:00", color: "violet" },
  { title: "Chiziqli algebra asoslari", meta: "1-kurs · Oliy matematika", time: "11:30", color: "blue" },
  { title: "Mikroiqtisodiyot nazariyasi", meta: "2-kurs · Iqtisodiyot", time: "13:00", color: "amber" },
  { title: "Akademik ingliz tili", meta: "1-kurs · Chet tili", time: "14:30", color: "emerald" },
];

export const assignmentStatus = [
  { key: "submitted", value: 72, count: 23, color: "#7c5cff" },
  { key: "inProgress", value: 19, count: 6, color: "#3b82f6" },
  { key: "notSubmitted", value: 9, count: 3, color: "#f43f5e" },
];

export const quickCreate = [
  { key: "presentation", icon: "presentation", color: "violet" },
  { key: "test", icon: "listChecks", color: "blue" },
  { key: "crossword", icon: "grid", color: "amber" },
  { key: "interactive", icon: "mousePointer", color: "pink" },
  { key: "lessonPlan", icon: "fileText", color: "emerald" },
  { key: "quiz", icon: "helpCircle", color: "orange" },
  { key: "flashcard", icon: "layers", color: "cyan" },
  { key: "mindmap", icon: "share2", color: "indigo" },
];

export const classPerformance = [
  { label: "201", value: 86 },
  { label: "202", value: 72 },
  { label: "203", value: 91 },
  { label: "204", value: 64 },
  { label: "205", value: 78 },
];

export const teacherAssignments = [
  { id: 1, title: "Photosynthesis report", grade: "201", submitted: 22, total: 28 },
  { id: 2, title: "Cell structure quiz", grade: "203", submitted: 19, total: 25 },
  { id: 3, title: "Ecosystems essay", grade: "205", submitted: 12, total: 24 },
];

/* ---------------- AI material generator ---------------- */

export const materialTypes = [
  { key: "presentation", note: "15" },
  { key: "lessonPlan", note: "" },
  { key: "test", note: "20" },
  { key: "crossword", note: "" },
  { key: "interactive", note: "" },
  { key: "homework", note: "" },
  { key: "rubric", note: "" },
  { key: "export", note: "PDF / PPT" },
];

/* ---------------- Student dashboard ---------------- */

export const studentStats = [
  { key: "assignments", value: "6", color: "violet", icon: "clipboard" },
  { key: "completed", value: "12", color: "emerald", icon: "checkCircle" },
  { key: "avgScore", value: "85%", color: "blue", icon: "target" },
  { key: "points", value: "890", color: "amber", icon: "trophy" },
];

export const studentAssignments = [
  { id: 1, title: "Fotosintez bo'yicha test", subject: "Molekulyar biologiya", due: "Bugun 23:59", progress: 100, done: true },
  { id: 2, title: "Chiziqli algebra masalalari", subject: "Oliy matematika", due: "Ertaga 18:00", progress: 60, done: false },
  { id: 3, title: "Akademik esse", subject: "Chet tili", due: "26-iyun", progress: 30, done: false },
  { id: 4, title: "Mikroiqtisodiyot referati", subject: "Iqtisodiyot", due: "29-iyun", progress: 0, done: false },
];

export const studentAchievements = [
  { emoji: "🔎", titleKey: "explorer", points: 100 },
  { emoji: "🏅", titleKey: "taskMaster", points: 200 },
  { emoji: "🌟", titleKey: "topStudent", points: 500 },
];

/* ---------------- Reports ---------------- */

export const reportsStats = [
  { key: "avgScore", value: "78%", delta: "+5%" },
  { key: "completedRate", value: "86%", delta: "+8%" },
  { key: "activeStudents", value: "25/28", delta: "+3" },
  { key: "avgTime", value: "32m", delta: "-4" },
];

export const reportsDistribution = [
  { key: "excellent", value: 45, count: 11, color: "#7c5cff" },
  { key: "good", value: 30, count: 12, color: "#3b82f6" },
  { key: "satisfactory", value: 18, count: 6, color: "#10b981" },
  { key: "poor", value: 7, count: 2, color: "#f43f5e" },
];

export const resultsDynamics = [
  { label: "Du", value: 62 },
  { label: "Se", value: 70 },
  { label: "Ch", value: 66 },
  { label: "Pa", value: 78 },
  { label: "Ju", value: 74 },
  { label: "Sh", value: 85 },
  { label: "Ya", value: 90 },
];

/* ---------------- Lesson details ---------------- */

export const lessonStats = [
  { key: "assignments", value: "5" },
  { key: "students", value: "28" },
  { key: "avgScore", value: "82%" },
  { key: "completed", value: "23/28" },
];

export const lessonAssignments = [
  { title: "Fotosintez testi", type: "Test", submitted: 20, total: 28, time: "10:00" },
  { title: "Fotosintez krossvordi", type: "Krossvord", submitted: 18, total: 28, time: "10:30" },
  { title: "Jarayonni tushuntirish", type: "Esse", submitted: 15, total: 28, time: "11:00" },
  { title: "Rasm asosidagi topshiriq", type: "Interaktiv", submitted: 22, total: 28, time: "11:30" },
  { title: "Fotosintez bosqichlari", type: "Moslashtirish", submitted: 19, total: 28, time: "12:00" },
];

export const leaderboard = [
  { name: "Ali Valiyev", score: 95 },
  { name: "Zarina Karimova", score: 88 },
  { name: "Bobur Rahimov", score: 85 },
  { name: "Madina Tursunova", score: 82 },
  { name: "Asadbek Yo'ldoshev", score: 78 },
];

/* ---------------- Presentation ---------------- */

export const presentationSlides = [
  {
    title: "Fotosintez jarayoni",
    subtitle: "O'simliklarning hayot manbai",
    body: "Fotosintez — bu o'simliklar quyosh nuri yordamida karbonat angidrid va suvdan organik moddalar hosil qilish jarayoni.",
    formula: "CO₂ + H₂O → O₂ + Organik modda",
    points: ["Yorug'lik energiyasi", "Xlorofill", "Karbonat angidrid", "Suv", "Organik modda", "Kislorod"],
    notes:
      "Fotosintez barcha tirik organizmlar uchun muhim. O'quvchilarga jarayonning energiya manbai quyosh ekanini ta'kidlang.",
  },
  {
    title: "Xlorofill va yorug'lik",
    subtitle: "Energiyani yutuvchi pigment",
    body: "Xlorofill — bargdagi yashil pigment bo'lib, quyosh yorug'ligini yutadi va energiyaga aylantiradi.",
    formula: "Yorug'lik → Kimyoviy energiya",
    points: ["Yashil rang", "Xloroplast", "Yorug'lik fazasi", "ATP hosil bo'lishi"],
    notes: "Nima uchun barglar yashil ekanini so'rang — qiziqarli muhokama ochiladi.",
  },
  {
    title: "Jarayon bosqichlari",
    subtitle: "Yorug'lik va qorong'i fazalar",
    body: "Fotosintez ikki bosqichda kechadi: yorug'lik fazasi va Kalvin sikli (qorong'i faza).",
    formula: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
    points: ["Yorug'lik fazasi", "Kalvin sikli", "Glyukoza", "Kislorod ajralishi"],
    notes: "Umumiy tenglamani doskada bosqichma-bosqich yozib chiqing.",
  },
];

/* ---------------- Quiz ---------------- */

export const quizQuestions = [
  {
    q: "Fotosintez jarayonida qaysi gaz ajralib chiqadi?",
    options: ["Azot", "Kislorod", "Karbonat angidrid", "Uglerod oksidi"],
    answer: 1,
  },
  {
    q: "Bargdagi qaysi pigment yorug'likni yutadi?",
    options: ["Gemoglobin", "Melanin", "Xlorofill", "Karotin"],
    answer: 2,
  },
  {
    q: "Fotosintez uchun zarur bo'lmagan omil qaysi?",
    options: ["Quyosh nuri", "Suv", "Karbonat angidrid", "Tuproq tuzi"],
    answer: 3,
  },
  {
    q: "Fotosintez asosan o'simlikning qaysi qismida kechadi?",
    options: ["Ildiz", "Barg", "Poya", "Gul"],
    answer: 1,
  },
  {
    q: "Fotosintez natijasida qanday organik modda hosil bo'ladi?",
    options: ["Oqsil", "Glyukoza", "Yog'", "Vitamin"],
    answer: 1,
  },
];

/* ---------------- Generator output (simulated) ---------------- */

export const mockSlides = (topic: string) => [
  `${topic}: kirish va asosiy tushunchalar`,
  `${topic} nima uchun muhim`,
  `Jarayon bosqichma-bosqich`,
  `Diagramma va vizual tahlil`,
  `Hayotiy misollar`,
  `Xulosa va tezkor tekshiruv`,
];
