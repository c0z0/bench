export const getTheme = () => {
  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  }
  return 'light';
};

const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

export const listen = h => {
  if (window.matchMedia) {
    colorSchemeQuery.addEventListener('change', h);
  }
};

export const removeListener = h => {
  if (window.matchMedia) {
    colorSchemeQuery.removeEventListener('change', h);
  }
};

const e = { getTheme, listen, removeEventListener };

export default e;
