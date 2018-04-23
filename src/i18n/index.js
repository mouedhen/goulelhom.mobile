import i18n from 'i18next';
import {reactI18nextModule} from 'react-i18next';
import Expo from 'expo';
import Events from "../screens/events";

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
export const languageDetector = {
    type: 'languageDetector',
    async: true, // flags below detection to be async
    detect: (callback) => {
        return Expo.DangerZone.Localization.getCurrentLocaleAsync().then(lng => {
            callback(lng.replace('_', '-'));
        })
    },
    init: () => {
    },
    cacheUserLanguage: () => {
    }
};

i18n
    .use(languageDetector)
    .use(reactI18nextModule)
    .init({
        fallbackLng: 'en',

        resources: {
            en: {
                sidebar: {
                    complains: 'Complains',
                    petitions: 'Petitions',
                    events: 'Events',
                    municipalities: 'Municipalities',
                    reports: 'Reports',
                    press: 'Press',
                    settings: 'Settings'
                },
                home: {
                    title: 'Home',
                    action: 'Enter',
                    quote: 'People\'s power is stronger than the people in the power',
                },
                complains: {
                    index: {
                        title: 'Complains',
                        action: 'Add Complain',
                        noComplains: 'No complains until now, come back later...'
                    },
                    form: {
                        title: 'New Complain',
                        subject: 'Subject',
                        theme: 'Theme',
                        municipalities: 'Municipality',
                        description: 'Description',
                        submit: 'Submit Complain'
                    },
                    details: {
                        title: 'Complain Details',
                    }
                },
                petitions: {
                    index: {
                        title: 'Petitions',
                        no: 'No petitions until now, come back later...',
                    },
                    details: {
                        title: 'Petition Details',
                        success: 'Thank you for your contribution...',
                        error: 'An error occurred, please try again later...',
                        requested_signatures: 'Requested signatures',
                        total_signatures: 'Total signatures',
                        archived: 'This petition was archived',
                        signed: 'You have signed this petition',
                        sign: 'Sign the petition',
                    },
                    form: {
                        title: 'New Petition',
                        name: 'Title',
                        target: 'Target (organism name)',
                        date: 'Select end date',
                        signatures: 'Requested signatures',
                        theme: 'Theme',
                        description: 'Description',
                        submit: 'Submit Petition',
                    },
                },
                events: {
                    index: {
                        title: 'Events',
                        no: 'No events until now, come back later...',
                    },
                    details: {
                        title: 'Event Details',
                    }
                },
                municipalities: {
                    index: {
                        title: 'Municipalities',
                        no: 'No municipalities until now, come back later...',
                    },
                    details: {
                        title: 'Municipality Details',
                        list: 'Complains List',
                    }
                },
                reports: {
                    index: {
                        title: 'Reports',
                        no: 'No reports until now, come back later...',
                        read: 'Read Report',
                    },
                    details: {
                        title: 'Read Report',
                    }
                },
                press: {
                    index: {
                        title: 'Press Reviews',
                        no: 'No articles until now, come back later...',
                        read: 'Read Article'
                    },
                    details: {
                        title: 'Read Press Review',
                    }
                },
                settings: {
                    index: {
                        title: 'Settings',
                        profile: 'Profile',
                    },
                    form: {
                        title: 'User Information',
                        name: 'Your name',
                        email: 'Your email address',
                        phone: 'Your phone number',
                        address: 'Your address',
                    }
                },
                common: {
                    details: 'Details',
                    loading: 'Loading...',
                    error: 'An error occurred, please try again later',
                    save: 'Save',
                    validation: 'Please check your parameters...',
                },
            },
            fr: {
                sidebar: {
                    complains: 'Plaintes',
                    petitions: 'Pétitions',
                    events: 'Evènements',
                    municipalities: 'Municipalités',
                    reports: 'Rapports',
                    press: 'Presse',
                    settings: 'Configuration'
                },
                home: {
                    title: 'Accueil',
                    action: 'Entrer',
                    quote: 'Le pouvoir des gens est plus puissant que les gens au pouvoir'
                },
                complains: {
                    index: {
                        title: 'Plaintes',
                        action: 'Ajouter une Plainte',
                        noComplains: 'Aucune plainte pour le moment, réessayer plus tard...'
                    },
                    form: {
                        title: 'Ajouter une Plainte',
                        subject: 'Sujet',
                        theme: 'Thème',
                        municipalities: 'Municipalité',
                        description: 'Description',
                        submit: 'Soumettre la Plainte'
                    },
                    details: {
                        title: 'Détails Plainte',
                    }
                },
                petitions: {
                    index: {
                        title: 'Pétitions',
                        no: 'Aucune pétitions jusqu\'à maintenant, revenez plus tard ...',
                    },
                    details: {
                        title: 'Détails Pétition',
                        success: 'Merci de votre contribution...',
                        error: 'Une erreur est survenue, merci de rééssayer plus tard...',
                        requested_signatures: 'Signatures requises',
                        total_signatures: 'Signatures accumulées',
                        archived: 'La pétition est archivée',
                        signed: 'Vous avez signé cette pétition',
                        sign: 'Signer la pétition',
                    },
                    form: {
                        title: 'Nouvelle Pétition',
                        name: 'Titre',
                        target: 'Cible (nom de l\'organisme)',
                        date: 'Choisir la date limite',
                        signatures: 'Signatures requises',
                        theme: 'Thème',
                        description: 'Description',
                        submit: 'Soumettre la pétition',
                    },
                },
                events: {
                    index: {
                        title: 'Evènements',
                        no: 'Aucun événement jusqu\'à maintenant, revenez plus tard ...',
                    },
                    details: {
                        title: 'Details Evènement',
                    }
                },
                municipalities: {
                    index: {
                        title: 'Municipalités',
                        no: 'Aucune municipalités jusqu\'à maintenant, revenez plus tard ...',
                    },
                    details: {
                        title: 'Détails Municipalité',
                        list: 'Liste des Plaintes',
                    }
                },
                reports: {
                    index: {
                        title: 'Rapports',
                        no: 'Aucun rapport jusqu\'à maintenant, revenez plus tard ...',
                        read: 'Lire le Rapport',
                    },
                    details: {
                        title: 'Lire Rapport',
                    }
                },
                press: {
                    index: {
                        title: 'Revues de Presse',
                        no: 'Aucun article jusqu\'à maintenant, revenez plus tard ...',
                        read: 'Lire l\'Article'
                    },
                    details: {
                        title: 'Lire l\'Article',
                    },
                },
                settings: {
                    index: {
                        title: 'Configuration',
                        profile: 'Profil',
                    },
                    form: {
                        title: 'Informations Utilisateurs',
                        name: 'Votre nom et prénom',
                        email: 'Votre adresse e-mail',
                        phone: 'Votre numéro de téléphone',
                        address: 'Votre adresse',
                    }
                },
                common: {
                    details: 'Détails',
                    loading: 'Chargement...',
                    error: 'Une erreur est survenue, veuillez réessayer plus tard',
                    save: 'Sauvegarder',
                    validation: 'Merci de vérifier vos paramètres...',
                },
            },
            ar: {
                sidebar: {
                    complains: 'الشكاوى',
                    petitions: 'العرائض',
                    events: 'الاحداث',
                    municipalities: 'البلديات',
                    reports: 'التقارير',
                    press: 'الصحافة',
                    settings: 'الإعدادات'
                },
                home: {
                    title: 'الصفحة الرئيسية',
                    action: 'الدخول',
                    quote: 'سلطة الشعب أقوى من الشعب في السلطة',
                },
                complains: {
                    index: {
                        title: 'الشكاوى',
                        action: 'اضافة شكوى',
                        noComplains: 'لا شكاوى حتى الآن ، يرجى العودة لاحقا ...'
                    },
                    form: {
                        title: 'اضافة شكوى',
                        subject: 'عنوان الشكوى',
                        theme: 'الموضوع',
                        municipalities: 'البلدية',
                        description: 'تفاصيل',
                        submit: 'تقديم الشكوى'
                    },
                    details: {
                        title: 'تفاصيل الشكوى',
                    }
                },
                petitions: {
                    index: {
                        title: 'العرائض',
                        no: 'لا عرائض حتى الآن ، يرجى العودة لاحقا ...',
                    },
                    details: {
                        title: 'تفاصيل العريضة',
                        success: 'شكرا لمساهمتك ...',
                        error: 'حدث خطأ ، ونشكرك على إعادة المحاولة لاحقًا ...',
                        requested_signatures: 'التوقيعات المطلوبة',
                        total_signatures: 'التوقيعات',
                        archived: 'تم أرشفة العريضة',
                        signed: 'كنت قد وقعت على العريضة',
                        sign: 'وقع على العريضة',
                    },
                    form: {
                        title: 'عريضة جديدة',
                        name: 'عنوان العريضة',
                        target: 'الهدف (اسم المنظمة)',
                        date: 'اختر الموعد النهائي',
                        signatures: 'التوقيعات المطلوبة',
                        theme: 'الموضوع',
                        description: 'التوقيعات المطلوبة',
                        submit: 'إرسال العريضة',
                    },
                },
                events: {
                    index: {
                        title: 'الاحداث',
                        no: 'لا احداث حتى الآن ، يرجى العودة لاحقا ...',
                    },
                    details: {
                        title: 'تفاصيل الحدث',
                    }
                },
                municipalities: {
                    index: {
                        title: 'البلديات',
                        no: 'لا بلديات حتى الآن ، يرجى العودة لاحقا ...',
                    },
                    details: {
                        title: 'تفاصيل البلدية',
                        list: 'قائمة الشكاوي',
                    }
                },
                reports: {
                    index: {
                        title: 'التقارير',
                        no: 'لا تقارير حتى الآن ، يرجى العودة لاحقا ...',
                        read: 'قراءة التقرير',
                    },
                    details: {
                        title: 'قراءة التقرير',
                    }
                },
                press: {
                    index: {
                        title: 'الصحافة',
                        no: 'لا تقارير حتى الآن ، يرجى العودة لاحقا ...',
                        read: 'قراءة التقرير'
                    },
                    details: {
                        title: 'قراءة التقرير',
                    },
                },
                settings: {
                    index: {
                        title: 'الإعدادات',
                        profile: 'الملف الشخصي',
                    },
                    form: {
                        name: 'الإسم واللقب',
                        email: 'البريد الإلكتروني',
                        phone: 'رقم الهاتف',
                        address: 'العنوان',
                    }
                },
                common: {
                    details: 'التفاصيل',
                    loading: 'جاري التحميل',
                    error: 'حدث خطأ ، يرجى المحاولة مرة أخرى في وقت لاحق',
                    save: 'حفظ',
                    validation: 'يرجى التحقق من المعلمات ...',
                },
            }
        },

        // have a common namespace used around the full app
        ns: ['common'],
        defaultNS: 'common',

        debug: false,

        cache: {
            enabled: true
        },

        interpolation: {
            escapeValue: false, // not needed for react as it does escape per default to prevent xss!
        }
    });


export default i18n;