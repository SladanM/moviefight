const autoCompleteConfig = {
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '5a3b8379',
        s: searchTerm,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
  // ITEM RENDER STRUCTURE
  renderOption(item) {
    const imgSRC = item.Poster === 'N/A' ? '' : item.Poster;
    return `
    <img src="${imgSRC}" />
    ${item.Title} (${item.Year})
    `;
  },
  inputValue(item) {
    return item.Title;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  // ONOPTION IS ONMOVIE FUNCTION
  onOptionSelect(item) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(item, document.querySelector('#left-summary'), 'left');
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  // ONOPTION IS ONMOVIE FUNCTION
  onOptionSelect(item) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(item, document.querySelector('#right-summary'), 'right');
  },
});

// MOVIE CLICKED
let leftMovie;
let rightMovie;
const onMovieSelect = async (item, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '5a3b8379',
      i: item.imdbID,
    },
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {};

// MOVIE ITEM STRUCTURE
const movieTemplate = (item) => {
  const metaScore = parseInt(item.Metascore);
  const imdb = parseFloat(item.imdbRating);
  const votes = parseInt(item.imdbVotes.replace(/,/g, ''));
  const awards = item.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${item.Poster}"/>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${item.Title}</h1>
        <h4>${item.Genre}</h4>
        <p>${item.Plot}</p>
      </div>
    </div>
  </article>
  
  <article data-value=${awards} class="notification is-primary">
    <p class="title">${item.Awards}</p>
      <p class="subtitle">Awards</p>
  </article>

  <article class="notification is-primary">
    <p class="title">${item.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
  </article>

  <article data-value=${metaScore} class="notification is-primary">
    <p class="title">${item.Metascore}</p>
      <p class="subtitle">Metascore</p>
  </article>

  <article data-value=${imdb} class="notification is-primary">
    <p class="title">${item.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
  </article>

  <article data-value=${votes} class="notification is-primary">
    <p class="title">${item.imdbVotes}</p>
      <p class="subtitle">IMBD Votes</p>
  </article>
  `;
};
