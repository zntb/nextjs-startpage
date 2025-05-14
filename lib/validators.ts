export function isValidHttpUrl(str: string) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateLinkData(
  categoryId: string,
  title: string,
  url: string,
): {
  success: boolean;
  errors: { [key: string]: string | null };
  message: string;
} {
  const errors: { [key: string]: string | null } = {};

  if (!categoryId) errors.categoryId = 'Category ID is required.';
  if (!title) errors.title = 'Title is required.';
  else if (title.length < 3)
    errors.title = 'Title must be at least 3 characters long.';
  if (!url) errors.url = 'URL is required.';
  else if (!isValidHttpUrl(url)) errors.url = 'Invalid URL.';

  const success = Object.keys(errors).length === 0;
  return {
    success,
    errors,
    message: success ? 'Validation succeeded.' : 'Validation failed.',
  };
}
