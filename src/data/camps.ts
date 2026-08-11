import type { SupportedLocale } from '@/types/i18n';

export type SportType = 'FOOTBALL' | 'VOLLEYBALL';
export type StarRating = 3 | 4 | 5;

export interface CampItem {
  id: string;
  slug: string;
  sport: SportType;
  starRating: StarRating;
  tierName: Record<SupportedLocale, string>;
  title: Record<SupportedLocale, string>;
  location: Record<SupportedLocale, string>;
  dates: Record<SupportedLocale, string>;
  ageGroup: Record<SupportedLocale, string>;
  capacity: Record<SupportedLocale, string>;
  imageUrl: string;
  summary: Record<SupportedLocale, string>;
  includedServices: Record<SupportedLocale, string[]>;
}

export const CAMPS_DATA: CampItem[] = [
  // FOOTBALL CAMPS
  {
    id: 'fb-5star-istanbul',
    slug: 'u18-football-showcase',
    sport: 'FOOTBALL',
    starRating: 5,
    tierName: {
      en: '5-Star VIP Luxury Showcase',
      tr: '5 Yıldızlı VIP Lüks Gösteri',
      fa: 'کمپ ۵ ستاره وی‌آی‌پای لوکس'
    },
    title: {
      en: 'U18 European Football Trial Showcase & VIP Camp',
      tr: 'U18 Avrupa Futbol Seçmeleri & VIP Kampı',
      fa: 'کمپ و آزمون‌های اختصاصی فوتبال U18 اروپا'
    },
    location: {
      en: 'İstanbul / Kartal Olympic Complex, Turkey',
      tr: 'İstanbul / Kartal Olimpik Kompleksi, Türkiye',
      fa: 'استانبول / مجتمع المپیک کارتالم، ترکیه'
    },
    dates: {
      en: '15 - 22 OCT 2026',
      tr: '15 - 22 EKİM 2026',
      fa: '۲۳ - ۳۰ مهر ۱۴۰۵'
    },
    ageGroup: {
      en: '15 - 19 YRS',
      tr: '15 - 19 YAŞ',
      fa: '۱۵ تا ۱۹ سال'
    },
    capacity: {
      en: '6 SPOTS REMAINING',
      tr: '6 KONTENJAN KALDI',
      fa: '۶ ظرفیت باقی‌مانده'
    },
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    summary: {
      en: 'Premier 5-Star trial showcase featuring UEFA Pro coaches, 5-Star luxury resort stay, FIFA Quality Pro hybrid pitch, and direct exposure to licensed European club scouts.',
      tr: 'UEFA Pro lisanslı antrenörler, 5 yıldızlı lüks otel konaklaması, FIFA Quality Pro hibrit çim ve Avrupalı menajerler eşliğinde üst düzey gösteri kampı.',
      fa: 'کمپ ۵ ستاره فوق لوکس فوتبال با مربیان UEFA Pro، اقامت در هتل ۵ ستاره، زمین چمن هیبرید فیفا و حضور مستقیم استعدادیابان باشگاه‌های اروپایی.'
    },
    includedServices: {
      en: [
        '5-Star Luxury Resort & Full Board Nutrition',
        'FIFA Quality Pro Hybrid Grass Pitches',
        '4K Match Video & GPS Performance Breakdown',
        'Direct European Scout & Agent Evaluation'
      ],
      tr: [
        '5 Yıldızlı Lüks Otel & Tam Pansiyon Beslenme',
        'FIFA Quality Pro Hibrit Çim Sahalar',
        '4K Maç Kaydı & GPS Performans Analizi',
        'Avrupalı Scout ve Menajer Değerlendirmesi'
      ],
      fa: [
        'اقامت ۵ ستاره و تغذیه اختصاصی ورزشکاران',
        'زمین چمن هیبرید استاندارد فیفا',
        'آنالیز 4K ویدئویی و گزارش GPS',
        'ارزیابی مستقیم استعدادیابان اروپایی'
      ]
    }
  },
  {
    id: 'fb-4star-antalya',
    slug: 'pre-season-conditioning',
    sport: 'FOOTBALL',
    starRating: 4,
    tierName: {
      en: '4-Star Executive Academy',
      tr: '4 Yıldızlı Yönetici Akademi',
      fa: 'کمپ ۴ ستاره تخصصی آکادمی'
    },
    title: {
      en: 'Pre-Season Tactical & Physical Conditioning Camp',
      tr: 'Sezon Öncesi Taktik & Fiziksel Hazırlık Kampı',
      fa: 'کمپ آمادگی جسمانی و تاکتیکی پیش‌فصل'
    },
    location: {
      en: 'Antalya / Belek High-Altitude Center, Turkey',
      tr: 'Antalya / Belek Yüksek İrtifa Merkezi, Türkiye',
      fa: 'آنتالیا / مرکز تمرینی بلک، ترکیه'
    },
    dates: {
      en: '05 - 12 NOV 2026',
      tr: '05 - 12 KASIM 2026',
      fa: '۱۴ - ۲۱ آبان ۱۴۰۵'
    },
    ageGroup: {
      en: '16 - 23 YRS',
      tr: '16 - 23 YAŞ',
      fa: '۱۶ تا ۲۳ سال'
    },
    capacity: {
      en: '8 SPOTS REMAINING',
      tr: '8 KONTENJAN KALDI',
      fa: '۸ ظرفیت باقی‌مانده'
    },
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    summary: {
      en: 'High-intensity 4-Star pre-season conditioning camp in Antalya. Focuses on tactical transitions, stamina, and professional match readiness.',
      tr: 'Antalya Belek\'te yüksek yoğunluklu 4 yıldızlı sezon öncesi hazırlık kampı. Taktiksel geçişler, kondisyon ve profesyonel maç hazırlığı.',
      fa: 'کمپ ۴ ستاره آمادگی پیش‌فصل در بلک آنتالیا با تمرکز بر تاکتیک‌های مدرن، استقامت و آمادگی مسابقات حرفه‌ای.'
    },
    includedServices: {
      en: [
        '4-Star Executive Hotel Accommodation',
        'Natural Turf Pitch Sessions 2x Daily',
        'Physiotherapy & Recovery Hydrotherapy',
        'Official Tactical Certificate'
      ],
      tr: [
        '4 Yıldızlı Executive Otel Konaklaması',
        'Günde 2 Defa Doğal Çim Saha Antrenmanı',
        'Fizyoterapi ve Hidroterapi Yenilenme',
        'Resmi Taktiksel Gelişim Sertifikası'
      ],
      fa: [
        'اقامت در هتل ۴ ستاره و تغذیه کامل',
        'دو نوبت تمرین روزانه در چمن طبیعی',
        'خدمات فیزیوتراپی و آب‌درمانی',
        'گواهی رسمی تاکتیک و توسعه'
      ]
    }
  },
  {
    id: 'fb-3star-istanbul',
    slug: 'goalkeeper-striker-clinic',
    sport: 'FOOTBALL',
    starRating: 3,
    tierName: {
      en: '3-Star Essentials Clinic',
      tr: '3 Yıldızlı Temel Gelişim Kliniği',
      fa: 'کمپ ۳ ستاره ارتقای مهارت'
    },
    title: {
      en: 'Striker & Goalkeeper Specialized Skills Clinic',
      tr: 'Kaleci & Forvet Özel Beceri Kliniği',
      fa: 'کلینیک تخصصی دروازه‌بانی و مهاجمان'
    },
    location: {
      en: 'İstanbul / Pega Sports Campus, Turkey',
      tr: 'İstanbul / Pega Spor Kampüsü, Türkiye',
      fa: 'استانبول / کمپ ورزشی پگا، ترکیه'
    },
    dates: {
      en: '20 - 27 NOV 2026',
      tr: '20 - 27 KASIM 2026',
      fa: '۲۹ آبان - ۶ آذر ۱۴۰۵'
    },
    ageGroup: {
      en: '14 - 20 YRS',
      tr: '14 - 20 YAŞ',
      fa: '۱۴ تا ۲۰ سال'
    },
    capacity: {
      en: '10 SPOTS REMAINING',
      tr: '10 KONTENJAN KALDI',
      fa: '۱۰ ظرفیت باقی‌مانده'
    },
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop',
    summary: {
      en: '3-Star foundational clinic focused on finishing techniques, reaction saves, positional footwork, and 1v1 duels for aspiring pros.',
      tr: 'Son vuruş teknikleri, kaleci refleksleri, ayak çalışması ve 1v1 mücadelelere odaklanan 3 yıldızlı gelişim kliniği.',
      fa: 'کلینیک ۳ ستاره تخصصی با تمرکز بر شوت‌زنی و تمام‌کنندگی، واکنش‌های دروازه‌بانی و نبردهای یک به یک.'
    },
    includedServices: {
      en: [
        '3-Star Comfort Hotel Stay',
        'Positional Drill & Ball Machine Training',
        'High-Speed Camera Reaction Analysis',
        'Official Performance Evaluation Report'
      ],
      tr: [
        '3 Yıldızlı Konfor Otel Konaklaması',
        'Pozisyonel Dril ve Top Fırlatma Makinesi',
        'Yüksek Hızlı Kamera İle Refleks Analizi',
        'Resmi Performans Değerlendirme Raporu'
      ],
      fa: [
        'اقامت در هتل ۳ ستاره استاندارد',
        'تمرینات تخصصی پوزیشن با دستگاه‌های مدرن',
        'آنالیز ویدئویی سرعت واکنش',
        'گزارش رسمی ارزیابی عملکرد'
      ]
    }
  },

  // VOLLEYBALL CAMPS
  {
    id: 'vb-5star-antalya',
    slug: 'volleyball-performance-camp',
    sport: 'VOLLEYBALL',
    starRating: 5,
    tierName: {
      en: '5-Star FIVB Pro Masterclass',
      tr: '5 Yıldızlı FIVB Pro Ustalar Kampı',
      fa: 'کمپ ۵ ستاره مسترکلاس بین‌المللی'
    },
    title: {
      en: 'International FIVB Pro Volleyball Masterclass',
      tr: 'Uluslararası FIVB Pro Voleybol Ustalar Kampı',
      fa: 'مسترکلاس بین‌المللی والیبال FIVB Pro'
    },
    location: {
      en: 'Antalya / FIVB Olympic Arena, Turkey',
      tr: 'Antalya / FIVB Olimpik Arena, Türkiye',
      fa: 'آنتالیا / آرنای المپیک FIVB، ترکیه'
    },
    dates: {
      en: '01 - 08 NOV 2026',
      tr: '01 - 08 KASIM 2026',
      fa: '۱۰ - ۱۷ آبان ۱۴۰۵'
    },
    ageGroup: {
      en: '14 - 21 YRS',
      tr: '14 - 21 YAŞ',
      fa: '۱۴ تا ۲۱ سال'
    },
    capacity: {
      en: '5 SPOTS REMAINING',
      tr: '5 KONTENJAN KALDI',
      fa: '۵ ظرفیت باقی‌مانده'
    },
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1200&auto=format&fit=crop',
    summary: {
      en: 'Premier 5-Star volleyball showcase held on FIVB Taraflex courts with international national team coaches, jump serve biomechanics, and scout exposure.',
      tr: 'FIVB Taraflex zeminli salonda uluslararası milli takım antrenörleri, smaç biyomekaniği ve scout takibi ile 5 yıldızlı voleybol kampı.',
      fa: 'کمپ ۵ ستاره فوق‌العاده والیبال روی کف‌پوش تارافلکس FIVB با مربیان تیم‌های ملی و آنالیز بیومکانیک پرش و سرویس.'
    },
    includedServices: {
      en: [
        '5-Star Luxury Beach Resort Accommodation',
        'Official FIVB Taraflex Court Access',
        'Jump Serve Speed & Vertical Jump Bio-Lab',
        'European Club Scout Network Showcase'
      ],
      tr: [
        '5 Yıldızlı Lüks Sahil Oteli Konaklaması',
        'Resmi FIVB Taraflex Salon Kullanımı',
        'Smaç Servis ve Dikey Sıçrama Biyo-Laboratuvarı',
        'Avrupa Kulüp Scout Ağında Gösteri'
      ],
      fa: [
        'اقامت در هتل ۵ ستاره ساحلی با تغذیه کامل',
        'تمرین در سالن استاندارد تارافلکس FIVB',
        'آنالیز بیومکانیک پرش و سرویس پرشی',
        'معرفی به شبکه استعدادیابی باشگاه‌های اروپا'
      ]
    }
  },
  {
    id: 'vb-4star-istanbul',
    slug: 'setter-libero-masterclass',
    sport: 'VOLLEYBALL',
    starRating: 4,
    tierName: {
      en: '4-Star Executive Skills',
      tr: '4 Yıldızlı Uzmanlık Kampı',
      fa: 'کمپ ۴ ستاره تخصصی پاسور و لیبرو'
    },
    title: {
      en: 'Setter & Libero Precision & Tactical Masterclass',
      tr: 'Pasör & Libero Taktik ve Hassasiyet Kampı',
      fa: 'مسترکلاس تخصصی پاسورها و لیبروها'
    },
    location: {
      en: 'İstanbul / Burhan Felek Sports Hall, Turkey',
      tr: 'İstanbul / Burhan Felek Spor Salonu, Türkiye',
      fa: 'استانبول / سالن برهان فلک، ترکیه'
    },
    dates: {
      en: '10 - 17 DEC 2026',
      tr: '10 - 17 ARALIK 2026',
      fa: '۱۹ - ۲۶ آذر ۱۴۰۵'
    },
    ageGroup: {
      en: '15 - 22 YRS',
      tr: '15 - 22 YAŞ',
      fa: '۱۵ تا ۲۲ سال'
    },
    capacity: {
      en: '7 SPOTS REMAINING',
      tr: '7 KONTENJAN KALDI',
      fa: '۷ ظرفیت باقی‌مانده'
    },
    imageUrl: 'https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=1200&auto=format&fit=crop',
    summary: {
      en: '4-Star specialized masterclass focusing on distribution speed, back-row defense reaction, ball control accuracy, and court leadership.',
      tr: 'Pas hızı, defansif refleksler, top kontrolü ve saha liderliğine odaklanan 4 yıldızlı uzmanlık kampı.',
      fa: 'کمپ ۴ ستاره تخصصی جهت ارتقای سرعت پاس‌دهی، واکنش‌های دفاعی و کنترل توپ همراه با آنالیز تاکتیکی.'
    },
    includedServices: {
      en: [
        '4-Star Executive Hotel Accommodation',
        'Professional Setter Distribution Video Lab',
        'Reaction Machine & Digging Drills',
        'Certificate of Advanced Playmaking'
      ],
      tr: [
        '4 Yıldızlı Otel Konaklaması',
        'Profesyonel Pas Dağılım Video Laboratuvarı',
        'Reaksiyon Makinesi ile Manşet Antrenmanları',
        'Gelişmiş Oyun Kuruculuk Sertifikası'
      ],
      fa: [
        'اقامت در هتل ۴ ستاره و سرویس کامل',
        'آزمایشگاه ویدئویی آنالیز توزیع پاس',
        'تمرینات توپ‌گیری با دستگاه‌های واکنش سریع',
        'گواهی تخصصی بازیسازی و توپ‌گیری'
      ]
    }
  },
  {
    id: 'vb-3star-izmir',
    slug: 'volleyball-fundamentals',
    sport: 'VOLLEYBALL',
    starRating: 3,
    tierName: {
      en: '3-Star Foundation Camp',
      tr: '3 Yıldızlı Temel Akademi',
      fa: 'کمپ ۳ ستاره پایه‌ای والیبال'
    },
    title: {
      en: 'Junior Volleyball Fundamentals & Athletic Development',
      tr: 'Genç Voleybol Temel Eğitim & Atletik Gelişim',
      fa: 'کمپ ۳ ستاره پایه و توسعه والیبال جوانان'
    },
    location: {
      en: 'İzmir / Olympic Youth Complex, Turkey',
      tr: 'İzmir / Gençlik Olimpik Kompleksi, Türkiye',
      fa: 'ازمیر / مجتمع المپیک جوانان، ترکیه'
    },
    dates: {
      en: '15 - 22 JAN 2027',
      tr: '15 - 22 OCAK 2027',
      fa: '۲۵ دی - ۲ بهمن ۱۴۰۵'
    },
    ageGroup: {
      en: '12 - 17 YRS',
      tr: '12 - 17 YAŞ',
      fa: '۱۲ تا ۱۷ سال'
    },
    capacity: {
      en: '12 SPOTS REMAINING',
      tr: '12 KONTENJAN KALDI',
      fa: '۱۲ ظرفیت باقی‌مانده'
    },
    imageUrl: 'https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=1200&auto=format&fit=crop',
    summary: {
      en: '3-Star foundational volleyball camp designed to refine hitting posture, blocking positioning, server stability, and team chemistry.',
      tr: 'Smaç duruşu, blok zamanlaması, servis istikrarı ve takım oyununu geliştirmek üzere tasarlanmış 3 yıldızlı temel kamp.',
      fa: 'کمپ ۳ ستاره پایه‌ای والیبال برای اصلاح استایل ضربه، دفاع روی تور، پایداری سرویس و هماهنگی تیمی.'
    },
    includedServices: {
      en: [
        '3-Star Comfortable Hotel Accommodation',
        'Fundamental Court Drills 2x Daily',
        'Agility & Explosive Movement Coaching',
        'Youth Athlete Progression Card'
      ],
      tr: [
        '3 Yıldızlı Konforlu Otel Konaklaması',
        'Günde 2 Defa Temel Saha Çalışması',
        'Çeviklik ve Patlayıcı Güç Antrenmanları',
        'Genç Atlet Gelişim Karnesi'
      ],
      fa: [
        'اقامت در هتل ۳ ستاره استاندارد',
        'تمرینات روزانه دو نوبته در سالن ورزشی',
        'تمرینات چابکی و قدرت انفجاری',
        'کارنامه ارزیابی و پیشرفت ورزشکار'
      ]
    }
  }
];

export function getCampsBySport(sport?: SportType): CampItem[] {
  if (!sport) return CAMPS_DATA;
  return CAMPS_DATA.filter((camp) => camp.sport === sport);
}

export function getCampsByStarRating(starRating?: StarRating): CampItem[] {
  if (!starRating) return CAMPS_DATA;
  return CAMPS_DATA.filter((camp) => camp.starRating === starRating);
}

export function filterCamps(sport?: string, starRating?: number): CampItem[] {
  return CAMPS_DATA.filter((camp) => {
    const matchSport = !sport || sport === 'ALL' || camp.sport === sport;
    const matchStars = !starRating || starRating === 0 || camp.starRating === starRating;
    return matchSport && matchStars;
  });
}

export function getCampBySlug(slug: string): CampItem | undefined {
  return CAMPS_DATA.find((camp) => camp.slug === slug);
}
