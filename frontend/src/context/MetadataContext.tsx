import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface MetadataOption {
  value: string;
  label: string;
}

interface MetadataContextType {
  propertyTypes: MetadataOption[];
  propertySizes: MetadataOption[];
  sectors: MetadataOption[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const MetadataContext = createContext<MetadataContextType | null>(null);

/** Converts a plain string list from the API into {value, label} pairs. */
function toOptions(items: string[]): MetadataOption[] {
  return items.map((item) => ({ value: item, label: item }));
}

export function MetadataProvider({ children }: { children: React.ReactNode }) {
  const [propertyTypes, setPropertyTypes] = useState<MetadataOption[]>([]);
  const [propertySizes, setPropertySizes] = useState<MetadataOption[]>([]);
  const [sectors, setSectors] = useState<MetadataOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMetadata = async () => {
    try {
      const res = await api.get('/metadata');
      setPropertyTypes(toOptions(res.data.property_types));
      setPropertySizes(toOptions(res.data.property_sizes));
      setSectors(toOptions(res.data.sectors));
    } catch (err) {
      console.error('Failed to load metadata', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  return (
    <MetadataContext.Provider value={{ propertyTypes, propertySizes, sectors, loading, refresh: fetchMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
}

export function useMetadata() {
  const ctx = useContext(MetadataContext);
  if (!ctx) throw new Error('useMetadata must be used within MetadataProvider');
  return ctx;
}
