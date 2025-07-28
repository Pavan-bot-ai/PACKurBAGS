import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Translation interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Language context interface
interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => Promise<void>;
  t: (key: string) => string;
  availableLanguages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations: Translations = {
  en: {
    // Header
    'header.login': 'Log In',
    'header.logout': 'Log Out',
    'header.menu': 'Menu',
    
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.bookings': 'My Bookings',
    'nav.transactions': 'Transactions',
    'nav.saved_places': 'Saved Places',
    'nav.trip_history': 'Trip History',
    'nav.settings': 'Settings',
    
    // Hero Section
    'hero.title': 'Discover Your Next Adventure',
    'hero.subtitle': 'AI-powered travel planning for unforgettable journeys',
    'hero.search_placeholder': 'Where would you like to go?',
    'hero.search_button': 'Search Destinations',
    
    // Quick Actions
    'actions.title': 'Plan Your Perfect Trip',
    'actions.smart_planner': 'Smart Trip Planner',
    'actions.smart_planner_desc': 'AI-powered itinerary generation',
    'actions.local_guide': 'AI Local Guide',
    'actions.local_guide_desc': 'Get insider tips and recommendations',
    'actions.translator': 'Real-time Translator',
    'actions.translator_desc': 'Break down language barriers',
    'actions.bookings': 'AI Bookings',
    'actions.bookings_desc': 'Smart booking assistance',
    
    // Booking Flow
    'booking.transportation': 'Transportation',
    'booking.payment': 'Payment',
    'booking.confirmation': 'Confirmation',
    'booking.hotel_selection': 'Hotel Selection',
    'booking.final_review': 'Final Review',
    'booking.confirmed': 'Transportation Confirmed',
    'booking.continue_hotel': 'Continue to Hotel Booking',
    
    // Hotel Booking
    'hotel.select_hotel': 'Select Hotel',
    'hotel.book_now': 'Book Now',
    'hotel.nights': 'nights',
    'hotel.rooms': 'rooms',
    'hotel.guests': 'guests',
    'hotel.check_in': 'Check In',
    'hotel.check_out': 'Check Out',
    'hotel.budget_exceeded': 'Budget exceeded! Please adjust your selection.',
    'hotel.total_amount': 'Total Amount',
    
    // Payment
    'payment.method': 'Payment Method',
    'payment.select_method': 'Select Payment Method',
    'payment.card_details': 'Card Details',
    'payment.cardholder_name': 'Cardholder Name',
    'payment.card_number': 'Card Number',
    'payment.expiry_date': 'Expiry Date',
    'payment.cvv': 'CVV',
    'payment.complete': 'Complete Payment',
    'payment.processing': 'Processing Payment...',
    'payment.successful': 'Payment Successful',
    'payment.failed': 'Payment Failed',
    
    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme Settings',
    'settings.appearance': 'Appearance',
    'settings.choose_theme': 'Choose your preferred theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.language': 'Language Settings',
    'settings.app_language': 'App Language',
    'settings.choose_language': 'Choose your preferred language for the app interface',
    'settings.app_info': 'App Information',
    'settings.version': 'Version',
    'settings.build': 'Build',
    
    // Common
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.select': 'Select',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.price': 'Price',
    'common.rating': 'Rating',
    'common.location': 'Location',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.duration': 'Duration',
    'common.amenities': 'Amenities',
    'common.description': 'Description',
  },
  es: {
    // Header
    'header.login': 'Iniciar Sesión',
    'header.logout': 'Cerrar Sesión',
    'header.menu': 'Menú',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.profile': 'Perfil',
    'nav.bookings': 'Mis Reservas',
    'nav.transactions': 'Transacciones',
    'nav.saved_places': 'Lugares Guardados',
    'nav.trip_history': 'Historial de Viajes',
    'nav.settings': 'Configuración',
    
    // Hero Section
    'hero.title': 'Descubre Tu Próxima Aventura',
    'hero.subtitle': 'Planificación de viajes con IA para experiencias inolvidables',
    'hero.search_placeholder': '¿A dónde te gustaría ir?',
    'hero.search_button': 'Buscar Destinos',
    
    // Quick Actions
    'actions.title': 'Planifica Tu Viaje Perfecto',
    'actions.smart_planner': 'Planificador Inteligente',
    'actions.smart_planner_desc': 'Generación de itinerarios con IA',
    'actions.local_guide': 'Guía Local IA',
    'actions.local_guide_desc': 'Obtén consejos y recomendaciones exclusivas',
    'actions.translator': 'Traductor en Tiempo Real',
    'actions.translator_desc': 'Rompe las barreras del idioma',
    'actions.bookings': 'Reservas IA',
    'actions.bookings_desc': 'Asistencia inteligente para reservas',
    
    // Booking Flow
    'booking.transportation': 'Transporte',
    'booking.payment': 'Pago',
    'booking.confirmation': 'Confirmación',
    'booking.hotel_selection': 'Selección de Hotel',
    'booking.final_review': 'Revisión Final',
    'booking.confirmed': 'Transporte Confirmado',
    'booking.continue_hotel': 'Continuar a Reserva de Hotel',
    
    // Hotel Booking
    'hotel.select_hotel': 'Seleccionar Hotel',
    'hotel.book_now': 'Reservar Ahora',
    'hotel.nights': 'noches',
    'hotel.rooms': 'habitaciones',
    'hotel.guests': 'huéspedes',
    'hotel.check_in': 'Entrada',
    'hotel.check_out': 'Salida',
    'hotel.budget_exceeded': '¡Presupuesto excedido! Por favor ajusta tu selección.',
    'hotel.total_amount': 'Cantidad Total',
    
    // Payment
    'payment.method': 'Método de Pago',
    'payment.select_method': 'Seleccionar Método de Pago',
    'payment.card_details': 'Detalles de Tarjeta',
    'payment.cardholder_name': 'Nombre del Titular',
    'payment.card_number': 'Número de Tarjeta',
    'payment.expiry_date': 'Fecha de Vencimiento',
    'payment.cvv': 'CVV',
    'payment.complete': 'Completar Pago',
    'payment.processing': 'Procesando Pago...',
    'payment.successful': 'Pago Exitoso',
    'payment.failed': 'Pago Fallido',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.theme': 'Configuración de Tema',
    'settings.appearance': 'Apariencia',
    'settings.choose_theme': 'Elige tu tema preferido',
    'settings.light': 'Claro',
    'settings.dark': 'Oscuro',
    'settings.language': 'Configuración de Idioma',
    'settings.app_language': 'Idioma de la Aplicación',
    'settings.choose_language': 'Elige tu idioma preferido para la interfaz de la aplicación',
    'settings.app_info': 'Información de la Aplicación',
    'settings.version': 'Versión',
    'settings.build': 'Compilación',
    
    // Common
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.continue': 'Continuar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.select': 'Seleccionar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.price': 'Precio',
    'common.rating': 'Calificación',
    'common.location': 'Ubicación',
    'common.date': 'Fecha',
    'common.time': 'Hora',
    'common.duration': 'Duración',
    'common.amenities': 'Comodidades',
    'common.description': 'Descripción',
  },
  fr: {
    // Header
    'header.login': 'Se Connecter',
    'header.logout': 'Se Déconnecter',
    'header.menu': 'Menu',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.profile': 'Profil',
    'nav.bookings': 'Mes Réservations',
    'nav.transactions': 'Transactions',
    'nav.saved_places': 'Lieux Sauvegardés',
    'nav.trip_history': 'Historique des Voyages',
    'nav.settings': 'Paramètres',
    
    // Hero Section
    'hero.title': 'Découvrez Votre Prochaine Aventure',
    'hero.subtitle': 'Planification de voyage alimentée par IA pour des expériences inoubliables',
    'hero.search_placeholder': 'Où aimeriez-vous aller?',
    'hero.search_button': 'Rechercher des Destinations',
    
    // Quick Actions
    'actions.title': 'Planifiez Votre Voyage Parfait',
    'actions.smart_planner': 'Planificateur Intelligent',
    'actions.smart_planner_desc': 'Génération d\'itinéraires par IA',
    'actions.local_guide': 'Guide Local IA',
    'actions.local_guide_desc': 'Obtenez des conseils et recommandations d\'initiés',
    'actions.translator': 'Traducteur en Temps Réel',
    'actions.translator_desc': 'Brisez les barrières linguistiques',
    'actions.bookings': 'Réservations IA',
    'actions.bookings_desc': 'Assistance intelligente pour les réservations',
    
    // Booking Flow
    'booking.transportation': 'Transport',
    'booking.payment': 'Paiement',
    'booking.confirmation': 'Confirmation',
    'booking.hotel_selection': 'Sélection d\'Hôtel',
    'booking.final_review': 'Révision Finale',
    'booking.confirmed': 'Transport Confirmé',
    'booking.continue_hotel': 'Continuer vers la Réservation d\'Hôtel',
    
    // Hotel Booking
    'hotel.select_hotel': 'Sélectionner un Hôtel',
    'hotel.book_now': 'Réserver Maintenant',
    'hotel.nights': 'nuits',
    'hotel.rooms': 'chambres',
    'hotel.guests': 'invités',
    'hotel.check_in': 'Arrivée',
    'hotel.check_out': 'Départ',
    'hotel.budget_exceeded': 'Budget dépassé! Veuillez ajuster votre sélection.',
    'hotel.total_amount': 'Montant Total',
    
    // Payment
    'payment.method': 'Méthode de Paiement',
    'payment.select_method': 'Sélectionner la Méthode de Paiement',
    'payment.card_details': 'Détails de la Carte',
    'payment.cardholder_name': 'Nom du Porteur',
    'payment.card_number': 'Numéro de Carte',
    'payment.expiry_date': 'Date d\'Expiration',
    'payment.cvv': 'CVV',
    'payment.complete': 'Finaliser le Paiement',
    'payment.processing': 'Traitement du Paiement...',
    'payment.successful': 'Paiement Réussi',
    'payment.failed': 'Paiement Échoué',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.theme': 'Paramètres de Thème',
    'settings.appearance': 'Apparence',
    'settings.choose_theme': 'Choisissez votre thème préféré',
    'settings.light': 'Clair',
    'settings.dark': 'Sombre',
    'settings.language': 'Paramètres de Langue',
    'settings.app_language': 'Langue de l\'Application',
    'settings.choose_language': 'Choisissez votre langue préférée pour l\'interface de l\'application',
    'settings.app_info': 'Informations de l\'Application',
    'settings.version': 'Version',
    'settings.build': 'Build',
    
    // Common
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.continue': 'Continuer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.select': 'Sélectionner',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.price': 'Prix',
    'common.rating': 'Évaluation',
    'common.location': 'Emplacement',
    'common.date': 'Date',
    'common.time': 'Heure',
    'common.duration': 'Durée',
    'common.amenities': 'Équipements',
    'common.description': 'Description',
  },
  zh: {
    // Header
    'header.login': '登录',
    'header.logout': '退出',
    'header.menu': '菜单',
    
    // Navigation
    'nav.home': '首页',
    'nav.profile': '个人资料',
    'nav.bookings': '我的预订',
    'nav.transactions': '交易记录',
    'nav.saved_places': '收藏的地点',
    'nav.trip_history': '旅行历史',
    'nav.settings': '设置',
    
    // Hero Section
    'hero.title': '发现您的下一次冒险',
    'hero.subtitle': 'AI驱动的旅行规划，创造难忘的旅程',
    'hero.search_placeholder': '您想去哪里？',
    'hero.search_button': '搜索目的地',
    
    // Quick Actions
    'actions.title': '规划您的完美旅行',
    'actions.smart_planner': '智能旅行规划师',
    'actions.smart_planner_desc': 'AI驱动的行程生成',
    'actions.local_guide': 'AI本地向导',
    'actions.local_guide_desc': '获得内部提示和推荐',
    'actions.translator': '实时翻译',
    'actions.translator_desc': '打破语言障碍',
    'actions.bookings': 'AI预订',
    'actions.bookings_desc': '智能预订协助',
    
    // Booking Flow
    'booking.transportation': '交通',
    'booking.payment': '支付',
    'booking.confirmation': '确认',
    'booking.hotel_selection': '酒店选择',
    'booking.final_review': '最终审核',
    'booking.confirmed': '交通已确认',
    'booking.continue_hotel': '继续酒店预订',
    
    // Hotel Booking
    'hotel.select_hotel': '选择酒店',
    'hotel.book_now': '立即预订',
    'hotel.nights': '晚',
    'hotel.rooms': '房间',
    'hotel.guests': '客人',
    'hotel.check_in': '入住',
    'hotel.check_out': '退房',
    'hotel.budget_exceeded': '超出预算！请调整您的选择。',
    'hotel.total_amount': '总金额',
    
    // Payment
    'payment.method': '支付方式',
    'payment.select_method': '选择支付方式',
    'payment.card_details': '卡片详情',
    'payment.cardholder_name': '持卡人姓名',
    'payment.card_number': '卡号',
    'payment.expiry_date': '到期日期',
    'payment.cvv': '安全码',
    'payment.complete': '完成支付',
    'payment.processing': '正在处理支付...',
    'payment.successful': '支付成功',
    'payment.failed': '支付失败',
    
    // Settings
    'settings.title': '设置',
    'settings.theme': '主题设置',
    'settings.appearance': '外观',
    'settings.choose_theme': '选择您偏好的主题',
    'settings.light': '浅色',
    'settings.dark': '深色',
    'settings.language': '语言设置',
    'settings.app_language': '应用语言',
    'settings.choose_language': '为应用界面选择您偏好的语言',
    'settings.app_info': '应用信息',
    'settings.version': '版本',
    'settings.build': '构建',
    
    // Common
    'common.cancel': '取消',
    'common.save': '保存',
    'common.continue': '继续',
    'common.back': '返回',
    'common.next': '下一步',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.select': '选择',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.price': '价格',
    'common.rating': '评分',
    'common.location': '位置',
    'common.date': '日期',
    'common.time': '时间',
    'common.duration': '持续时间',
    'common.amenities': '设施',
    'common.description': '描述',
  },
  ja: {
    // Header
    'header.login': 'ログイン',
    'header.logout': 'ログアウト',
    'header.menu': 'メニュー',
    
    // Navigation
    'nav.home': 'ホーム',
    'nav.profile': 'プロフィール',
    'nav.bookings': '私の予約',
    'nav.transactions': '取引',
    'nav.saved_places': '保存された場所',
    'nav.trip_history': '旅行履歴',
    'nav.settings': '設定',
    
    // Hero Section
    'hero.title': '次の冒険を発見しよう',
    'hero.subtitle': 'AIを活用した旅行計画で忘れられない旅を',
    'hero.search_placeholder': 'どこに行きたいですか？',
    'hero.search_button': '目的地を検索',
    
    // Quick Actions
    'actions.title': '完璧な旅行を計画しよう',
    'actions.smart_planner': 'スマート旅行プランナー',
    'actions.smart_planner_desc': 'AIによる旅程生成',
    'actions.local_guide': 'AIローカルガイド',
    'actions.local_guide_desc': 'インサイダーのヒントとおすすめを取得',
    'actions.translator': 'リアルタイム翻訳',
    'actions.translator_desc': '言語の壁を打破',
    'actions.bookings': 'AI予約',
    'actions.bookings_desc': 'スマート予約アシスタンス',
    
    // Booking Flow
    'booking.transportation': '交通',
    'booking.payment': '支払い',
    'booking.confirmation': '確認',
    'booking.hotel_selection': 'ホテル選択',
    'booking.final_review': '最終確認',
    'booking.confirmed': '交通が確認されました',
    'booking.continue_hotel': 'ホテル予約に続く',
    
    // Hotel Booking
    'hotel.select_hotel': 'ホテルを選択',
    'hotel.book_now': '今すぐ予約',
    'hotel.nights': '泊',
    'hotel.rooms': '部屋',
    'hotel.guests': 'ゲスト',
    'hotel.check_in': 'チェックイン',
    'hotel.check_out': 'チェックアウト',
    'hotel.budget_exceeded': '予算を超過しました！選択を調整してください。',
    'hotel.total_amount': '合計金額',
    
    // Payment
    'payment.method': '支払い方法',
    'payment.select_method': '支払い方法を選択',
    'payment.card_details': 'カード詳細',
    'payment.cardholder_name': 'カード名義人',
    'payment.card_number': 'カード番号',
    'payment.expiry_date': '有効期限',
    'payment.cvv': 'セキュリティコード',
    'payment.complete': '支払いを完了',
    'payment.processing': '支払いを処理中...',
    'payment.successful': '支払い成功',
    'payment.failed': '支払い失敗',
    
    // Settings
    'settings.title': '設定',
    'settings.theme': 'テーマ設定',
    'settings.appearance': '外観',
    'settings.choose_theme': 'お好みのテーマを選択してください',
    'settings.light': 'ライト',
    'settings.dark': 'ダーク',
    'settings.language': '言語設定',
    'settings.app_language': 'アプリの言語',
    'settings.choose_language': 'アプリインターフェースのお好みの言語を選択してください',
    'settings.app_info': 'アプリ情報',
    'settings.version': 'バージョン',
    'settings.build': 'ビルド',
    
    // Common
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.continue': '続行',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.select': '選択',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.sort': '並び替え',
    'common.price': '価格',
    'common.rating': '評価',
    'common.location': '場所',
    'common.date': '日付',
    'common.time': '時間',
    'common.duration': '期間',
    'common.amenities': 'アメニティ',
    'common.description': '説明',
  },
};

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Use optional hook to avoid context errors
  const authContext = React.useContext(React.createContext<any>(null));
  const user = authContext?.user || null;
  const updateUserLanguage = authContext?.updateUserLanguage || (() => Promise.resolve());
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  // Initialize language from user preference or localStorage
  useEffect(() => {
    if (user?.language) {
      setCurrentLanguage(user.language);
    } else {
      const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
      setCurrentLanguage(savedLanguage);
    }
  }, [user]);

  // Update language and persist to user profile if authenticated
  const setLanguage = async (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    
    if (user) {
      await updateUserLanguage(language);
    }
  };

  // Translation function
  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage];
    if (languageTranslations && languageTranslations[key]) {
      return languageTranslations[key];
    }
    
    // Fallback to English if translation not found
    const englishTranslations = translations['en'];
    if (englishTranslations && englishTranslations[key]) {
      return englishTranslations[key];
    }
    
    // Return the key itself if no translation found
    return key;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};