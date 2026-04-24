import type { FeedId } from './types';

export type Language = 'en' | 'hu';

interface FeedCopy {
  label: string;
  shortLabel: string;
  description: string;
}

export interface DashboardCopy {
  locale: string;
  languageName: string;
  languageShort: string;
  pendingMagnitude: string;
  notAvailable: string;
  appBadge: string;
  title: string;
  subtitle: string;
  language: string;
  feeds: Record<FeedId, FeedCopy>;
  filter: {
    timeRange: string;
    minMagnitude: string;
    minimumMagnitudeAria: string;
    all: string;
    watchThreshold: string;
    watchThresholdAria: string;
    refresh: string;
  };
  error: {
    title: string;
    body: string;
    retry: string;
    fallback: string;
  };
  major: {
    watch: string;
    noEvent: (threshold: string) => string;
    emptyBody: (feedLabel: string) => string;
    largest: (threshold: string, feedLabel: string) => string;
    magnitudeSource: string;
    depth: string;
    tsunamiFlag: string;
    alert: string;
    originTime: string;
    usgsEvent: string;
  };
  stats: {
    displayed: string;
    displayedDetail: (feedLabel: string, minimumMagnitude: number) => string;
    strongest: string;
    strongestEmpty: string;
    mostRecent: string;
    mostRecentEmpty: string;
    closestToHungary: string;
    closestEmpty: string;
    magnitude6: string;
    magnitude6Detail: string;
  };
  map: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    depth: string;
    time: string;
  };
  table: {
    title: string;
    subtitle: string;
    show: string;
    hide: string;
    collapsed: (count: string) => string;
    columns: Record<'time' | 'magnitude' | 'depthKm' | 'place' | 'link', string>;
    status: string;
    feltReports: string;
    tsunamiFlag: string;
    openEvent: (place: string) => string;
    emptyTitle: string;
    emptyBody: string;
  };
  footer: {
    feedStatus: string;
    generated: string;
    awaiting: string;
    source: string;
  };
  magnitudeTone: Record<'Major' | 'Strong' | 'Moderate+' | 'Light+' | 'Minor', string>;
}

