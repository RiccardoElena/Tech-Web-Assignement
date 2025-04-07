import fetchRandomArtwork from './api.js';

const inputField = document.getElementById('keywords');
const submitButton = document.getElementById('new_artwork');
const imgCanvas = document.getElementById('artwork_image');
const titleDisplay = document.getElementById('artwork_title');
const authorDisplay = document.getElementById('artwork_artist');

const renderRandomArtworkOrDefault = (artwork) => {
  const placeHolder = {
    url: './no_image_placeholder.png',
    title: 'No image has been found with this query',
    author: undefined,
  };

  const renderRandomArtwork = ({ url, title, author }) => {
    imgCanvas.setAttribute('src', url);
    titleDisplay.textContent = title;
    authorDisplay.textContent = author;
  };

  renderRandomArtwork(artwork || placeHolder);
};

const formatInputText = (text) => {
  return encodeURIComponent(text.trim());
};

const renderArtworkFromTextField = async () =>
  renderRandomArtworkOrDefault(
    await fetchRandomArtwork(formatInputText(inputField.value))
  );

inputField.addEventListener('keydown', renderArtworkFromTextField);

submitButton.addEventListener('click', renderArtworkFromTextField);

document.addEventListener('DOMContentLoaded', async () => {
  renderRandomArtworkOrDefault(await fetchRandomArtwork(''));
});
