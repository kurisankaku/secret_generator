import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GeneratedSecret } from '../../../core/types';
import { getDefaultPreset, getPresetById } from '../../../presets/presets';
import type { SecretPreset, SecretPresetOptions } from '../../../presets/types';
import { clonePresetOptions, generateFromPreset } from '../utils/formatGeneratedSecret';

export type UseGeneratorResult = {
  selectedPreset: SecretPreset;
  options: SecretPresetOptions;
  generatedSecret: GeneratedSecret | null;
  errorMessage: string | null;
  isSecretHidden: boolean;
  selectPreset: (presetId: string) => void;
  setOption: (name: string, value: string | number | boolean) => void;
  resetOptions: () => void;
  generate: () => void;
  clear: () => void;
  setSecretHidden: (hidden: boolean) => void;
};

function getPresetOrDefault(presetId?: string): SecretPreset {
  return (presetId ? getPresetById(presetId) : undefined) ?? getDefaultPreset();
}

export function useGenerator(initialPresetId?: string): UseGeneratorResult {
  const [selectedPresetId, setSelectedPresetId] = useState(
    () => getPresetOrDefault(initialPresetId).id,
  );
  const selectedPreset = useMemo(() => getPresetOrDefault(selectedPresetId), [selectedPresetId]);
  const [options, setOptions] = useState<SecretPresetOptions>(() => clonePresetOptions(selectedPreset));
  const [generatedSecret, setGeneratedSecret] = useState<GeneratedSecret | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSecretHidden, setSecretHidden] = useState(false);

  useEffect(() => {
    const nextPreset = getPresetOrDefault(initialPresetId);

    setSelectedPresetId(nextPreset.id);
    setOptions(clonePresetOptions(nextPreset));
    setGeneratedSecret(null);
    setErrorMessage(null);
    setSecretHidden(false);
  }, [initialPresetId]);

  const selectPreset = useCallback((presetId: string) => {
    const nextPreset = getPresetOrDefault(presetId);

    setSelectedPresetId(nextPreset.id);
    setOptions(clonePresetOptions(nextPreset));
    setGeneratedSecret(null);
    setErrorMessage(null);
    setSecretHidden(false);
  }, []);

  const setOption = useCallback((name: string, value: string | number | boolean) => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      [name]: value,
    }) as SecretPresetOptions);
    setGeneratedSecret(null);
    setErrorMessage(null);
  }, []);

  const resetOptions = useCallback(() => {
    setOptions(clonePresetOptions(selectedPreset));
    setGeneratedSecret(null);
    setErrorMessage(null);
    setSecretHidden(false);
  }, [selectedPreset]);

  const clear = useCallback(() => {
    setGeneratedSecret(null);
    setErrorMessage(null);
    setSecretHidden(false);
  }, []);

  const generate = useCallback(() => {
    try {
      setGeneratedSecret(generateFromPreset(selectedPreset, options));
      setErrorMessage(null);
      setSecretHidden(false);
    } catch (error) {
      setGeneratedSecret(null);
      setErrorMessage(error instanceof Error ? error.message : 'Could not generate secret');
    }
  }, [options, selectedPreset]);

  return {
    selectedPreset,
    options,
    generatedSecret,
    errorMessage,
    isSecretHidden,
    selectPreset,
    setOption,
    resetOptions,
    generate,
    clear,
    setSecretHidden,
  };
}
