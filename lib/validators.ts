export function isValidHttpUrl(str: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)' + // protocol (mandatory)
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
  );
  return pattern.test(str);
}

export function validateLinkData(
  categoryId: string,
  title: string,
  url: string
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
