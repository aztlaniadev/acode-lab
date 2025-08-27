export const handleFetchError = async (response: Response, defaultMessage: string) => {
  let errorMessage = defaultMessage;
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch (e) {
    // Falhou ao parsear o JSON de erro
  }
  throw new Error(errorMessage);
};
