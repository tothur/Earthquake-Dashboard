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
  theme: {
    label: string;
    auto: string;
    light: string;
    dark: string;
  };
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
    strongestAction: string;
    mostRecent: string;
    mostRecentEmpty: string;
    mostRecentAction: string;
    closestToHungary: string;
    closestEmpty: string;
    closestAction: string;
    magnitude6: string;
    magnitude6Detail: string;
  };
  map: {
    title: string;
    subtitle: string;
    focusLabel: string;
    focus: {
      global: string;
      europe: string;
      hungary: string;
    };
    contextLabel: string;
    tectonicLayer: string;
    tectonicLayerDescription: string;
    tsunamiAlertsLayer: string;
    tsunamiAlertsDescription: string;
    tsunamiAlertArea: string;
    alertArea: string;
    alertSeverity: string;
    alertSource: string;
    tectonicBoundary: string;
    subductionZone: string;
    cluster: (count: string) => string;
    clusterTitle: (count: string) => string;
    clusterStrongest: string;
    clusterLatest: string;
    zoomCluster: string;
    loading: string;
    empty: string;
    depth: string;
    time: string;
  };
  timeline: {
    title: string;
    subtitle: string;
    empty: string;
    eventCount: (count: string) => string;
    peak: string;
    strongest: string;
    interval: (start: string, end: string) => string;
  };
  distribution: {
    title: string;
    subtitle: string;
    empty: string;
    total: string;
    strongestBin: string;
    pending: string;
    eventCount: (count: string) => string;
    bins: {
      minor: string;
      light: string;
      moderate: string;
      strong: string;
      major: string;
    };
  };
  tsunami: {
    title: string;
    openReferencedEarthquake: string;
    referencedUnavailable: string;
    productEmptyTitle: string;
    productEmptyBody: string;
    bulletinDetails: string;
    showDetails: string;
    hideDetails: string;
    headline: string;
    threatStatus: string;
    issued: string;
    sourceOffice: string;
    messageNumber: string;
    earthquake: string;
    evaluation: string;
    threatForecast: string;
    recommendedActions: string;
    observedWave: string;
    openProduct: string;
    activeAlertList: string;
    disclaimer: string;
    alertFeedLoading: string;
    alertFeedUnavailable: string;
    alertFeedFallback: string;
    warningCenter: string;
    expires: string;
    usgsFlagContext: (feedLabel: string) => string;
    reviewFlaggedEvents: string;
    usgsFlagSummary: (count: string) => string;
    viewDetails: string;
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
    openDetails: (place: string) => string;
    openEvent: (place: string) => string;
    emptyTitle: string;
    emptyBody: string;
  };
  detail: {
    title: string;
    subtitle: string;
    close: string;
    viewDetails: string;
    overview: string;
    metrics: string;
    metadata: string;
    coordinates: string;
    latitude: string;
    longitude: string;
    depth: string;
    magnitude: string;
    magnitudeType: string;
    originTime: string;
    updated: string;
    status: string;
    alert: string;
    tsunamiFlag: string;
    tsunamiFlagActive: string;
    tsunamiFlagInactive: string;
    tsunamiFlagNote: string;
    feltReports: string;
    significance: string;
    usgsEvent: string;
    noAlert: string;
    yes: string;
    no: string;
  };
  footer: {
    description: string;
    feedStatus: string;
    generated: string;
    awaiting: string;
    source: string;
    tsunamiSource: string;
  };
  magnitudeTone: Record<'Major' | 'Strong' | 'Moderate+' | 'Light+' | 'Minor', string>;
}

