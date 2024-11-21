import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateHeatIndex } from "@/lib/heatIndex";
import { Thermometer, Droplets, Flame } from "lucide-react";

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  lastUpdated: string;
}

export default function WeatherCard({
  temperature,
  humidity,
  lastUpdated,
}: WeatherCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Clima Atual</CardTitle>
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
        <p className="mt-4 text-sm text-muted-foreground">
          Última atualização: {new Date(lastUpdated).toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})}
        </p>
      </CardContent>
    </Card>
  );
}
