import { GeneratorPage } from '../features/generator/components/GeneratorPage';

type GeneratorRoutePageProps = {
  initialPresetId?: string;
  onPresetPathChange: (presetId: string) => void;
};

export function GeneratorRoutePage({ initialPresetId, onPresetPathChange }: GeneratorRoutePageProps) {
  return <GeneratorPage initialPresetId={initialPresetId} onPresetChange={onPresetPathChange} />;
}
