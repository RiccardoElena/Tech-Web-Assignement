const QUERY_BASE_URL =
  'https://api.artic.edu/api/v1/artworks/search?limit=100&q=';
const IMAGE_BASE_URL = 'https://www.artic.edu/iiif/2/';
const IMAGE_SUFFIX_URL = '/full/843,/0/default.jpg';
const DEBOUNCE_DELAY = 500;

const debounce = (fn, delay = DEBOUNCE_DELAY) => {
  let timeout;

  return (...args) => {
    return new Promise((resolve) => {
      clearTimeout(timeout);

      timeout = setTimeout(async () => {
        const result = await fn(...args);
        resolve(result);
      }, delay);
    });
  };
};

const fetchRandomResult = async (query) => {
  try {
    const response = await fetch(QUERY_BASE_URL + query);

    if (response.ok) {
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        // Scegli un risultato casuale dall'array
        const randomIndex = Math.floor(Math.random() * data.data.length);
        const artwork = data.data[randomIndex];

        // Prepara l'oggetto con i dati richiesti
        return await fetchArtwork(artwork.api_link);
      }
    }
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
  return null;
};

const fetchArtwork = async (api_link) => {
  try {
    const response = await fetch(api_link);
    if (response.ok) {
      const data = await response.json();

      if (data.data && data.data.image_id) {
        return {
          url: IMAGE_BASE_URL + data.data.image_id + IMAGE_SUFFIX_URL,
          title: data.data.title,
          author: data.data.author,
        };
      }
    }
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
  return null;
};

const fetchRandomArtwork = debounce(fetchRandomResult);

export default fetchRandomArtwork;
