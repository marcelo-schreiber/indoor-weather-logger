import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateHeatIndex } from "@/lib/heatIndex";
import {
  Thermometer,
  Droplets,
  Flame,
  ArrowBigDown,
  RadiationIcon,
} from "lucide-react";

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  lastUpdated: string;
  pressure: number;
  airQuality: number;
  title: string;
}

export default function WeatherCard({
  temperature,
  humidity,
  pressure,
  airQuality,
  lastUpdated,
  title,
}: WeatherCardProps) {
  return (
    <Card className="w-full md:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-6 w-6 text-red-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Temperatura
              </p>
              <p className="text-2xl font-bold">{temperature.toFixed(2)}°C</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Umidade
              </p>
              <p className="text-2xl font-bold">{humidity.toFixed(2)}%</p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <ArrowBigDown className="h-6 w-6 text-slate-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pressão
              </p>
              <p className="text-2xl font-bold">{pressure.toFixed(2)} hPa</p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <RadiationIcon className="h-6 w-6 text-green-800" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Gases tóxicos no ar
              </p>
              <p className="text-2xl font-bold">{airQuality.toFixed(2)} ppm</p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Índice de Calor
              </p>
              <p className="text-2xl font-bold">
                {calculateHeatIndex(temperature, humidity).toFixed(2)}°C
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Última atualização:{" "}
          {new Date(lastUpdated).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