export const COPY: Record<Language, DashboardCopy> = {
  en: {
    locale: 'en-US',
    languageName: 'English',
    languageShort: 'EN',
    theme: {
      label: 'Theme',
      auto: 'Auto',
      light: 'Light',
      dark: 'Dark',
    },
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
      strongestAction: 'Open the strongest earthquake on the map',
      mostRecent: 'Most recent',
      mostRecentEmpty: 'No recent event in the current filter',
      mostRecentAction: 'Open the most recent earthquake on the map',
      closestToHungary: 'Closest to Hungary',
      closestEmpty: 'No event in the current filter',
      closestAction: 'Open the closest earthquake to Hungary on the map',
      magnitude6: 'Magnitude 6+',
      magnitude6Detail: 'Events meeting or exceeding M 6.0',
    },
    map: {
      title: 'Global Seismic Map',
      subtitle: 'Marker color and size scale with reported magnitude.',
      focusLabel: 'Map focus',
      focus: {
        global: 'Global',
        europe: 'Europe',
        hungary: 'Hungary',
      },
      contextLabel: 'Map context layers',
      tectonicLayer: 'Tectonic context',
      tectonicLayerDescription: 'PB2002 plate boundaries and subduction zones.',
      tsunamiAlertsLayer: 'Tsunami alerts',
      tsunamiAlertsDescription: 'NOAA/NWS active tsunami alert polygons, when available.',
      tsunamiAlertArea: 'Tsunami alert area',
      alertArea: 'Area',
      alertSeverity: 'Severity',
      alertSource: 'Official alert',
      tectonicBoundary: 'Plate boundary',
      subductionZone: 'Subduction zone',
      cluster: (count: string) => `${count} events`,
      clusterTitle: (count: string) => `${count} earthquakes in this cluster`,
      clusterStrongest: 'Strongest',
      clusterLatest: 'Latest',
      zoomCluster: 'Zoom to cluster',
      loading: 'Loading USGS feed',
      empty: 'No earthquakes match the active filters.',
      depth: 'Depth',
      time: 'Time',
    },
    timeline: {
      title: 'Earthquake Timeline',
      subtitle: 'Event density across the selected feed window.',
      empty: 'No timeline activity for the active filters.',
      eventCount: (count: string) => `${count} events`,
      peak: 'Peak interval',
      strongest: 'Strongest event',
      interval: (start: string, end: string) => `${start} - ${end}`,
    },
    distribution: {
      title: 'Magnitude Distribution',
      subtitle: 'How reported magnitudes are distributed in the active filter.',
      empty: 'No magnitude data for the active filters.',
      total: 'Total with magnitude',
      strongestBin: 'Most populated range',
      pending: 'Pending',
      eventCount: (count: string) => `${count} events`,
      bins: {
        minor: 'Below M4',
        light: 'M4.0-4.9',
        moderate: 'M5.0-5.9',
        strong: 'M6.0-6.9',
        major: 'M7.0+',
      },
    },
    tsunami: {
      title: 'Tsunami information',
      openReferencedEarthquake: 'Open referenced earthquake details',
      referencedUnavailable: 'Not listed in the selected USGS feed',
      productEmptyTitle: 'No recent NOAA tsunami product returned',
      productEmptyBody:
        'The NOAA/NWS tsunami product feed did not return a recent watch, warning, advisory, or information statement.',
      bulletinDetails: 'NOAA bulletin details',
      showDetails: 'Show details',
      hideDetails: 'Hide details',
      headline: 'U.S. Tsunami Warning System Threat Message',
      threatStatus: 'Tsunami threat status',
      issued: 'Issued',
      sourceOffice: 'Source office',
      messageNumber: 'Message',
      earthquake: 'Earthquake parameters',
      evaluation: 'Evaluation',
      threatForecast: 'Threat forecast',
      recommendedActions: 'Recommended actions',
      observedWave: 'Observed wave',
      openProduct: 'Open NOAA product',
      activeAlertList: 'Currently active alert products',
      disclaimer:
        'NOAA tsunami products are informational here. Always follow civil protection instructions and official tsunami warning centers.',
      alertFeedLoading: 'Loading recent NOAA tsunami products...',
      alertFeedUnavailable: 'NOAA tsunami products unavailable.',
      alertFeedFallback: 'Unable to load recent NOAA/NWS tsunami products.',
      warningCenter: 'Tsunami.gov',
      expires: 'Expires',
      usgsFlagContext: (feedLabel: string) =>
        `USGS also marks tsunami-related earthquake records in the selected ${feedLabel.toLocaleLowerCase()} feed.`,
      reviewFlaggedEvents: 'USGS flagged earthquakes',
      usgsFlagSummary: (count: string) => `${count} flagged`,
      viewDetails: 'View details',
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
      openDetails: (place: string) => `Open details for ${place}`,
      openEvent: (place: string) => `Open USGS event for ${place}`,
      emptyTitle: 'No earthquakes match the current filters.',
      emptyBody: 'Lower the minimum magnitude or choose a wider time range.',
    },
    detail: {
      title: 'Event details',
      subtitle: 'USGS event metadata',
      close: 'Close detail panel',
      viewDetails: 'View details',
      overview: 'Overview',
      metrics: 'Metrics',
      metadata: 'Metadata',
      coordinates: 'Coordinates',
      latitude: 'Latitude',
      longitude: 'Longitude',
      depth: 'Depth',
      magnitude: 'Magnitude',
      magnitudeType: 'Magnitude type',
      originTime: 'Origin time',
      updated: 'Updated',
      status: 'Status',
      alert: 'Alert',
      tsunamiFlag: 'Tsunami flag',
      tsunamiFlagActive: 'USGS tsunami flag active',
      tsunamiFlagInactive: 'No USGS tsunami flag',
      tsunamiFlagNote:
        'This is the tsunami flag included in the USGS earthquake feed, not a replacement for official tsunami advisories.',
      feltReports: 'Felt reports',
      significance: 'Significance',
      usgsEvent: 'USGS event',
      noAlert: 'No alert level',
      yes: 'Yes',
      no: 'No',
    },
    footer: {
      description:
        'Real-time global seismic monitoring using official USGS GeoJSON feeds, with magnitude-scaled map markers, live summary metrics, and sortable event detail.',
      feedStatus: 'Feed status:',
      generated: 'Generated',
      awaiting: 'Awaiting USGS data',
      source: 'Source GeoJSON',
      tsunamiSource: 'NOAA/NWS tsunami products',
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
    theme: {
      label: 'Téma',
      auto: 'Automatikus',
      light: 'Világos',
      dark: 'Sötét',
    },
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
      strongestAction: 'Legerősebb földrengés megnyitása a térképen',
      mostRecent: 'Legfrissebb',
      mostRecentEmpty: 'Nincs friss esemény az aktuális szűrésben',
      mostRecentAction: 'Legfrissebb földrengés megnyitása a térképen',
      closestToHungary: 'Magyarországhoz legközelebb',
      closestEmpty: 'Nincs esemény az aktuális szűrésben',
      closestAction: 'Magyarországhoz legközelebbi földrengés megnyitása a térképen',
      magnitude6: '6+ magnitúdó',
      magnitude6Detail: 'M 6,0 vagy annál erősebb események',
    },
    map: {
      title: 'Globális szeizmikus térkép',
      subtitle: 'A jelölők színe és mérete a jelentett magnitúdót követi.',
      focusLabel: 'Térképfókusz',
      focus: {
        global: 'Globális',
        europe: 'Európa',
        hungary: 'Magyarország',
      },
      contextLabel: 'Térképi kontextusrétegek',
      tectonicLayer: 'Tektonikai kontextus',
      tectonicLayerDescription: 'PB2002 lemezhatárok és szubdukciós zónák.',
      tsunamiAlertsLayer: 'Cunamiriasztások',
      tsunamiAlertsDescription: 'NOAA/NWS aktív cunamiriadó-poligonok, ha elérhetők.',
      tsunamiAlertArea: 'Cunamiriadó területe',
      alertArea: 'Terület',
      alertSeverity: 'Súlyosság',
      alertSource: 'Hivatalos riasztás',
      tectonicBoundary: 'Lemezhatár',
      subductionZone: 'Szubdukciós zóna',
      cluster: (count: string) => `${count} esemény`,
      clusterTitle: (count: string) => `${count} földrengés ebben a csoportban`,
      clusterStrongest: 'Legerősebb',
      clusterLatest: 'Legfrissebb',
      zoomCluster: 'Ráközelítés',
      loading: 'USGS-adatok betöltése',
      empty: 'Nincs rengés az aktív szűrők szerint.',
      depth: 'Mélység',
      time: 'Idő',
    },
    timeline: {
      title: 'Földrengés-idővonal',
      subtitle: 'Az eseménysűrűség a kiválasztott adatfolyam időablakában.',
      empty: 'Nincs idővonali aktivitás az aktuális szűrőkkel.',
      eventCount: (count: string) => `${count} esemény`,
      peak: 'Legaktívabb időszak',
      strongest: 'Legerősebb esemény',
      interval: (start: string, end: string) => `${start} - ${end}`,
    },
    distribution: {
      title: 'Magnitúdóeloszlás',
      subtitle: 'A jelentett magnitúdók megoszlása az aktuális szűrésben.',
      empty: 'Nincs magnitúdóadat az aktuális szűrőkkel.',
      total: 'Magnitúdóval rendelkező esemény',
      strongestBin: 'Legnépesebb tartomány',
      pending: 'Függőben',
      eventCount: (count: string) => `${count} esemény`,
      bins: {
        minor: 'M4 alatt',
        light: 'M4,0-4,9',
        moderate: 'M5,0-5,9',
        strong: 'M6,0-6,9',
        major: 'M7,0+',
      },
    },
    tsunami: {
      title: 'Cunamival kapcsolatos információ',
      openReferencedEarthquake: 'Kapcsolódó földrengés részleteinek megnyitása',
      referencedUnavailable: 'Nincs benne a kiválasztott USGS-adatfolyamban',
      productEmptyTitle: 'Nincs friss NOAA cunamitermék',
      productEmptyBody:
        'A NOAA/NWS cunami-termékadatfolyama nem adott vissza friss figyelmeztetést, riasztást, tanácsadást vagy tájékoztatót.',
      bulletinDetails: 'NOAA-közlemény részletei',
      showDetails: 'Részletek mutatása',
      hideDetails: 'Részletek elrejtése',
      headline: 'U.S. Tsunami Warning System veszélyügyi közlemény',
      threatStatus: 'Cunamiveszély állapota',
      issued: 'Kiadva',
      sourceOffice: 'Kiadó központ',
      messageNumber: 'Üzenet',
      earthquake: 'Földrengésparaméterek',
      evaluation: 'Értékelés',
      threatForecast: 'Cunamiveszély-előrejelzés',
      recommendedActions: 'Javasolt teendők',
      observedWave: 'Megfigyelt hullám',
      openProduct: 'NOAA-termék megnyitása',
      activeAlertList: 'Jelenleg aktív riasztási termékek',
      disclaimer:
        'A NOAA cunamitermékek itt tájékoztató jellegűek. Mindig a katasztrófavédelem és a hivatalos cunamijelző központok utasításait kövesd.',
      alertFeedLoading: 'Friss NOAA cunamitermékek betöltése...',
      alertFeedUnavailable: 'A NOAA cunamitermékek nem érhetők el.',
      alertFeedFallback: 'Nem sikerült betölteni a friss NOAA/NWS cunamitermékeket.',
      warningCenter: 'Tsunami.gov',
      expires: 'Lejár',
      usgsFlagContext: (feedLabel: string) =>
        `Az USGS a kiválasztott, ${feedLabel.toLocaleLowerCase()} időszakra vonatkozó adatfolyamban külön jelöli a cunamival kapcsolatos földrengésrekordokat is.`,
      reviewFlaggedEvents: 'USGS által jelölt földrengések',
      usgsFlagSummary: (count: string) => `${count} jelölés`,
      viewDetails: 'Részletek',
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
      openDetails: (place: string) => `Részletek megnyitása: ${place}`,
      openEvent: (place: string) => `USGS esemény megnyitása: ${place}`,
      emptyTitle: 'Nincs találat az aktuális szűrőkkel.',
      emptyBody: 'Csökkentsd a minimális magnitúdót, vagy válassz hosszabb időszakot.',
    },
    detail: {
      title: 'Esemény részletei',
      subtitle: 'USGS eseményadatok',
      close: 'Részletpanel bezárása',
      viewDetails: 'Részletek',
      overview: 'Áttekintés',
      metrics: 'Mérőszámok',
      metadata: 'Metaadatok',
      coordinates: 'Koordináták',
      latitude: 'Szélesség',
      longitude: 'Hosszúság',
      depth: 'Mélység',
      magnitude: 'Magnitúdó',
      magnitudeType: 'Magnitúdótípus',
      originTime: 'Keletkezési idő',
      updated: 'Frissítve',
      status: 'Állapot',
      alert: 'Riasztás',
      tsunamiFlag: 'Cunamijelzés',
      tsunamiFlagActive: 'Aktív USGS cunamijelzés',
      tsunamiFlagInactive: 'Nincs USGS cunamijelzés',
      tsunamiFlagNote:
        'Ez az USGS földrengés-adatfolyamában szereplő cunamijelző, nem helyettesíti a hivatalos cunamitájékoztatást.',
      feltReports: 'Észlelések',
      significance: 'Jelentőség',
      usgsEvent: 'USGS esemény',
      noAlert: 'Nincs riasztási szint',
      yes: 'Igen',
      no: 'Nem',
    },
    footer: {
      description:
        'Valós idejű globális szeizmikus megfigyelés hivatalos USGS GeoJSON-adatokkal, magnitúdó szerint méretezett térképjelölőkkel, élő összesítő mutatókkal és rendezhető eseményrészletekkel.',
      feedStatus: 'Adatfolyam:',
      generated: 'Generálva',
      awaiting: 'USGS-adatokra vár',
      source: 'USGS GeoJSON-forrás',
      tsunamiSource: 'NOAA/NWS cunamitermékek',
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