export const COPY: Record<Language, DashboardCopy> = {
  en: {
    locale: 'en-US',
    languageName: 'English',
    languageShort: 'EN',
    pendingMagnitude: 'Pending',
    notAvailable: 'None',
    appBadge: 'USGS Earthquake Hazards Program',
    title: 'Earthquake Tracker',
    subtitle:
      'Real-time global seismic monitoring using official USGS GeoJSON feeds, with magnitude-scaled map markers, live summary metrics, and sortable event detail.',
    language: 'Language',
    feeds: {
      hour: {
        label: 'Past hour',
        shortLabel: '1H',
        description: 'All USGS-listed earthquakes from the last hour.',
      },
      day: {
        label: 'Past day',
        shortLabel: '24H',
        description: 'All USGS-listed earthquakes from the last 24 hours.',
      },
      week: {
        label: 'Past week',
        shortLabel: '7D',
        description: 'All USGS-listed earthquakes from the last 7 days.',
      },
    },
    filter: {
      timeRange: 'Time range selector',
      minMagnitude: 'Min magnitude',
      minimumMagnitudeAria: 'Minimum magnitude',
      all: 'All',
      watchThreshold: 'Watch threshold',
      watchThresholdAria: 'Major watch threshold',
      refresh: 'Refresh',
    },
    error: {
      title: 'USGS feed unavailable',
      body: 'The dashboard remains available; retry the feed or switch time ranges.',
      retry: 'Retry',
      fallback: 'Unable to load the USGS earthquake feed.',
    },
    major: {
      watch: 'Major earthquake watch',
      noEvent: (threshold: string) => `No ${threshold} earthquake is currently listed.`,
      emptyBody: (feedLabel: string) =>
        `The selected USGS feed for ${feedLabel.toLocaleLowerCase()} does not currently include an earthquake at or above the active monitoring threshold.`,
      largest: (threshold: string, feedLabel: string) =>
        `Largest ${threshold} event in ${feedLabel.toLocaleLowerCase()}`,
      magnitudeSource: 'USGS magnitude',
      depth: 'Depth',
      tsunamiFlag: 'Tsunami flag',
      alert: 'Alert',
      originTime: 'Origin time',
      usgsEvent: 'USGS event',
    },
    stats: {
      displayed: 'Displayed earthquakes',
      displayedDetail: (feedLabel: string, minimumMagnitude: number) =>
        `${feedLabel}${minimumMagnitude > 0 ? `, M ${minimumMagnitude}+` : ', all magnitudes'}`,
      strongest: 'Strongest earthquake',
      strongestEmpty: 'No event in the current filter',
      mostRecent: 'Most recent',
      mostRecentEmpty: 'No recent event in the current filter',
      closestToHungary: 'Closest to Hungary',
      closestEmpty: 'No event in the current filter',
      magnitude6: 'Magnitude 6+',
      magnitude6Detail: 'Events meeting or exceeding M 6.0',
    },
    map: {
      title: 'Global Seismic Map',
      subtitle: 'Marker color and size scale with reported magnitude.',
      loading: 'Loading USGS feed',
      empty: 'No earthquakes match the active filters.',
      depth: 'Depth',
      time: 'Time',
    },
    table: {
      title: 'Recent Earthquakes',
      subtitle: 'Sorted list of events currently shown on the map.',
      show: 'Show list',
      hide: 'Hide list',
      collapsed: (count: string) =>
        `${count} events available. Expand the list to inspect, sort, and open individual USGS event records.`,
      columns: {
        time: 'Time',
        magnitude: 'Magnitude',
        depthKm: 'Depth',
        place: 'Location',
        link: 'Link',
      },
      status: 'Status',
      feltReports: 'Felt reports',
      tsunamiFlag: 'Tsunami flag',
      openEvent: (place: string) => `Open USGS event for ${place}`,
      emptyTitle: 'No earthquakes match the current filters.',
      emptyBody: 'Lower the minimum magnitude or choose a wider time range.',
    },
    footer: {
      feedStatus: 'Feed status:',
      generated: 'Generated',
      awaiting: 'Awaiting USGS data',
      source: 'Source GeoJSON',
    },
    magnitudeTone: {
      Major: 'Major',
      Strong: 'Strong',
      'Moderate+': 'Moderate+',
      'Light+': 'Light+',
      Minor: 'Minor',
    },
  },
  hu: {
    locale: 'hu-HU',
    languageName: 'Magyar',
    languageShort: 'HU',
    pendingMagnitude: 'Függőben',
    notAvailable: 'Nincs',
    appBadge: 'USGS földrengésfigyelő program',
    title: 'Földrengésfigyelő',
    subtitle:
      'Valós idejű globális szeizmikus áttekintés hivatalos USGS GeoJSON-adatokból, magnitúdó szerint méretezett térképjelölőkkel, élő összesítő mutatókkal és rendezhető eseménylistával.',
    language: 'Nyelv',
    feeds: {
      hour: {
        label: 'Elmúlt óra',
        shortLabel: '1 ó',
        description: 'Az USGS által listázott földrengések az elmúlt órából.',
      },
      day: {
        label: 'Elmúlt nap',
        shortLabel: '24 ó',
        description: 'Az USGS által listázott földrengések az elmúlt 24 órából.',
      },
      week: {
        label: 'Elmúlt hét',
        shortLabel: '7 n',
        description: 'Az USGS által listázott földrengések az elmúlt 7 napból.',
      },
    },
    filter: {
      timeRange: 'Időszakválasztó',
      minMagnitude: 'Min. magnitúdó',
      minimumMagnitudeAria: 'Minimális magnitúdó',
      all: 'Összes',
      watchThreshold: 'Figyelési küszöb',
      watchThresholdAria: 'Nagy rengés figyelési küszöbe',
      refresh: 'Frissítés',
    },
    error: {
      title: 'Az USGS adatfolyam nem érhető el',
      body: 'A dashboard továbbra is használható; próbáld újra, vagy válassz másik időszakot.',
      retry: 'Újrapróbálás',
      fallback: 'Nem sikerült betölteni az USGS földrengés-adatfolyamot.',
    },
    major: {
      watch: 'Nagy rengések figyelése',
      noEvent: (threshold: string) => `Jelenleg nincs ${threshold} földrengés a listában.`,
      emptyBody: (feedLabel: string) =>
        `Az USGS kiválasztott, ${feedLabel.toLocaleLowerCase()} időszakra vonatkozó adatfolyama jelenleg nem tartalmaz a figyelési küszöböt elérő vagy meghaladó földrengést.`,
      largest: (threshold: string, feedLabel: string) =>
        `Legnagyobb ${threshold} esemény (${feedLabel.toLocaleLowerCase()})`,
      magnitudeSource: 'USGS magnitúdó',
      depth: 'Mélység',
      tsunamiFlag: 'Cunamijelzés',
      alert: 'Riasztás',
      originTime: 'Keletkezési idő',
      usgsEvent: 'USGS esemény',
    },
    stats: {
      displayed: 'Megjelenített rengések',
      displayedDetail: (feedLabel: string, minimumMagnitude: number) =>
        `${feedLabel}${minimumMagnitude > 0 ? `, M ${minimumMagnitude}+` : ', minden magnitúdó'}`,
      strongest: 'Legerősebb rengés',
      strongestEmpty: 'Nincs esemény az aktuális szűrésben',
      mostRecent: 'Legfrissebb',
      mostRecentEmpty: 'Nincs friss esemény az aktuális szűrésben',
      closestToHungary: 'Magyarországhoz legközelebb',
      closestEmpty: 'Nincs esemény az aktuális szűrésben',
      magnitude6: '6+ magnitúdó',
      magnitude6Detail: 'M 6,0 vagy annál erősebb események',
    },
    map: {
      title: 'Globális szeizmikus térkép',
      subtitle: 'A jelölők színe és mérete a jelentett magnitúdót követi.',
      loading: 'USGS-adatok betöltése',
      empty: 'Nincs rengés az aktív szűrők szerint.',
      depth: 'Mélység',
      time: 'Idő',
    },
    table: {
      title: 'Legutóbbi földrengések',
      subtitle: 'A térképen megjelenő események rendezhető listája.',
      show: 'Lista megnyitása',
      hide: 'Lista elrejtése',
      collapsed: (count: string) =>
        `${count} esemény érhető el. Nyisd meg a listát az események vizsgálatához, rendezéséhez és az USGS-rekordok megnyitásához.`,
      columns: {
        time: 'Idő',
        magnitude: 'Magnitúdó',
        depthKm: 'Mélység',
        place: 'Helyszín',
        link: 'Link',
      },
      status: 'Állapot',
      feltReports: 'Észlelések',
      tsunamiFlag: 'Cunamijelzés',
      openEvent: (place: string) => `USGS esemény megnyitása: ${place}`,
      emptyTitle: 'Nincs találat az aktuális szűrőkkel.',
      emptyBody: 'Csökkentsd a minimális magnitúdót, vagy válassz hosszabb időszakot.',
    },
    footer: {
      feedStatus: 'Adatfolyam:',
      generated: 'Generálva',
      awaiting: 'USGS-adatokra vár',
      source: 'USGS GeoJSON-forrás',
    },
    magnitudeTone: {
      Major: 'Nagy',
      Strong: 'Erős',
      'Moderate+': 'Közepes+',
      'Light+': 'Gyenge+',
      Minor: 'Kisebb',
    },
  },
};
