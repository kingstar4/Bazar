// Utility functions for validating email and phone number

export const credibleDomains = [
  'gmail.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'zoho.com', 'protonmail.com', 'mail.com', 'gmx.com',
];

export function isCredibleEmail(email: string): boolean {
  const emailRegex = new RegExp(
    `^[A-Za-z0-9._%+-]+@(?:${credibleDomains.join('|').replace(/\./g, '.')})$`,
    'i'
  );
  return emailRegex.test(email);
}

export function filterDigitsOnly(input: string): string {
  return input.replace(/[^0-9]/g, '');
}
