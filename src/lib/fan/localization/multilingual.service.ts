import { SupportedLanguage } from '../types';
import { fanContextService } from '../context/fan-context.service';

export const Translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'fan.welcome': 'Welcome to the FIFA World Cup 2026',
    'fan.copilot.placeholder': 'Ask me anything (e.g. "Where is my seat?")',
    'fan.navigation.title': 'Wayfinding & Routing',
    'fan.emergency.title': 'Emergency Guidance',
    'fan.recommendations.title': 'Personalized Suggestions',
    'nav.gate': 'Gate Routing',
    'nav.seat': 'Seat Routing',
    'nav.restroom': 'Restrooms',
    'nav.food': 'Food & Drinks',
    'nav.accessibility': 'Accessible Routing',
    'alert.evacuation': 'Please proceed to the nearest exit immediately.',
  },
  es: {
    'fan.welcome': 'Bienvenido a la Copa Mundial de la FIFA 2026',
    'fan.copilot.placeholder': 'Pregúntame cualquier cosa (ej. "¿Dónde está mi asiento?")',
    'fan.navigation.title': 'Orientación y Rutas',
    'fan.emergency.title': 'Guía de Emergencia',
    'fan.recommendations.title': 'Sugerencias Personalizadas',
    'nav.gate': 'Ruta de Puerta',
    'nav.seat': 'Ruta de Asiento',
    'nav.restroom': 'Baños',
    'nav.food': 'Comida y Bebidas',
    'nav.accessibility': 'Ruta Accesible',
    'alert.evacuation': 'Por favor, diríjase a la salida más cercana de inmediato.',
  },
  fr: {
    'fan.welcome': 'Bienvenue à la Coupe du Monde de la FIFA 2026',
    'fan.copilot.placeholder': 'Posez-moi une question (ex. "Où est ma place ?")',
    'fan.navigation.title': 'Orientation et Itinéraires',
    'fan.emergency.title': "Guide d'Urgence",
    'fan.recommendations.title': 'Suggestions Personnalisées',
    'nav.gate': 'Itinéraire Porte',
    'nav.seat': 'Itinéraire Siège',
    'nav.restroom': 'Toilettes',
    'nav.food': 'Nourriture et Boissons',
    'nav.accessibility': 'Itinéraire Accessible',
    'alert.evacuation': 'Veuillez vous diriger immédiatement vers la sortie la plus proche.',
  },
  pt: {
    'fan.welcome': 'Bem-vindo à Copa do Mundo da FIFA 2026',
    'fan.copilot.placeholder': 'Pergunte-me qualquer coisa (ex. "Onde é meu assento?")',
    'fan.navigation.title': 'Orientação e Rotas',
    'fan.emergency.title': 'Guia de Emergência',
    'fan.recommendations.title': 'Sugestões Personalizadas',
    'nav.gate': 'Rota do Portão',
    'nav.seat': 'Rota do Assento',
    'nav.restroom': 'Banheiros',
    'nav.food': 'Comida e Bebidas',
    'nav.accessibility': 'Rota Acessível',
    'alert.evacuation': 'Por favor, dirija-se à saída mais próxima imediatamente.',
  },
  de: {
    'fan.welcome': 'Willkommen bei der FIFA Fussball-Weltmeisterschaft 2026',
    'fan.copilot.placeholder': 'Frag mich etwas (z.B. "Wo ist mein Platz?")',
    'fan.navigation.title': 'Wegfindung & Routen',
    'fan.emergency.title': 'Notfallhilfe',
    'fan.recommendations.title': 'Personalisierte Vorschläge',
    'nav.gate': 'Tor-Route',
    'nav.seat': 'Sitzplatz-Route',
    'nav.restroom': 'Toiletten',
    'nav.food': 'Essen & Trinken',
    'nav.accessibility': 'Barrierefreie Route',
    'alert.evacuation': 'Bitte begeben Sie sich umgehend zum nächsten Ausgang.',
  },
  ar: {
    'fan.welcome': 'مرحبًا بكم في كأس العالم 2026',
    'fan.copilot.placeholder': 'اسألني أي شيء (مثل "أين مقعدي؟")',
    'fan.navigation.title': 'التوجيه والمسارات',
    'fan.emergency.title': 'إرشادات الطوارئ',
    'fan.recommendations.title': 'اقتراحات مخصصة',
    'nav.gate': 'مسار البوابة',
    'nav.seat': 'مسار المقعد',
    'nav.restroom': 'دورات المياه',
    'nav.food': 'الطعام والمشروبات',
    'nav.accessibility': 'مسار يمكن الوصول إليه',
    'alert.evacuation': 'يرجى التوجه إلى أقرب مخرج على الفور.',
  },
  hi: {
    'fan.welcome': 'फीफा विश्व कप 2026 में आपका स्वागत है',
    'fan.copilot.placeholder': 'मुझसे कुछ भी पूछें (उदा. "मेरी सीट कहाँ है?")',
    'fan.navigation.title': 'रास्ता खोजना और रूटिंग',
    'fan.emergency.title': 'आपातकालीन मार्गदर्शन',
    'fan.recommendations.title': 'व्यक्तिगत सुझाव',
    'nav.gate': 'गेट रूटिंग',
    'nav.seat': 'सीट रूटिंग',
    'nav.restroom': 'शौचालय',
    'nav.food': 'भोजन और पेय',
    'nav.accessibility': 'सुलभ रूटिंग',
    'alert.evacuation': 'कृपया तुरंत निकटतम निकास की ओर बढ़ें।',
  },
  ja: {
    'fan.welcome': 'FIFAワールドカップ2026へようこそ',
    'fan.copilot.placeholder': '何でも聞いてください（例：「私の席はどこですか？」）',
    'fan.navigation.title': '道案内とルート',
    'fan.emergency.title': '緊急時の案内',
    'fan.recommendations.title': 'パーソナライズされた提案',
    'nav.gate': 'ゲートルート',
    'nav.seat': '座席ルート',
    'nav.restroom': 'トイレ',
    'nav.food': '飲食',
    'nav.accessibility': 'バリアフリールート',
    'alert.evacuation': '直ちに最寄りの出口に向かってください。',
  },
  zh: {
    'fan.welcome': '欢迎来到2026年FIFA世界杯',
    'fan.copilot.placeholder': '问我任何问题（例如：“我的座位在哪里？”）',
    'fan.navigation.title': '寻路与路线',
    'fan.emergency.title': '紧急指南',
    'fan.recommendations.title': '个性化建议',
    'nav.gate': '大门路线',
    'nav.seat': '座位路线',
    'nav.restroom': '洗手间',
    'nav.food': '餐饮',
    'nav.accessibility': '无障碍路线',
    'alert.evacuation': '请立即前往最近的出口。',
  },
  ko: {
    'fan.welcome': 'FIFA 월드컵 2026에 오신 것을 환영합니다',
    'fan.copilot.placeholder': '무엇이든 물어보세요 (예: "내 자리는 어디인가요?")',
    'fan.navigation.title': '길찾기 및 경로',
    'fan.emergency.title': '비상 안내',
    'fan.recommendations.title': '맞춤형 제안',
    'nav.gate': '게이트 경로',
    'nav.seat': '좌석 경로',
    'nav.restroom': '화장실',
    'nav.food': '음식 및 음료',
    'nav.accessibility': '접근 가능한 경로',
    'alert.evacuation': '즉시 가장 가까운 출구로 대피하십시오.',
  },
};

export class MultilingualService {
  private static instance: MultilingualService;

  private constructor() {}

  public static getInstance(): MultilingualService {
    if (!MultilingualService.instance) {
      MultilingualService.instance = new MultilingualService();
    }
    return MultilingualService.instance;
  }

  public t(key: string, overrideLang?: SupportedLanguage): string {
    const lang = overrideLang || fanContextService.getContext().language;
    const translation = Translations[lang]?.[key];
    return translation || Translations['en'][key] || key;
  }

  // Simulates an AI localized translation hook for dynamic content
  public async translateDynamic(content: string, targetLang?: SupportedLanguage): Promise<string> {
    const lang = targetLang || fanContextService.getContext().language;
    if (lang === 'en') return content;
    // In reality this would hit an LLM / gateway for real-time translation
    return `[${lang.toUpperCase()}] ${content}`;
  }
}

export const multilingualService = MultilingualService.getInstance();
