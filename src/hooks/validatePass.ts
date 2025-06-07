export const validatePass = [
  {
    test: (val: string) => val.length >= 8,
    label: 'At least 8 characters',
    key: 'length',
  },
  {
    test: (val: string) => /[A-Z]/.test(val),
    label: 'At least one uppercase letter',
    key: 'uppercase',
  },
  {
    test: (val: string) => /[a-z]/.test(val),
    label: 'At least one lowercase letter',
    key: 'lowercase',
  },
  {
    test: (val: string) => /[0-9]/.test(val),
    label: 'At least one number',
    key: 'number',
  },
  {
    test: (val: string) => /[^A-Za-z0-9]/.test(val),
    label: 'At least one special character',
    key: 'special',
  },
];
