export const PROPERTY_TYPES = [
  { value: 'plot', label: 'Plot' },
  { value: 'shop', label: 'Market Shop' },
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat / Apartment' },
  { value: 'commercial', label: 'Commercial' },
];

export const PROPERTY_SIZES = [
  { value: '3 Marla', label: '3 Marla' },
  { value: '5 Marla', label: '5 Marla' },
  { value: '7 Marla', label: '7 Marla' },
  { value: '10 Marla', label: '10 Marla' },
  { value: '1 Kanal', label: '1 Kanal' },
  { value: '2 Kanal', label: '2 Kanal' },
  { value: '4 Kanal', label: '4 Kanal' },
  { value: '8 Kanal', label: '8 Kanal' },
];

export const SECTORS = [
  'G-13', 'G-13/1', 'G-13/2', 'G-13/3', 'G-13/4',
  'G-14', 'G-14/1', 'G-14/2', 'G-14/3', 'G-14/4',
  'G-15', 'G-16',
  'I-14', 'I-15', 'I-16',
  'D-12', 'E-11', 'F-17', 'B-17'
].map(sector => ({ value: sector, label: sector }));
