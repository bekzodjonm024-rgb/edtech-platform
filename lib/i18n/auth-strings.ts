import type { Locale } from "./dictionaries";

export const authStrings: Record<Locale, {
  signInTitle: string;
  signUpTitle: string;
  signInSubtitle: string;
  signUpSubtitle: string;
  name: string;
  email: string;
  password: string;
  role: string;
  teacher: string;
  student: string;
  signInBtn: string;
  signUpBtn: string;
  loading: string;
  haveAccount: string;
  noAccount: string;
  toSignIn: string;
  toSignUp: string;
  logout: string;
  errInvalid: string;
  errTaken: string;
  errWeak: string;
  errGeneric: string;
  // materials
  myMaterials: string;
  myMaterialsSubtitle: string;
  noMaterials: string;
  save: string;
  saving: string;
  saved: string;
  delete: string;
  kindPresentation: string;
  kindQuiz: string;
  open: string;
}> = {
  uz: {
    signInTitle: "Tizimga kirish",
    signUpTitle: "Akkaunt yaratish",
    signInSubtitle: "Davom etish uchun hisobingizga kiring",
    signUpSubtitle: "Universitet hisobingizni yarating",
    name: "To'liq ism",
    email: "Email",
    password: "Parol",
    role: "Rol",
    teacher: "Professor-o'qituvchi",
    student: "Talaba",
    signInBtn: "Kirish",
    signUpBtn: "Ro'yxatdan o'tish",
    loading: "Yuklanmoqda...",
    haveAccount: "Akkauntingiz bormi?",
    noAccount: "Akkauntingiz yo'qmi?",
    toSignIn: "Kirish",
    toSignUp: "Ro'yxatdan o'tish",
    logout: "Chiqish",
    errInvalid: "Email yoki parol noto'g'ri",
    errTaken: "Bu email allaqachon ro'yxatdan o'tgan",
    errWeak: "Parol kamida 6 ta belgidan iborat bo'lsin",
    errGeneric: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    myMaterials: "Mening materiallarim",
    myMaterialsSubtitle: "AI yaratgan va saqlangan materiallar",
    noMaterials: "Hali material saqlanmagan. Generatordan boshlang.",
    save: "Saqlash",
    saving: "Saqlanmoqda...",
    saved: "Saqlandi ✓",
    delete: "O'chirish",
    kindPresentation: "Taqdimot",
    kindQuiz: "Test",
    open: "Ochish",
  },
  en: {
    signInTitle: "Sign in",
    signUpTitle: "Create account",
    signInSubtitle: "Sign in to your account to continue",
    signUpSubtitle: "Create your university account",
    name: "Full name",
    email: "Email",
    password: "Password",
    role: "Role",
    teacher: "Faculty",
    student: "Student",
    signInBtn: "Sign in",
    signUpBtn: "Sign up",
    loading: "Loading...",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    toSignIn: "Sign in",
    toSignUp: "Sign up",
    logout: "Log out",
    errInvalid: "Invalid email or password",
    errTaken: "This email is already registered",
    errWeak: "Password must be at least 6 characters",
    errGeneric: "Something went wrong. Please try again.",
    myMaterials: "My materials",
    myMaterialsSubtitle: "AI-generated materials you've saved",
    noMaterials: "No materials saved yet. Start from the generator.",
    save: "Save",
    saving: "Saving...",
    saved: "Saved ✓",
    delete: "Delete",
    kindPresentation: "Presentation",
    kindQuiz: "Quiz",
    open: "Open",
  },
  ru: {
    signInTitle: "Вход",
    signUpTitle: "Создать аккаунт",
    signInSubtitle: "Войдите в аккаунт, чтобы продолжить",
    signUpSubtitle: "Создайте аккаунт вуза",
    name: "Полное имя",
    email: "Email",
    password: "Пароль",
    role: "Роль",
    teacher: "Преподаватель",
    student: "Студент",
    signInBtn: "Войти",
    signUpBtn: "Регистрация",
    loading: "Загрузка...",
    haveAccount: "Уже есть аккаунт?",
    noAccount: "Нет аккаунта?",
    toSignIn: "Войти",
    toSignUp: "Регистрация",
    logout: "Выйти",
    errInvalid: "Неверный email или пароль",
    errTaken: "Этот email уже зарегистрирован",
    errWeak: "Пароль должен быть не короче 6 символов",
    errGeneric: "Произошла ошибка. Попробуйте снова.",
    myMaterials: "Мои материалы",
    myMaterialsSubtitle: "Сохранённые материалы, созданные ИИ",
    noMaterials: "Материалы ещё не сохранены. Начните с генератора.",
    save: "Сохранить",
    saving: "Сохранение...",
    saved: "Сохранено ✓",
    delete: "Удалить",
    kindPresentation: "Презентация",
    kindQuiz: "Тест",
    open: "Открыть",
  },
};
