document.addEventListener("DOMContentLoaded", function() {
  getBooks()
});

const booksURL = 'http://localhost:3000/books'
const bookList = document.getElementById("list")

function getBooks() {
  fetch('http://localhost:3000/books')
  .then(resp => resp.json())
  //.then(resp => console.log('resp',resp))
  //for each book in the array, pass it addBookToDom function
  .then(books => books.forEach(book => addBookToDom(book)))  
}

function addBookToDom(book){
  let listUL = document.querySelector("#list")
  let li = document.createElement('li')
  li.id = `book-id-${book.id}`
  li.textContent = book.title
  li.addEventListener('click', (e) => showBookDetails(e, book))
  listUL.append(li)
}

function showBookDetails(e, book) {
  e.preventDefault()
  //thumbnail, description, and a list of users who have liked the book  
  let showPanel = document.querySelector("#show-panel")
  //before we add to the dom, clear it out
  showPanel.innerHTML = ''
  let image = document.createElement('img')
  image.src = book.img_url
  let titleH1 = document.createElement('h1')
  titleH1.textContent = book.title

  let descP = document.createElement('p')
  descP.textContent = book.description

  let userUL = document.createElement('ul')
  userUL.id = 'users-list'

  const myUser = {"id": 1, "username": "pouros"}

  
  let likeButton = document.createElement('button')
  likeButton.innerText = "👍 like"


  book.users.forEach(user => {
    const userLI = document.createElement('li')
    userLI.textContent = user.username 
    userUL.append(userLI)


  })
  showPanel.append(image, titleH1, descP, userUL, likeButton)

  //event listener for like button
  likeButton.addEventListener('click', (event) => {
    book.users.push(myUser)

    fetch(`${booksURL}/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        users: book.users
      })
    })
    .then(resp => resp.json())
    .then((updatedBook) => {
      book.users = updatedBook.users
      let newUserLi = document.createElement('li')
      newUserLi.innerText = myUser.username
      userUL.append(newUserLi)
    })
  })
  }

