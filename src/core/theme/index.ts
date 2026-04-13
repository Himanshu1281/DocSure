export const colors = {
  primary: '#1D9E75',
  primaryLight: '#E1F5EE',
  primaryDark: '#0F6E56',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F6F4',
  border: 'rgba(0,0,0,0.10)',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B68',
  textHint: '#9E9E9A',
  accentPurple: '#7F77DD',
  accentCoral: '#D85A30',
  accentAmber: '#BA7517',
  ratingGreen: '#27500A',
  ratingBg: '#EAF3DE',
  danger: '#E24B4A',
  info: '#185FA5',
  
  specialtyBackgrounds: {
    'General Physician': '#E1F5EE',
    'Dermatologist': '#EEEDFE',
    'Gastroenterologist': '#FAECE7',
    'Orthopedic': '#E6F1FB',
    'ENT': '#FAEEDA',
    'Pediatrician': '#FBEAF0',
    'Cardiologist': '#FCEBEB',
  },
  specialtyTexts: {
    'General Physician': '#0F6E56',
    'Dermatologist': '#3C3489',
    'Gastroenterologist': '#712B13',
    'Orthopedic': '#0C447C',
    'ENT': '#633806',
    'Pediatrician': '#72243E',
    'Cardiologist': '#791F1F',
  }
};

export const typography = {
  fontFamily: 'System', // Fallback until Inter is loaded
  h1: { fontSize: 22, fontWeight: '600' as const, color: colors.textPrimary },
  h2: { fontSize: 16, fontWeight: '500' as const, color: colors.textPrimary },
  doctorName: { fontSize: 15, fontWeight: '500' as const, color: colors.textPrimary },
  body: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  tag: { fontSize: 11, fontWeight: '500' as const },
  fee: { fontSize: 15, fontWeight: '600' as const, color: colors.textPrimary },
  feeSublabel: { fontSize: 12, fontWeight: '400' as const, color: colors.textSecondary },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  btn: 8,
  card: 12,
  pill: 20,
  round: 9999, // Avatar circles
};

export const theme = {
  colors,
  typography,
  spacing,
  radius,
};
