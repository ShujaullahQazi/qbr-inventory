export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'portion_upper', label: 'Portion (Upper)' },
  { value: 'portion_lower', label: 'Portion (Lower)' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial_plot', label: 'Commercial Plot' },
  { value: 'shop', label: 'Shop' },
  { value: 'plaza', label: 'Plaza' },
];

export const PROPERTY_SIZES = [
  { value: '4 Marla', label: '4 Marla' },
  { value: '8 Marla', label: '8 Marla' },
  { value: '10 Marla', label: '10 Marla' },
  { value: '14 Marla', label: '14 Marla' },
  { value: '25 Marla', label: '25 Marla' },
  { value: '1 Kanal', label: '1 Kanal' },
];

export const SECTORS = [
  'G-13', 'G-13/1', 'G-13/2', 'G-13/3', 'G-13/4',
  'G-14', 'G-14/1', 'G-14/2', 'G-14/3', 'G-14/4',
  'G-15',
  'F-14', 'F-15'
].map(sector => ({ value: sector, label: sector }));
