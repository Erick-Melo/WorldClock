import { useEffect, useState } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

interface ClockProps {
  timezone: string;
  onRemove?: () => void;
  isRemovable?: boolean;
  sharedTime?: Date;
}

// Mapeia strings de fuso horário IANA para códigos de país ISO 3166-1 alpha-2 (minúsculas)
// Este mapa é extenso, mas não exaustivo. Para uma aplicação de produção, considere uma biblioteca dedicada.
const timezoneToCountryMap: { [key: string]: string } = {
  'America/Sao_Paulo': 'br',
  'America/New_York': 'us',
  'America/Los_Angeles': 'us',
  'Europe/London': 'gb',
  'Europe/Paris': 'fr',
  'Asia/Tokyo': 'jp',
  'Australia/Sydney': 'au',
  'Europe/Berlin': 'de',
  'Asia/Shanghai': 'cn',
  'Asia/Dubai': 'ae',
  'Africa/Cairo': 'eg',
  'America/Argentina/Buenos_Aires': 'ar',
  'Asia/Kolkata': 'in',
  'Europe/Moscow': 'ru',
  'Pacific/Auckland': 'nz',
  'America/Mexico_City': 'mx',
  'Canada/Eastern': 'ca',
  'Canada/Pacific': 'ca',
  'Europe/Madrid': 'es',
  'Europe/Rome': 'it',
  'Asia/Seoul': 'kr',
  'Asia/Singapore': 'sg',
  'Africa/Johannesburg': 'za',
  'America/Bogota': 'co',
  'America/Lima': 'pe',
  'America/Santiago': 'cl',
  'Europe/Lisbon': 'pt',
  'Asia/Bangkok': 'th',
  'Asia/Jakarta': 'id',
  'Asia/Manila': 'ph',
  'Europe/Amsterdam': 'nl',
  'Europe/Brussels': 'be',
  'Europe/Stockholm': 'se',
  'Europe/Oslo': 'no',
  'Europe/Helsinki': 'fi',
  'Europe/Warsaw': 'pl',
  'Europe/Prague': 'cz',
  'Europe/Budapest': 'hu',
  'Europe/Athens': 'gr',
  'Europe/Istanbul': 'tr',
  'Asia/Riyadh': 'sa',
  'Asia/Tehran': 'ir',
  'Africa/Lagos': 'ng',
  'Africa/Nairobi': 'ke',
  'America/Caracas': 've',
  'America/La_Paz': 'bo',
  'America/Montevideo': 'uy',
  'America/Asuncion': 'py',
  'America/Guatemala': 'gt',
  'America/Havana': 'cu',
  'America/Kingston': 'jm',
  'America/Panama': 'pa',
  'America/Puerto_Rico': 'pr',
  'America/Santo_Domingo': 'do',
  'Asia/Ho_Chi_Minh': 'vn',
  'Asia/Kuala_Lumpur': 'my',
  'Asia/Taipei': 'tw',
  'Europe/Dublin': 'ie',
  'Europe/Vienna': 'at',
  'Europe/Zurich': 'ch',
  'Australia/Perth': 'au',
  'Australia/Brisbane': 'au',
  'Pacific/Honolulu': 'us',
  'America/Anchorage': 'us',
  'America/Phoenix': 'us',
  'America/Denver': 'us',
  'America/Chicago': 'us',
  'America/Detroit': 'us',
  'America/Indianapolis': 'us',
  'America/Juneau': 'us',
  'America/Adak': 'us',
  'Pacific/Midway': 'us',
  'Pacific/Guam': 'gu',
  'Pacific/Saipan': 'mp',
  'America/St_Johns': 'ca',
  'America/Halifax': 'ca',
  'America/Winnipeg': 'ca',
  'America/Edmonton': 'ca',
  'America/Vancouver': 'ca',
  'Europe/Kiev': 'ua',
  'Europe/Minsk': 'by',
  'Europe/Bucharest': 'ro',
  'Europe/Sofia': 'bg',
  'Europe/Zagreb': 'hr',
  'Europe/Belgrade': 'rs',
  'Europe/Sarajevo': 'ba',
  'Europe/Skopje': 'mk',
  'Europe/Tirane': 'al',
  'Europe/Chisinau': 'md',
  'Asia/Jerusalem': 'il',
  'Asia/Damascus': 'sy',
  'Asia/Baghdad': 'iq',
  'Asia/Amman': 'jo',
  'Asia/Beirut': 'lb',
  'Asia/Kuwait': 'kw',
  'Asia/Qatar': 'qa',
  'Asia/Bahrain': 'bh',
  'Asia/Muscat': 'om',
  'Asia/Yekaterinburg': 'ru',
  'Asia/Novosibirsk': 'ru',
  'Asia/Vladivostok': 'ru',
  'Asia/Kamchatka': 'ru',
  'Asia/Irkutsk': 'ru',
  'Asia/Krasnoyarsk': 'ru',
  'Asia/Omsk': 'ru',
  'Asia/Samarkand': 'uz',
  'Asia/Tashkent': 'uz',
  'Asia/Almaty': 'kz',
  'Asia/Bishkek': 'kg',
  'Asia/Dushanbe': 'tj',
  'Asia/Ashgabat': 'tm',
  'Asia/Kabul': 'af',
  'Asia/Karachi': 'pk',
  'Asia/Colombo': 'lk',
  'Asia/Kathmandu': 'np',
  'Asia/Dhaka': 'bd',
  'Asia/Rangoon': 'mm',
  'Asia/Vientiane': 'la',
  'Asia/Phnom_Penh': 'kh',
  'Asia/Brunei': 'bn',
  'Asia/Jayapura': 'id',
  'Asia/Makassar': 'id',
  'Asia/Pontianak': 'id',
  'Asia/Ulaanbaatar': 'mn',
  'Australia/Darwin': 'au',
  'Australia/Adelaide': 'au',
  'Australia/Hobart': 'au',
  'Australia/Melbourne': 'au',
  'Australia/Brisbane': 'au',
  'Pacific/Fiji': 'fj',
  'Pacific/Tahiti': 'pf',
  'Pacific/Noumea': 'nc',
  'Pacific/Port_Moresby': 'pg',
  'Pacific/Apia': 'ws',
  'Pacific/Tongatapu': 'to',
  'Pacific/Tarawa': 'ki',
  'Pacific/Majuro': 'mh',
  'Pacific/Palau': 'pw',
  'Pacific/Pohnpei': 'fm',
  'Pacific/Funafuti': 'tv',
  'Pacific/Nauru': 'nr',
  'Pacific/Kosrae': 'fm',
  'Pacific/Kwajalein': 'mh',
  'Pacific/Wallis': 'wf',
  'Pacific/Chatham': 'nz',
  'Africa/Algiers': 'dz',
  'Africa/Luanda': 'ao',
  'Africa/Porto-Novo': 'bj',
  'Africa/Gaborone': 'bw',
  'Africa/Ouagadougou': 'bf',
  'Africa/Bujumbura': 'bi',
  'Africa/Douala': 'cm',
  'Africa/Bangui': 'cf',
  'Africa/Ndjamena': 'td',
  'Africa/Kinshasa': 'cd',
  'Africa/Brazzaville': 'cg',
  'Africa/Abidjan': 'ci',
  'Africa/Djibouti': 'dj',
  'Africa/Asmara': 'er',
  'Africa/Addis_Ababa': 'et',
  'Africa/Libreville': 'ga',
  'Africa/Banjul': 'gm',
  'Africa/Accra': 'gh',
  'Africa/Conakry': 'gn',
  'Africa/Bissau': 'gw',
  'Africa/Malabo': 'gq',
  'Africa/Monrovia': 'lr',
  'Africa/Tripoli': 'ly',
  'Africa/Maseru': 'ls',
  'Africa/Blantyre': 'mw',
  'Africa/Bamako': 'ml',
  'Africa/Nouakchott': 'mr',
  'Africa/Port_Louis': 'mu',
  'Africa/Casablanca': 'ma',
  'Africa/Maputo': 'mz',
  'Africa/Windhoek': 'na',
  'Africa/Niamey': 'ne',
  'Africa/Kigali': 'rw',
  'Africa/Dakar': 'sn',
  'Africa/Freetown': 'sl',
  'Africa/Mogadishu': 'so',
  'Africa/Juba': 'ss',
  'Africa/Khartoum': 'sd',
  'Africa/Mbabane': 'sz',
  'Africa/Dar_es_Salaam': 'tz',
  'Africa/Lome': 'tg',
  'Africa/Tunis': 'tn',
  'Africa/Kampala': 'ug',
  'Africa/El_Aaiun': 'eh',
  'Africa/Lusaka': 'zm',
  'Africa/Harare': 'zw',
  'Indian/Antananarivo': 'mg',
  'Indian/Comoro': 'km',
  'Indian/Mahe': 'sc',
  'Indian/Maldives': 'mv',
  'Indian/Mauritius': 'mu',
  'Indian/Reunion': 're',
  'Indian/Mayotte': 'yt',
  'Atlantic/Azores': 'pt',
  'Atlantic/Madeira': 'pt',
  'Atlantic/Canary': 'es',
  'Atlantic/Reykjavik': 'is',
  'Atlantic/Cape_Verde': 'cv',
  'Atlantic/St_Helena': 'sh',
  'America/Godthab': 'gl',
  'America/Danmarkshavn': 'gl',
  'America/Scoresbysund': 'gl',
  'America/Thule': 'gl',
  'America/Aruba': 'aw',
  'America/Curacao': 'cw',
  'America/Kralendijk': 'bq',
  'America/Port_of_Spain': 'tt',
  'America/Barbados': 'bb',
  'America/St_Lucia': 'lc',
  'America/Grenada': 'gd',
  'America/Antigua': 'ag',
  'America/Dominica': 'dm',
  'America/St_Kitts': 'kn',
  'America/St_Vincent': 'vc',
  'America/Montserrat': 'ms',
  'America/Anguilla': 'ai',
  'America/Tortola': 'vg',
  'America/St_Thomas': 'vi',
  'America/Cayman': 'ky',
  'America/Nassau': 'bs',
  'America/Belize': 'bz',
  'America/El_Salvador': 'sv',
  'America/Tegucigalpa': 'hn',
  'America/Managua': 'ni',
  'America/Costa_Rica': 'cr',
  'America/Port-au-Prince': 'ht',
  'America/Grand_Turk': 'tc',
  'America/Paramaribo': 'sr',
  'America/Guyana': 'gy',
  'America/Cayenne': 'gf',
  'America/Miquelon': 'pm',
  'America/Noronha': 'br',
  'America/Belem': 'br',
  'America/Fortaleza': 'br',
  'America/Recife': 'br',
  'America/Araguaina': 'br',
  'America/Maceio': 'br',
  'America/Bahia': 'br',
  'America/Campo_Grande': 'br',
  'America/Cuiaba': 'br',
  'America/Porto_Velho': 'br',
  'America/Boa_Vista': 'br',
  'America/Manaus': 'br',
  'America/Eirunepe': 'br',
  'America/Rio_Branco': 'br',
  'America/Santiago': 'cl',
  'America/Punta_Arenas': 'cl',
  'America/Easter': 'cl',
  'Antarctica/Palmer': 'aq',
  'Antarctica/Rothera': 'aq',
  'Antarctica/Syowa': 'aq',
  'Antarctica/Mawson': 'aq',
  'Antarctica/Vostok': 'aq',
  'Antarctica/Casey': 'aq',
  'Antarctica/Davis': 'aq',
  'Antarctica/DumontDUrville': 'aq',
  'Antarctica/Macquarie': 'au',
  'Antarctica/McMurdo': 'us',
  'Antarctica/South_Pole': 'us',
  'Arctic/Longyearbyen': 'sj',
};

