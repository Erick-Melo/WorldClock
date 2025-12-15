import { useState, useEffect, useMemo } from "react";
import { APP_TITLE } from "@/const";
import Clock from "@/components/Clock";
import TimezoneSelector from "@/components/TimezoneSelector";
import { Globe } from "lucide-react";

// Componente para o floco de neve individual
const Snowflake = ({ style }: { style: React.CSSProperties }) => {
  const snowFlakeImage = `/snowflake${Math.floor(Math.random() * 4) + 1}.svg`;
  return (
    <div
      className="absolute top-[-10px] w-10 h-10 bg-contain bg-no-repeat animate-fall"
      style={{
        ...style,
        backgroundImage: `url(${snowFlakeImage})`,
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
    />
  );
};

// Componente para gerar a neve
const Snowfall = ({ count = 50 }) => {
  const snowflakes = useMemo(() =>
    Array.from({ length: count }).map((_, i) => {
      const style = {
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 3 + 8}s`,
        animationDelay: `${Math.random() * 15}s`,
        opacity: Math.random() * 0.5 + 0.3,
        transform: `scale(${Math.random() * 0.2 + 0.9})`,
      };
      return <Snowflake key={i} style={style} />;
    }), [count]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-40 overflow-hidden" style={{ willChange: 'contents' }}>
      {snowflakes}
    </div>
  );
};

const MAX_CLOCKS = 4;

export default function Home() {
  const [clocks, setClocks] = useState<string[]>([
    "America/New_York",
    "America/Recife",
    "Europe/Lisbon",
    "Europe/Berlin",
  ]);
  const [sharedTime, setSharedTime] = useState<Date>(new Date());

  const handleAddTimezone = (timezone: string) => {
    if (clocks.length < MAX_CLOCKS && !clocks.includes(timezone)) {
      setClocks([...clocks, timezone]);
    }
  };

  const handleRemoveClock = (index: number) => {
    setClocks(clocks.filter((_, i) => i !== index));
  };

  // Sincronizar relógios com intervalo de atualização
  useEffect(() => {
    const timer = setInterval(() => {
      setSharedTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(/bg-lead-natalino.png)`,
      }}
    >
      <Snowfall />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Acompanhe a hora em até 4 fusos horários diferentes
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clocks Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-${clocks.length} gap-6`}
        >
          {clocks.map((timezone, index) => (
            <Clock
              key={`${timezone}-${index}`}
              timezone={timezone}
              onRemove={() => handleRemoveClock(index)}
              isRemovable={true}
              sharedTime={sharedTime}
            />
          ))}
        </div>

        {/* Empty State */}
        {clocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Globe className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Nenhum relógio adicionado
            </h2>
            <p className="text-gray-500">
              Comece adicionando um fuso horário usando o seletor acima
            </p>
          </div>
        )}
        {/* Logo */}
        <div className="hidden justify-center mt-8">
          <img className="h-20" src="/Performance.png" alt="Logo" />
        </div>
        {/* Credits */}
        <div className="justify-center mt-8">
          <p className="text-center text-gray-700 text-sm">
            Powered by{" "}
            <a
              className="text-gray-800 font-semibold"
              href="https://github.com/erick-melo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Erick-Melo
            </a>
          </p>
        </div>
        {/* Timezone Selector */}
        <div className="mt- 8">
          <TimezoneSelector
            onAddTimezone={handleAddTimezone}
            maxClocks={MAX_CLOCKS}
            currentCount={clocks.length}
          />
        </div>
      </main>
    </div>
  );
}