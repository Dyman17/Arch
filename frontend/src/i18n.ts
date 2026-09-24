export interface Copy {
  hello: string
  prompt: string
  listening: string
  processing: string
  repeat: string
  offline: string
  alwaysOpen: string
  closed: string
  approximate: string
  walk: string
  transit: string
  scan: string
  qrHint: string
  artistic: string
  sleepHint: string
  microphone: string
}

const copy: Record<'kk' | 'ru' | 'en', Copy> = {
  kk: {
    hello: 'Сәлем! Маңғыстауды бірге зерттейік.',
    prompt: 'Қайда барғыңыз келетінін дауыстап айтыңыз',
    listening: 'Тыңдап тұрмын…',
    processing: 'Маршрутты дайындап жатырмын…',
    repeat: 'Кешіріңіз, түсінбедім. Қайталап айтыңыз.',
    offline: 'Желі жоқ — соңғы сақталған орындарды көрсетіп тұрмын',
    alwaysOpen: 'Әрқашан ашық',
    closed: 'Қазір жабық',
    approximate: 'Шамамен берілген бағыт',
    walk: 'Жаяу',
    transit: 'Көлікпен',
    scan: 'Телефонмен сканерлеңіз',
    qrHint: 'Маршрут телефоныңызда ашылады',
    artistic: 'Көркем реконструкция',
    sleepHint: 'Маған жақындап, сұрағыңызды дауыстап айтыңыз',
    microphone: 'Микрофонға рұқсат қажет',
  },
  ru: {
    hello: 'Здравствуйте! Давайте исследовать Мангистау.',
    prompt: 'Скажите вслух, куда хотите отправиться',
    listening: 'Слушаю…',
    processing: 'Готовлю маршрут…',
    repeat: 'Не расслышал. Пожалуйста, повторите.',
    offline: 'Нет сети — показываю сохранённые места',
    alwaysOpen: 'Открыто всегда',
    closed: 'Сейчас закрыто',
    approximate: 'Примерный путь',
    walk: 'Пешком',
    transit: 'На транспорте',
    scan: 'Сканируйте телефоном',
    qrHint: 'Маршрут откроется на вашем телефоне',
    artistic: 'Художественная реконструкция',
    sleepHint: 'Подойдите и задайте вопрос вслух',
    microphone: 'Нужен доступ к микрофону',
  },
  en: {
    hello: "Hello! Let's explore Mangystau.",
    prompt: 'Say where you would like to go',
    listening: 'Listening…',
    processing: 'Preparing your route…',
    repeat: 'I did not catch that. Please repeat.',
    offline: 'Offline — showing the saved catalogue',
    alwaysOpen: 'Always open',
    closed: 'Closed now',
    approximate: 'Approximate route',
    walk: 'Walking',
    transit: 'By transit',
    scan: 'Scan with your phone',
    qrHint: 'The route will open on your phone',
    artistic: 'Artistic reconstruction',
    sleepHint: 'Come closer and ask your question aloud',
    microphone: 'Microphone access is required',
  },
}

export function getCopy(lang: string): Copy {
  const base = lang.toLowerCase().split('-')[0] as keyof typeof copy
  return copy[base] ?? copy.ru
}
