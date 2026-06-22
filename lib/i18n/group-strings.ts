import type { Locale } from "./dictionaries";

export const groupStrings: Record<Locale, {
  title: string;
  teacherSubtitle: string;
  studentSubtitle: string;
  createGroup: string;
  groupName: string;
  groupNamePlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  create: string;
  creating: string;
  inviteCode: string;
  shareHint: string;
  copy: string;
  copied: string;
  members: string;
  noMembers: string;
  view: string;
  delete: string;
  remove: string;
  back: string;
  joinGroup: string;
  enterCode: string;
  join: string;
  joining: string;
  teacher: string;
  noGroupsTeacher: string;
  noGroupsStudent: string;
  joined: string;
  errInvalidCode: string;
  errAlreadyMember: string;
  errGeneric: string;
  assignedTitle: string;
  assign: string;
  selectMaterial: string;
  noAssigned: string;
  noMaterialsToAssign: string;
  take: string;
  open: string;
  unassign: string;
  kindQuiz: string;
  kindPresentation: string;
  results: string;
  avg: string;
  noSubmissions: string;
  due: string;
  overdue: string;
  optionalDue: string;
}> = {
  uz: {
    title: "Guruhlar",
    teacherSubtitle: "Guruh yarating va talabalarni taklif kodi orqali biriktiring",
    studentSubtitle: "O'qituvchi bergan kod orqali guruhga qo'shiling",
    createGroup: "Yangi guruh",
    groupName: "Guruh nomi",
    groupNamePlaceholder: "Masalan: 201-guruh",
    subject: "Fan / kurs",
    subjectPlaceholder: "Masalan: Molekulyar biologiya",
    create: "Yaratish",
    creating: "Yaratilmoqda...",
    inviteCode: "Taklif kodi",
    shareHint: "Bu kodni talabalarga bering — ular shu kod bilan qo'shiladi",
    copy: "Nusxalash",
    copied: "Nusxalandi ✓",
    members: "Talabalar",
    noMembers: "Hali talaba qo'shilmagan",
    view: "Ko'rish",
    delete: "O'chirish",
    remove: "Chiqarish",
    back: "Orqaga",
    joinGroup: "Guruhga qo'shilish",
    enterCode: "Taklif kodini kiriting",
    join: "Qo'shilish",
    joining: "Qo'shilmoqda...",
    teacher: "O'qituvchi",
    noGroupsTeacher: "Hali guruh yo'q. Birinchisini yarating.",
    noGroupsStudent: "Hali guruhga qo'shilmagansiz. Yuqoridagi kod orqali qo'shiling.",
    joined: "Qo'shildingiz ✓",
    errInvalidCode: "Bunday kod topilmadi",
    errAlreadyMember: "Siz allaqachon bu guruhdasiz",
    errGeneric: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    assignedTitle: "Biriktirilgan materiallar",
    assign: "Biriktirish",
    selectMaterial: "Material tanlang",
    noAssigned: "Hali material biriktirilmagan",
    noMaterialsToAssign: "Avval generatordan material saqlang",
    take: "Yechish",
    open: "Ochish",
    unassign: "Olib tashlash",
    kindQuiz: "Test",
    kindPresentation: "Taqdimot",
    results: "Natijalar",
    avg: "O'rtacha",
    noSubmissions: "Hali hech kim yechmagan",
    due: "Muddat",
    overdue: "Muddati o'tdi",
    optionalDue: "Muddat (ixtiyoriy)",
  },
  en: {
    title: "Groups",
    teacherSubtitle: "Create a group and enroll students with an invite code",
    studentSubtitle: "Join a group using the code your instructor gives you",
    createGroup: "New group",
    groupName: "Group name",
    groupNamePlaceholder: "e.g. Group 201",
    subject: "Subject / course",
    subjectPlaceholder: "e.g. Molecular biology",
    create: "Create",
    creating: "Creating...",
    inviteCode: "Invite code",
    shareHint: "Share this code with students — they join with it",
    copy: "Copy",
    copied: "Copied ✓",
    members: "Students",
    noMembers: "No students yet",
    view: "View",
    delete: "Delete",
    remove: "Remove",
    back: "Back",
    joinGroup: "Join a group",
    enterCode: "Enter invite code",
    join: "Join",
    joining: "Joining...",
    teacher: "Instructor",
    noGroupsTeacher: "No groups yet. Create your first one.",
    noGroupsStudent: "You haven't joined a group yet. Use a code above to join.",
    joined: "Joined ✓",
    errInvalidCode: "No group with that code",
    errAlreadyMember: "You're already in this group",
    errGeneric: "Something went wrong. Please try again.",
    assignedTitle: "Assigned materials",
    assign: "Assign",
    selectMaterial: "Select material",
    noAssigned: "No materials assigned yet",
    noMaterialsToAssign: "Save a material from the generator first",
    take: "Take",
    open: "Open",
    unassign: "Remove",
    kindQuiz: "Quiz",
    kindPresentation: "Presentation",
    results: "Results",
    avg: "Average",
    noSubmissions: "No one has taken it yet",
    due: "Due",
    overdue: "Overdue",
    optionalDue: "Due date (optional)",
  },
  ru: {
    title: "Группы",
    teacherSubtitle: "Создайте группу и добавьте студентов по коду приглашения",
    studentSubtitle: "Присоединитесь к группе по коду от преподавателя",
    createGroup: "Новая группа",
    groupName: "Название группы",
    groupNamePlaceholder: "напр. Группа 201",
    subject: "Предмет / курс",
    subjectPlaceholder: "напр. Молекулярная биология",
    create: "Создать",
    creating: "Создание...",
    inviteCode: "Код приглашения",
    shareHint: "Передайте этот код студентам — они присоединятся по нему",
    copy: "Копировать",
    copied: "Скопировано ✓",
    members: "Студенты",
    noMembers: "Студентов пока нет",
    view: "Открыть",
    delete: "Удалить",
    remove: "Исключить",
    back: "Назад",
    joinGroup: "Присоединиться к группе",
    enterCode: "Введите код приглашения",
    join: "Присоединиться",
    joining: "Присоединение...",
    teacher: "Преподаватель",
    noGroupsTeacher: "Групп пока нет. Создайте первую.",
    noGroupsStudent: "Вы ещё не в группе. Используйте код выше.",
    joined: "Вы присоединились ✓",
    errInvalidCode: "Группа с таким кодом не найдена",
    errAlreadyMember: "Вы уже в этой группе",
    errGeneric: "Произошла ошибка. Попробуйте снова.",
    assignedTitle: "Назначенные материалы",
    assign: "Назначить",
    selectMaterial: "Выберите материал",
    noAssigned: "Материалы ещё не назначены",
    noMaterialsToAssign: "Сначала сохраните материал в генераторе",
    take: "Решить",
    open: "Открыть",
    unassign: "Убрать",
    kindQuiz: "Тест",
    kindPresentation: "Презентация",
    results: "Результаты",
    avg: "Средний",
    noSubmissions: "Ещё никто не прошёл",
    due: "Срок",
    overdue: "Просрочено",
    optionalDue: "Срок (необязательно)",
  },
};
