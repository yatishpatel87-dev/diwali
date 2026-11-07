import { sound } from './audio';

export interface MantraVerse {
  id: number;
  sanskritGu: string;
  transliteration: string;
  meaningGu: string;
  meaningEn: string;
}

export interface MantraTrack {
  id: string;
  titleGu: string;
  titleEn: string;
  descGu: string;
  descEn: string;
  verses: MantraVerse[];
}

export interface VoiceSpeaker {
  id: string;
  nameGu: string;
  nameEn: string;
  gender: 'female' | 'male';
}

export const AVAILABLE_SPEAKERS: VoiceSpeaker[] = [
  { id: 'shruti', nameGu: 'શ્રુતિ (મધુર સ્ત્રી અવાજ)', nameEn: 'Shruti (Melodious Female)', gender: 'female' },
  { id: 'pooja', nameGu: 'પૂજા (ભક્તિમય શાંત અવાજ)', nameEn: 'Pooja (Devotional Female)', gender: 'female' },
  { id: 'kavya', nameGu: 'કાવ્યા (સ્પષ્ટ વાણી)', nameEn: 'Kavya (Expressive Female)', gender: 'female' },
  { id: 'advait', nameGu: 'અદ્વૈત (ગંભીર પુરુષ અવાજ)', nameEn: 'Advait (Resonant Male)', gender: 'male' },
  { id: 'shubh', nameGu: 'શુભ (શાસ્ત્રીય વૈદિક અવાજ)', nameEn: 'Shubh (Vedic Chanting Male)', gender: 'male' },
];

