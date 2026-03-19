import { useState } from 'react';
import { useMetadata } from '../context/MetadataContext';
import { adminAPI } from '../services/api';

type MetadataKey = 'property_types' | 'property_sizes' | 'sectors';

interface Section {
  key: MetadataKey;
  label: string;
  icon: string;
  contextKey: 'propertyTypes' | 'propertySizes' | 'sectors';
}

const SECTIONS: Section[] = [
  { key: 'property_types', label: 'Property Types', icon: '🏠', contextKey: 'propertyTypes' },
  { key: 'property_sizes', label: 'Property Sizes', icon: '📐', contextKey: 'propertySizes' },
  { key: 'sectors',        label: 'Sectors',         icon: '📍', contextKey: 'sectors' },
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
      await adminAPI.updateMetadata({
        property_types: lists.property_types,
        property_sizes: lists.property_sizes,
        sectors: lists.sectors,
      });
      await refresh(); // Force MetadataContext to re-fetch (cache cleared by backend)
      setSaved(true);
    } catch (err) {
      console.error('Failed to save metadata', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-settings">
      {SECTIONS.map(({ key, label, icon }) => (
        <div key={key} className="glass-card admin-settings-section">
          <div className="admin-settings-header">
            <span>{icon} {label}</span>
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
        {saved && <span className="admin-settings-saved">✓ Saved successfully</span>}
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : '💾 Save All Changes'}
        </button>
      </div>
    </div>
  );
}
