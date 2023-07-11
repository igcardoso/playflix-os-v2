var API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
var BASE_URL = 'https://api.themoviedb.org/3';
var API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY + '&language=pt-BR&page=1';
var VOTE_AVERAGE = BASE_URL + '/discover/movie?sort_by=vote_average.desc&' + API_KEY + '&language=pt-BR&page=1';
var ANIMATIONS = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY + '&language=pt-BR&with_genres=16&page=1';
var today = new Date().toISOString().split('T')[0];
var API_URL_DESTAQUES = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY + '&language=pt-BR&page=1&release_date.lte=' + today;

var IMG_URL = 'https://image.tmdb.org/t/p/w500';
var IMG_URL_PROMINENCE = 'https://image.tmdb.org/t/p/original';
var searchURL = BASE_URL + '/search/movie?' + API_KEY + '&language=pt-BR';


const genres = [{
  "id": 28,
  "name": "Ação"
},
  {
    "id": 12,
    "name": "Aventura"
  },
  {
    "id": 16,
    "name": "Animação"
  },
  {
    "id": 35,
    "name": "Comédia"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentário"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Família"
  },
  {
    "id": 14,
    "name": "Fantasia"
  },
  {
    "id": 36,
    "name": "História"
  },
  {
    "id": 27,
    "name": "Terror"
  },
  {
    "id": 10402,
    "name": "Música"
  },
  {
    "id": 9648,
    "name": "Mistério"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Ficção Científica"
  },
  {
    "id": 10770,
    "name": "Filme de TV"
  },
  {
    "id": 53,
    "name": "Suspense"
  },
  {
    "id": 10752,
    "name": "Guerra"
  },
  {
    "id": 37,
    "name": "Faroeste"
  }];

const carousel = $('.owl-carousel');
const searchForm = $('#search-form');
const searchInput = $('#search-input');
const searchResults = $('#search-results');
const backButton = $('#back-button');

// Função para obter filmes e atualizar o carrossel
function getMoviesForCarousel(url, carousel) {
  fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.results.length !== 0) {
      updateCarousel(data.results, carousel);
    }
  });
}

// Função para atualizar o carrossel com filmes
function updateCarousel(movies, carousel) {
  carousel.empty();

  movies.forEach(movie => {
    const {
      title,
      poster_path,
      id,
      backdrop_path,
      vote_average,
      overview,
      vote_count,
      genre_ids  // Added genre_ids property
    } = movie;

    const item = $('<div>').addClass('item');

    const image = $('<img>').attr('src', IMG_URL + poster_path).attr('alt', name);
    const giving_play = $('<button class="navigable giving_play">').focus(function() {
      document.querySelector('.plataforms').classList.remove('animate');
      setTimeout(function() {
        document.querySelector('.plataforms').classList.add('animate');
      }, 1000);
      $('#body').css({
        background: `url(${IMG_URL_PROMINENCE + backdrop_path}), no-repeat center`, backgroundSize: 'cover'
      });
      $('.title_movie').text(title);
      $('.overview').text(overview.substring(0, 200) + "...");
      $('.popularity').text(vote_average + "%");

      const genreNames = genre_ids.map(genreId => {
        const genreObj = genres.find(genre => genre.id === genreId);
        return genreObj ? genreObj.name: "";
      });

      $('.generes').text(genreNames.join(" | "));
      async function exibirPlataformaStreaming(filmeId) {
        const detalhesUrl = `${BASE_URL}/movie/${filmeId}?${API_KEY}`;

        try {
          const response = await fetch(detalhesUrl);
          const data = await response.json();

          const plataformas = data.production_companies.map(company => company.name);

          $('.platFText').text(plataformas[0]);

        } catch (error) {
          console.error('Ocorreu um erro:', error);
        }
      }

      exibirPlataformaStreaming(id);

      /*var DateId = id;
      var url = "html/film_session.html";
      url += "?DateId=" + encodeURIComponent(DateId);
      window.location.href = url;*/
    });


    const elementos = document.getElementsByClassName('navigable-element');
    const elementosItem = $('.giving_play');
    const elementosNav = document.getElementsByClassName('nav-element');
    let indiceAtualCarrossel = 0;
    let indiceAtualCarrossel_Item = 0;
    let indiceAtual = 0;

    document.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowUp') {
        if (document.querySelector('header').classList.contains('active')) {
          indiceAtual = (indiceAtual - 1 + elementosNav.length) % elementosNav.length;
          elementosNav[indiceAtual].focus();
        } else {
          indiceAtualCarrossel = (indiceAtualCarrossel - 1 + elementos.length) % elementos.length;
          elementos[indiceAtualCarrossel].focus();
        }
      } else if (event.key === 'ArrowDown') {
        if (document.querySelector('header').classList.contains('active')) {
          indiceAtual = (indiceAtual + 1) % elementosNav.length;
          elementosNav[indiceAtual].focus();
        } else {
          indiceAtualCarrossel = (indiceAtualCarrossel + 1) % elementos.length;
          elementos[indiceAtualCarrossel].focus();
        }
      } else if (event.key === 'ArrowRight') {
        if (document.querySelector('header').classList.contains('active')) {
          document.querySelector('header').classList.remove('active')
        } else {
          indiceAtualCarrossel_Item = (indiceAtualCarrossel_Item + 1) % elementosItem.length;
          elementosItem[indiceAtualCarrossel_Item].focus();
        }
      } else if (event.key === 'ArrowLeft') {
        if (!document.querySelector('header').classList.contains('active')) {
          document.querySelector('header').classList.add('active');
        }
      }
    });

    elementos[0].focus();
    elementosNav[0].focus();


    item.append(image);
    item.append(giving_play);
    carousel.append(item);
  });

  // Inicializar o Owl Carousel
  carousel.owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    navText: [`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Arrow / Chevron_Left">
      <path id="Vector" d="M15 19L8 12L15 5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
      `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Arrow / Chevron_Right">
      <path id="Vector" d="M9 5L16 12L9 19" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`],
    responsive: {
      0: {
        items: 2
      },
      480: {
        items: 3
      },
      600: {
        items: 4
      },
      780: {
        items: 4
      },
      1000: {
        items: 5
      }
    }
  });
}
/*
function getMoviesForProminence(url, carousel) {
  fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.results.length !== 0) {
      updateProminence(data.results, carousel);
    }
  });
}

// Função para atualizar o carrossel com filmes
function updateProminence(movies, carousel) {
  carousel.empty();
  console.log(movies)
  movies.forEach(movie => {
    const {
      title,
      poster_path,
      id,
      overview,
      release_date,
      vote_average,
      popularity,
      backdrop_path,
      vote_count
    } = movie;

  });


}

*/
// Função para mostrar destaques
function showHighlights() {
  getMoviesForCarousel(API_URL + '&page=1',
    $('.owl-carousel:eq(0)'));
  getMoviesForCarousel(ANIMATIONS + '&page=1',
    $('.owl-carousel:eq(1)'));
  getMoviesForCarousel(API_URL + '&page=2',
    $('.owl-carousel:eq(2)'));
}

// Chamar a função para mostrar os destaques
showHighlights();
/*
getMoviesForProminence(API_URL_DESTAQUES + '&page=1', $('#destaques'));
getMoviesForProminence(API_URL_DESTAQUES + '&page=2', $('#destaques_1'));*/