export const MANTRA_TRACKS: MantraTrack[] = [
  {
    id: 'ashtakam',
    titleGu: 'શ્રી મહાલક્ષ્મી અષ્ટકમ્ સ્તોત્રમ્',
    titleEn: 'Shri Mahalakshmi Ashtakam',
    descGu: 'ઇન્દ્રદેવ રચિત પરમ કલ્યાણકારી મહાલક્ષ્મી સ્તોત્ર',
    descEn: 'The sacred hymn composed by Indra Dev for prosperity and grace',
    verses: [
      {
        id: 1,
        sanskritGu: 'નમસ્તેસ્તુ મહામાયે શ્રીપીઠે સુરપૂજિતે । શંખચક્રગદાહસ્તે મહાલક્ષ્મી નમોસ્તુ તે ॥',
        transliteration: 'Namastestu Mahamaye Shri-Pithe Sura-Pujite | Shankha-Chakra-Gada-Haste Mahalakshmi Namostu Te ||',
        meaningGu: 'હે મહામાયા! શ્રીપીઠ પર વિરાજમાન અને દેવો દ્વારા પૂજિત, હાથમાં શંખ, ચક્ર અને ગદા ધારણ કરનાર હે મહાલક્ષ્મી! આપને વારંવાર નમસ્કાર.',
        meaningEn: 'Salutations to the Great Illusion, residing in the auspicious seat, worshipped by celestial beings, holding conch, discus and mace; salutations to Goddess Mahalakshmi.'
      },
      {
        id: 2,
        sanskritGu: 'નમસ્તે ગરુડારૂઢે કોલાસુરભયંકરિ । સર્વપાપહરે દેવિ મહાલક્ષ્મી નમોસ્તુ તે ॥',
        transliteration: 'Namaste Garudarudhe Kolasura-Bhayankari | Sarva-Papa-Hare Devi Mahalakshmi Namostu Te ||',
        meaningGu: 'ગરુડ પર સવાર, કોલાસુર રાક્ષસનો નાશ કરનાર અને સર્વ પાપોનું હરણ કરનાર હે દેવી મહાલક્ષ્મી! આપને નમસ્કાર.',
        meaningEn: 'Salutations to the Goddess who rides the divine Garuda, destroyer of the demon Kolasura, and remover of all misfortunes; salutations to Goddess Mahalakshmi.'
      },
      {
        id: 3,
        sanskritGu: 'સર્વજ્ઞે સર્વવરદે સર્વદુષ્ટભયંકરી । સર્વદુઃખહરે દેવિ મહાલક્ષ્મી નમોસ્તુ તે ॥',
        transliteration: 'Sarvajne Sarva-Varade Sarva-Dushta-Bhayankari | Sarva-Duhkha-Hare Devi Mahalakshmi Namostu Te ||',
        meaningGu: 'બધું જ જાણનાર, સર્વ વરદાન આપનાર, દુષ્ટોને ભય આપનાર અને સર્વ દુઃખોનું નિવારણ કરનાર હે માં લક્ષ્મી! આપને પ્રણામ.',
        meaningEn: 'All-knowing Goddess, giver of all boons, terror to evil, and dispeller of all sorrow; salutations to Goddess Mahalakshmi.'
      },
      {
        id: 4,
        sanskritGu: 'સિદ્ધિબુદ્ધિપ્રદે દેવિ ભુક્તિમુક્તિપ્રદાયિની । મંત્રમૂર્તે સદા દેવિ મહાલક્ષ્મી નમોસ્તુ તે ॥',
        transliteration: 'Siddhi-Buddhi-Prade Devi Bhukti-Mukti-Pradayini | Mantra-Murte Sada Devi Mahalakshmi Namostu Te ||',
        meaningGu: 'સિદ્ધિ અને સદ્બુદ્ધિ આપનાર, ભોગ અને મોક્ષ પ્રદાન કરનાર, સાક્ષાત્ મંત્ર સ્વરૂપા હે મા લક્ષ્મી! આપને સાદર વંદન.',
        meaningEn: 'Giver of wisdom and spiritual accomplishment, bestower of worldly joy and liberation, embodiment of holy mantras; salutations to Goddess Mahalakshmi.'
      }
    ]
  },
  {
    id: 'gayatri_beej',
    titleGu: 'મહાલક્ષ્મી બીજ મંત્ર અને ગાયત્રી',
    titleEn: 'Lakshmi Beej & Gayatri Mantra',
    descGu: 'ધન-ધાન્ય અને આધ્યાત્મિક તેજ પ્રદાન કરતો પાવન મંત્ર',
    descEn: 'Sacred seed syllables invoking auspicious wealth and divine illumination',
    verses: [
      {
        id: 1,
        sanskritGu: 'ૐ શ્રીં હ્રીં ક્લીં મહાલક્ષ્મીયૈ નમઃ ॥',
        transliteration: 'Om Shreem Hreem Kleem Mahalakshmaye Namaha ||',
        meaningGu: 'પરમ પવિત્ર બીજ મંત્રો સાથે દેવી મહાલક્ષ્મીને પ્રણામ. અમારા જીવનમાં શાંતિ અને સમૃદ્ધિ સ્થાપિત કરો.',
        meaningEn: 'Salutations to Goddess Mahalakshmi through sacred seed syllables of divine abundance, grace, and attraction.'
      },
      {
        id: 2,
        sanskritGu: 'ૐ મહાદેવ્યૈ ચ વિદ્મહે વિષ્ણુપત્ન્યૈ ચ ધીમહિ । તન્નો લક્ષ્મીઃ પ્રચોદયાત્ ॥',
        transliteration: 'Om Mahadevyai Cha Vidmahe Vishnu-Patnyai Cha Dhimahi | Tanno Lakshmih Prachodayat ||',
        meaningGu: 'અમે પરમ દેવી મહાલક્ષ્મીનું ધ્યાન કરીએ છીએ, ભગવાન શ્રી વિષ્ણુની પત્ની અમારા બુદ્ધિ અને અંતઃકરણને સન્માર્ગે પ્રેરિત કરો.',
        meaningEn: 'May we know the supreme Goddess; we meditate upon the consort of Lord Vishnu; may Goddess Lakshmi illuminate and inspire our intellect.'
      }
    ]
  },
  {
    id: 'aarti',
    titleGu: 'મા લક્ષ્મીજીની મંગલ આરતી',
    titleEn: 'Maa Lakshmi Sacred Aarti',
    descGu: 'દીપાવલી પૂજન સમયે ગવાતી પરંપરાગત ભક્તિમય આરતી',
    descEn: 'Traditional devotional aarti sung during Diwali Lakshmi Puja',
    verses: [
      {
        id: 1,
        sanskritGu: 'ૐ જય લક્ષ્મી માતા, મૈયા જય લક્ષ્મી માતા । તુમકો નિશદિન સેવત, હર વિષ્ણુ વિધાતા ॥',
        transliteration: 'Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata | Tumko Nishdin Sevat, Har Vishnu Vidhata ||',
        meaningGu: 'હે લક્ષ્મી માતા આપની જય હો! ભગવાન શિવ, વિષ્ણુ અને બ્રહ્માજી પ્રતિદિન આપની સેવા અને આરાધના કરે છે.',
        meaningEn: 'Glory to Mother Lakshmi! Lord Shiva, Lord Vishnu, and Lord Brahma serve and adore You day and night.'
      },
      {
        id: 2,
        sanskritGu: 'ઉમા રમા બ્રહ્માણી, તુમ હી જગ માતા । સૂર્ય ચંદ્રમા ધ્યાવત, નારદ ઋષિ ગાતા ॥',
        transliteration: 'Uma Rama Brahmani, Tum Hi Jag Mata | Surya Chandrama Dhyavat, Narad Rishi Gata ||',
        meaningGu: 'આપ જ ઉમા, રમા અને બ્રહ્માણી રૂપે સમગ્ર જગતની માતા છો. સૂર્ય-ચંદ્ર આપનું ધ્યાન ધરે છે અને નારદ મુનિ ગુણગાન ગાય છે.',
        meaningEn: 'You are Uma, Rama, and Brahmani, the Mother of the Universe. Sun and Moon meditate on You, Sage Narada sings Your praise.'
      },
      {
        id: 3,
        sanskritGu: 'જિસ ઘર મેં તુમ રહતી, સબ સદ્ગુણ આતા । સબ સંભવ હો જાતા, મન નહીં ઘબરાતા ॥',
        transliteration: 'Jis Ghar Mein Tum Rahti, Sab Sadgun Aata | Sab Sambhav Ho Jata, Man Nahi Ghabrata ||',
        meaningGu: 'જે ઘરમાં આપનો વાસ હોય ત્યાં તમામ સદ્ગુણો પ્રવેશે છે, બધાં કાર્યો સહજ બને છે અને મન નિર્ભય બને છે.',
        meaningEn: 'In whichever abode You reside, all noble virtues flourish; everything becomes possible, and the mind knows no anxiety.'
      }
    ]
  }
];

