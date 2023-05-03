/**
 *
 * MAPPERS logic
 */

/**
 *
 * @param {object} data
 * @param {string} data.display_name
 * @param {string} data.list_name
 * @param {string} data.list_name_encoded
 * @param {string} data.newest_published_date
 * @param {string} data.oldest_published_date
 * @param {string} data.updated
 */
const mapListToCard = (data) => ({
  title: data.display_name,
  info1: data.newest_published_date,
  info2: data.oldest_published_date,
  info3: data.updated,
  ...data,
});

/**
 * @param {object} data
 * @param {string} data.title
 * @param {string} data.weeks_on_list
 * @param {string} data.author
 * @param {string} data.price
 */
const mapBookToCard = (data) => ({
  title: data.title,
  info1: data.author,
  info2: data.price,
  info3: data.weeks_on_list,
});

/**
 * LocalStorage Logic
 */
const NY_BOOKS_LIST_KEY = "nyBooksLists";
const NY_API_KEY = "x8fyh0YS0ywJLWlUMIDezhd4H8pFCcGX";

// Recuperamos las listas de libros desde la base de datos del navegador o localStorage
const getNyLists = () => {
  const response = window.localStorage.getItem(NY_BOOKS_LIST_KEY);
  return response ? JSON.parse(response) : [];
};

// Guardamos las listas de libros en la base de datos del navegador o localStorage
const setNyLists = (booksLists) => {
  window.localStorage.setItem(NY_BOOKS_LIST_KEY, JSON.stringify(booksLists));
};

const getFavBooks = () => {
  const key = `user-favs-${window.localStorage.getItem('user')}`
  const response = window.localStorage.getItem(key);
  return response ? JSON.parse(response) : [];
};

const setFavBooks = (favBooksList) => {
  const key = `user-favs-${window.localStorage.getItem('user')}`
  window.localStorage.setItem(key, JSON.stringify(favBooksList));
};

/**
 * DOM LOGIC
 */

const containerDivElement = document.querySelector(".container");
const booksDivElement = document.querySelector(".books");
const spinnerDivElement = document.querySelector(".spinner");

/**
 * Este método crea un elemento p y añade el texto que recibe
 * @param {string} text
 */
const createInfoElement = (text) => {
  const newInfoElement = document.createElement("p");
  newInfoElement.setAttribute("class", "info");
  newInfoElement.innerText = text;

  return newInfoElement;
};

/**
 * @param {string} title
 * @return {void}
 */
function addFavoriteBookToFirestore(title) {
  const currentFavBooks = getFavBooks()
  const exists = currentFavBooks.find(item => item === title)

  if (!exists) {
    setFavBooks([...currentFavBooks, title])
  } else {
    setFavBooks(currentFavBooks.filter((item) => item !== title))
  }

  window.location.reload()
}

/**
 * @param {object} data
 * @param {string} data.title
 * @param {string} data.info1
 * @param {string} data.info2
 * @param {string} data.info3
 * @param {string} data.list_name_encoded
 * @param {boolean} isDetails
 */
const createCardElement = (data, isDetails = false) => {
  const newCardElement = document.createElement("div");
  newCardElement.setAttribute("class", "card");

  const newTitleElement = document.createElement("p");
  newTitleElement.setAttribute("class", "title");
  newTitleElement.innerText = data.title;

  if (isDetails) {
    const currentFavBooks = getFavBooks()
    const isFav = currentFavBooks.find(title => title === data.title)
    // Agregar icono de corazón
    const heartIcon = document.createElement("div");
    heartIcon.classList.add(isFav ? "heart-icon-selected" : "heart-icon");
    newTitleElement.appendChild(heartIcon);

    heartIcon.addEventListener("click",  () => {
       addFavoriteBookToFirestore(data.title);
    });
  }

  const newCardContentElement = document.createElement("div");
  newCardContentElement.setAttribute("class", "cardContent");

  const newestPublishedDate = createInfoElement(data.info1);
  const oldestPublishedDate = createInfoElement(data.info2);
  const updated = createInfoElement(data.info3);
  newCardContentElement.append(
    newestPublishedDate,
    oldestPublishedDate,
    updated
  );

  if (!isDetails) {
    const buttonElem = document.createElement("button");
    buttonElem.innerText = "Detalles";
    buttonElem.setAttribute("class", "detailsButton");

    buttonElem.onclick = async () => {
      await getListDetails(data.list_name_encoded);
    };
    newCardContentElement.appendChild(buttonElem);
  }

  newCardElement.append(newTitleElement, newCardContentElement);

  if (!isDetails) {
    containerDivElement.appendChild(newCardElement);
  } else {
    booksDivElement.appendChild(newCardElement);
  }
};

/**
 * Fetch Logic
 */

/**
 * @param {string} listName
 * @return {Promise<void>}
 */
async function getListDetails(listName) {
  const response = await fetch(
    `https://api.nytimes.com/svc/books/v3/lists/current/${listName}.json?api-key=${NY_API_KEY}`
  );
  const data = await response.json();
  const books = data.results.books;
  booksDivElement.setAttribute("class", "books");
  containerDivElement.setAttribute("class", "disabled");
  for (const book of books) {
    createCardElement(mapBookToCard(book), true);
  }
}

async function startApp() {
  let booksLists = getNyLists();

  if (!booksLists || booksLists.length <= 0) {
    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${NY_API_KEY}`
    );
    const data = await response.json();
    booksLists = data.results;
    setNyLists(booksLists);
  }

  for (const list of booksLists) {
    createCardElement(mapListToCard(list));
  }
  containerDivElement.setAttribute("class", "container");
  spinnerDivElement.setAttribute("class", "disabled");
}

startApp();
