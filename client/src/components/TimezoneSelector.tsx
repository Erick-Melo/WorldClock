import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface TimezoneSelectorProps {
  onAddTimezone: (timezone: string) => void;
  maxClocks: number;
  currentCount: number;
}

// Common timezones organized by region
const TIMEZONES = [
  // Americas
  { label: 'Miami (EST)', value: 'America/New_York' },
  { label: 'Los Angeles (PST)', value: 'America/Los_Angeles' },
  { label: 'Chicago (CST)', value: 'America/Chicago' },
  { label: 'Denver (MST)', value: 'America/Denver' },
  { label: 'Toronto (EST)', value: 'America/Toronto' },
  { label: 'México (CST)', value: 'America/Mexico_City' },
  { label: 'São Paulo (BRT)', value: 'America/Sao_Paulo' },
  { label: 'Buenos Aires (ART)', value: 'America/Argentina/Buenos_Aires' },
  { label: 'Anchorage (AKST)', value: 'America/Anchorage' },
  { label: 'Honolulu (HST)', value: 'Pacific/Honolulu' },

  // Europe
  { label: 'Londres (GMT)', value: 'Europe/London' },
  { label: 'Paris (CET)', value: 'Europe/Paris' },
  { label: 'Berlim (CET)', value: 'Europe/Berlin' },
  { label: 'Madri (CET)', value: 'Europe/Madrid' },
  { label: 'Roma (CET)', value: 'Europe/Rome' },
  { label: 'Moscou (MSK)', value: 'Europe/Moscow' },
  { label: 'Estambul (EET)', value: 'Europe/Istanbul' },
  { label: 'Atenas (EET)', value: 'Europe/Athens' },
  { label: 'Dublin (GMT)', value: 'Europe/Dublin' },

  // Asia
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Bangalore (IST)', value: 'Asia/Kolkata' },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
  { label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong' },
  { label: 'Singapura (SGT)', value: 'Asia/Singapore' },
  { label: 'Tóquio (JST)', value: 'Asia/Tokyo' },
  { label: 'Seul (KST)', value: 'Asia/Seoul' },
  { label: 'Pequim (CST)', value: 'Asia/Shanghai' },
  { label: 'Bancoque (ICT)', value: 'Asia/Bangkok' },
  { label: 'Manila (PHT)', value: 'Asia/Manila' },

  // Oceania
  { label: 'Sydney (AEDT)', value: 'Australia/Sydney' },
  { label: 'Melbourne (AEDT)', value: 'Australia/Melbourne' },
  { label: 'Perth (AWST)', value: 'Australia/Perth' },
  { label: 'Auckland (NZDT)', value: 'Pacific/Auckland' },
  { label: 'Fiji (FJT)', value: 'Pacific/Fiji' },

  // Africa
  { label: 'Cairo (EET)', value: 'Africa/Cairo' },
  { label: 'Joanesburgo (SAST)', value: 'Africa/Johannesburg' },
  { label: 'Lagos (WAT)', value: 'Africa/Lagos' },
  { label: 'Nairobi (EAT)', value: 'Africa/Nairobi' },
];

export default function TimezoneSelector({
  onAddTimezone,
  maxClocks,
  currentCount,
}: TimezoneSelectorProps) {
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const isDisabled = currentCount >= maxClocks;

  const handleAddTimezone = () => {
    if (!isDisabled) {
      onAddTimezone(selectedTimezone);
      setSelectedTimezone('America/New_York');
    }
  };

  return (
    <div className="hidden f lex flex-col gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">Adicionar Relógio</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione um fuso horário" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAddTimezone}
          disabled={isDisabled}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Plus size={18} />
          Adicionar
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        <span className="font-semibold">{currentCount}</span> de{' '}
        <span className="font-semibold">{maxClocks}</span> relógios adicionados
      </div>

      {isDisabled && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
          ⚠️ Limite máximo de {maxClocks} relógios atingido. Remova um relógio para adicionar outro.
        </div>
      )}
    </div>
  );
}