class MantraChanterController {
  private currentTrack: MantraTrack = MANTRA_TRACKS[0];
  private currentVerseIndex: number = 0;
  private isChanting: boolean = false;
  private selectedSpeaker: string = 'shruti';
  private currentAudio: HTMLAudioElement | null = null;
  private listeners: ((index: number, isPlaying: boolean, speaker: string) => void)[] = [];
  private fallbackTimeout: NodeJS.Timeout | null = null;

  constructor() {}

  public subscribe(cb: (index: number, isPlaying: boolean, speaker: string) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentVerseIndex, this.isChanting, this.selectedSpeaker));
  }

  public setTrack(track: MantraTrack) {
    this.stop();
    this.currentTrack = track;
    this.currentVerseIndex = 0;
    this.notify();
  }

  public setSpeaker(speakerId: string) {
    this.selectedSpeaker = speakerId;
    if (this.isChanting) {
      this.stopAudio();
      this.chantCurrentVerse();
    } else {
      this.notify();
    }
  }

  public getSpeaker(): string {
    return this.selectedSpeaker;
  }

  public getTrack(): MantraTrack {
    return this.currentTrack;
  }

  public getCurrentVerseIndex(): number {
    return this.currentVerseIndex;
  }

  public getIsChanting(): boolean {
    return this.isChanting;
  }

  public start() {
    if (this.isChanting) return;
    this.isChanting = true;

    // Start background devotional music
    sound.startDevotionalMusic();
    sound.playTempleBell();

    this.chantCurrentVerse();
  }

  public stop() {
    this.isChanting = false;
    this.stopAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.fallbackTimeout) {
      clearTimeout(this.fallbackTimeout);
      this.fallbackTimeout = null;
    }
    this.notify();
  }

  public toggle() {
    if (this.isChanting) {
      this.stop();
    } else {
      this.start();
    }
  }

  private stopAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
  }

  private async chantCurrentVerse() {
    if (!this.isChanting) return;
    this.notify();

    const verse = this.currentTrack.verses[this.currentVerseIndex];
    if (!verse) {
      // Loop track
      this.currentVerseIndex = 0;
      this.notify();
      sound.playTempleBell();
      this.fallbackTimeout = setTimeout(() => this.chantCurrentVerse(), 1500);
      return;
    }

    try {
      // 1. Attempt high-fidelity Sarvam AI Bulbul voice synthesis via server proxy
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: verse.sanskritGu,
          speaker: this.selectedSpeaker,
          language: 'gu-IN',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          this.currentAudio = audio;
          audio.volume = sound.getMuted() ? 0 : 0.95;

          audio.onended = () => {
            if (!this.isChanting) return;
            sound.playTempleBell();
            this.fallbackTimeout = setTimeout(() => {
              if (!this.isChanting) return;
              this.currentVerseIndex = (this.currentVerseIndex + 1) % this.currentTrack.verses.length;
              this.chantCurrentVerse();
            }, 1200);
          };

          audio.onerror = () => {
            this.speakWithWebSpeech(verse.sanskritGu);
          };

          await audio.play();
          return;
        }
      }
      // If server returned non-ok, fall back to browser Web Speech API
      this.speakWithWebSpeech(verse.sanskritGu);
    } catch {
      this.speakWithWebSpeech(verse.sanskritGu);
    }
  }

  private speakWithWebSpeech(text: string) {
    if (!this.isChanting) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(
        (v) =>
          v.lang.startsWith('gu') ||
          v.lang.startsWith('hi') ||
          v.lang.startsWith('sa') ||
          v.name.includes('India') ||
          v.lang === 'en-IN'
      );

      if (indianVoice) {
        utterance.voice = indianVoice;
        utterance.lang = indianVoice.lang;
      } else {
        utterance.lang = 'hi-IN';
      }

      utterance.rate = 0.82;
      utterance.pitch = 1.0;
      utterance.volume = sound.getMuted() ? 0 : 1.0;

      utterance.onend = () => {
        if (!this.isChanting) return;
        sound.playTempleBell();
        this.fallbackTimeout = setTimeout(() => {
          if (!this.isChanting) return;
          this.currentVerseIndex = (this.currentVerseIndex + 1) % this.currentTrack.verses.length;
          this.chantCurrentVerse();
        }, 1600);
      };

      utterance.onerror = () => {
        this.handleFallbackTimer();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        this.handleFallbackTimer();
      }
    } else {
      this.handleFallbackTimer();
    }
  }

  private handleFallbackTimer() {
    if (!this.isChanting) return;
    sound.playTempleBell();
    this.fallbackTimeout = setTimeout(() => {
      if (!this.isChanting) return;
      this.currentVerseIndex = (this.currentVerseIndex + 1) % this.currentTrack.verses.length;
      this.chantCurrentVerse();
    }, 6000);
  }

  public jumpToVerse(index: number) {
    this.currentVerseIndex = index;
    if (this.isChanting) {
      this.stopAudio();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.chantCurrentVerse();
    } else {
      this.notify();
    }
  }
}

export const mantraChanter = new MantraChanterController();
