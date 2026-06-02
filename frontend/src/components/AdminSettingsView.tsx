import { useState, useEffect } from 'react';
import { useMetadata } from '../context/MetadataContext';
import { adminAPI } from '../services/api';
import { HomeIcon, AreaIcon, MapPinIcon, CheckIcon, AlertCircleIcon } from './Icons';

type MetadataKey = 'property_types' | 'property_sizes' | 'sectors';

interface Section {
  key: MetadataKey;
  label: string;
  contextKey: 'propertyTypes' | 'propertySizes' | 'sectors';
}

const SECTIONS: Section[] = [
  { key: 'property_types', label: 'Property Types', contextKey: 'propertyTypes' },
  { key: 'property_sizes', label: 'Property Sizes', contextKey: 'propertySizes' },
  { key: 'sectors',        label: 'Sectors',         contextKey: 'sectors' },
];

export default function AdminSettingsView() {
  const { propertyTypes, propertySizes, sectors, refresh } = useMetadata();

  // Each section gets its own local edit state (array of strings)
  const sourceMap: Record<MetadataKey, string[]> = {
    property_types: propertyTypes.map((o) => o.value),
    property_sizes: propertySizes.map((o) => o.value),
    sectors:        sectors.map((o) => o.value),
  };

  const [lists, setLists] = useState<Record<MetadataKey, string[]>>(sourceMap);
  const [inputs, setInputs] = useState<Record<MetadataKey, string>>({
    property_types: '',
    property_sizes: '',
    sectors: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Keep local state in sync when metadata context refreshes
  useEffect(() => {
    setLists({
      property_types: propertyTypes.map((o) => o.value),
      property_sizes: propertySizes.map((o) => o.value),
      sectors: sectors.map((o) => o.value),
    });
  }, [propertyTypes, propertySizes, sectors]);

  const addItem = (key: MetadataKey) => {
    const val = inputs[key].trim();
    if (!val || lists[key].includes(val)) return;
    setLists((prev) => ({ ...prev, [key]: [...prev[key], val] }));
    setInputs((prev) => ({ ...prev, [key]: '' }));
    setSaved(false);
  };

  const removeItem = (key: MetadataKey, item: string) => {
    setLists((prev) => ({ ...prev, [key]: prev[key].filter((v) => v !== item) }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await adminAPI.updateMetadata({
        property_types: lists.property_types,
        property_sizes: lists.property_sizes,
        sectors: lists.sectors,
      });
      await refresh();
      setSaved(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save metadata';
      setError(message);
      console.error('Failed to save metadata', err);
    } finally {
      setSaving(false);
    }
  };

  const renderIcon = (key: MetadataKey) => {
    switch (key) {
      case 'property_types': return <HomeIcon size={16} stroke="currentColor" />;
      case 'property_sizes': return <AreaIcon size={16} stroke="currentColor" />;
      case 'sectors': return <MapPinIcon size={16} stroke="currentColor" />;
    }
  };

  return (
    <div className="admin-settings">
      {SECTIONS.map(({ key, label }) => (
        <div key={key} className="glass-card admin-settings-section">
          <div className="admin-settings-header">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {renderIcon(key)} {label}
            </span>
            <span className="admin-settings-count">{lists[key].length} items</span>
          </div>

          {/* Tags list */}
          <div className="admin-settings-tags">
            {lists[key].map((item) => (
              <span key={item} className="admin-tag">
                {item}
                <button
                  className="admin-tag-remove"
                  onClick={() => removeItem(key, item)}
                  aria-label={`Remove ${item}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add new item */}
          <div className="admin-settings-add">
            <input
              className="form-input"
              type="text"
              placeholder={`Add new ${label.slice(0, -1).toLowerCase()}…`}
              value={inputs[key]}
              onChange={(e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addItem(key)}
            />
            <button className="btn btn-primary btn-sm" onClick={() => addItem(key)}>
              + Add
            </button>
          </div>
        </div>
      ))}

      <div className="admin-settings-footer">
        {saved && (
          <span className="admin-settings-saved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckIcon size={14} stroke="currentColor" /> Saved successfully
          </span>
        )}
        {error && (
          <span className="admin-settings-error" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircleIcon size={14} stroke="currentColor" /> {error}
          </span>
        )}
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          {saving ? 'Saving…' : <><CheckIcon size={16} stroke="currentColor" /> Save All Changes</>}
        </button>
      </div>
    </div>
  );
}