const getCountryCodeFromTimezone = (tz: string): string | null => {
  // Verifica primeiro a correspondência exata
  if (timezoneToCountryMap[tz]) {
    return timezoneToCountryMap[tz];
  }

  // Se não houver correspondência exata, tenta encontrar uma correspondência parcial para regiões mais amplas.
  // Esta é uma heurística e pode não ser perfeita para todos os casos.
  // Ela tenta corresponder ao prefixo comum mais longo para lidar com casos como "America/Argentina/Cordoba"
  // se apenas "America/Argentina/Buenos_Aires" ou "America/Argentina" estivesse mapeado.
  let bestMatch: string | null = null;
  let longestMatchLength = 0;

  for (const key in timezoneToCountryMap) {
    if (tz.startsWith(key) && key.length > longestMatchLength) {
      bestMatch = timezoneToCountryMap[key];
      longestMatchLength = key.length;
    }
  }

  return bestMatch;
}

export default function Clock({ timezone, onRemove, isRemovable = false, sharedTime }: ClockProps) {
  const [time, setTime] = useState<Date>(new Date());

  // Usar sharedTime se fornecido, caso contrário usar tempo local
  useEffect(() => {
    if (sharedTime) {
      setTime(sharedTime);
    } else {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [sharedTime]);

  // Get the time in the specified timezone
  const getTimeInTimezone = () => {
    try {
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      return formatter.format(time);
    } catch {
      return '--:--:--';
    }
  };

  // Get timezone display name
  const getTimezoneName = () => {
    try {
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(time);
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      return tzPart?.value || timezone;
    } catch {
      return timezone;
    }
  };

  // Calculate clock hand positions
  const getClockHandPositions = () => {
    try {
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const parts = formatter.formatToParts(time);
      
      const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
      const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
      const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');

      const secondDegrees = (second / 60) * 360;
      const minuteDegrees = (minute / 60) * 360 + (second / 60) * 6;
      const hourDegrees = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

      return { secondDegrees, minuteDegrees, hourDegrees };
    } catch {
      return { secondDegrees: 0, minuteDegrees: 0, hourDegrees: 0 };
    }
  };

  const { secondDegrees, minuteDegrees, hourDegrees } = getClockHandPositions();
  const timeString = getTimeInTimezone();
  const timezoneName = getTimezoneName();
  const countryCode = getCountryCodeFromTimezone(timezone);

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6 py-10 bg-[#ffffff4d] rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
      {/* Clock Face */}
      <div className="hidden relative w-40 h-40 rounded-full bg-white shadow-md border-4 border-blue-200">
        {/* Hour markers with numbers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x = 50 + 35 * Math.sin(angle);
          const y = 50 - 35 * Math.cos(angle);
          const number = i === 0 ? 12 : i;
          return (
            <div
              key={i}
              className="absolute text-xs font-bold text-blue-600 flex items-center justify-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
              }}
            >
              {number}
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          className="absolute top-1/2 left-1/2 bg-blue-800 rounded-full"
          style={{
            width: '6px',
            height: '40px',
            marginLeft: '-3px',
            marginTop: '-40px',
            transform: `rotate(${hourDegrees}deg)`,
            transformOrigin: '3px 40px',
            transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute top-1/2 left-1/2 bg-blue-600 rounded-full"
          style={{
            width: '4px',
            height: '50px',
            marginLeft: '-2px',
            marginTop: '-50px',
            transform: `rotate(${minuteDegrees}deg)`,
            transformOrigin: '2px 50px',
            transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        />

        {/* Second hand */}
        <div
          className="absolute top-1/2 left-1/2 bg-red-500 rounded-full"
          style={{
            width: '2px',
            height: '55px',
            marginLeft: '-1px',
            marginTop: '-55px',
            transform: `rotate(${secondDegrees}deg)`,
            transformOrigin: '1px 55px',
          }}
        />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full z-10"></div>
      </div>

      {/* Digital Time Display */}
      <div className="text-[70px] font-bold text-blue-900 font-mono mb-2">
        {timeString}
      </div>

      {/* Timezone Name */}
      <div className="flex items-center text-sm text-gray-600">
        <ClockIcon size={16} className="text-blue-600" />
        <span className="font-semibold text-lg">{timezoneName}</span>
        {countryCode && (
          <img
            src={`https://flagcdn.com/w20/${countryCode}.png`}
            alt={`Flag of ${timezoneName}`}
            className="ml-2 rounded shadow-sm"
            width="30"
            height="25"
            loading="lazy" // Adiciona lazy loading para melhor performance
          />
        )}
      </div>

      {/* Timezone Label */}
      <div className="text-lg font-bold text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
        {timezone}
      </div>

      {/* Remove Button */}
      {isRemovable && (
        <button
          onClick={onRemove}
          className="hidden mt-2 px-2 py-0 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          -
        </button>
      )}
    </div>
  );
}
