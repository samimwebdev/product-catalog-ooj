//C Create
// R Read
// U Update - Edit + update
// D Delete

//entry point
//product search
//Delete product
//input -> product add

//selector
const filterInput = document.querySelector('#filter')
const productListUL = document.querySelector('.collection')
const msg = document.querySelector('.msg')
const nameInput = document.querySelector('.product-name')
const priceInput = document.querySelector('.product-price')
const addBtn = document.querySelector('.add-product')
const deleteBtn = document.querySelector('.delete-product')
const form = document.querySelector('form')

// data or state
let productData = getDataFromLocalStorage()

function getDataFromLocalStorage() {
  let items = ''
  if (localStorage.getItem('productItems') === null) {
    items = []
  } else {
    items = JSON.parse(localStorage.getItem('productItems'))
  }
  return items
}
function saveDataToLocalStorage(item) {
  let items = ''
  if (localStorage.getItem('productItems') === null) {
    items = []
    items.push(item)
    localStorage.setItem('productItems', JSON.stringify(items))
  } else {
    items = JSON.parse(localStorage.getItem('productItems'))
    items.push(item)
    localStorage.setItem('productItems', JSON.stringify(items))
  }
}
function deleteItemFromLocalStorage(id) {
  const items = JSON.parse(localStorage.getItem('productItems'))
  let result = items.filter(productItem => {
    return productItem.id !== id
  })
  localStorage.setItem('productItems', JSON.stringify(result))
  if (result.length === 0) location.reload()
}
//load all event listener
function loadEventListener() {
  productListUL.addEventListener('click', modifyOrRemoveProduct)
  window.addEventListener('DOMContentLoaded', getData.bind(null, productData))
  form.addEventListener('click', addOrUpdateProduct)

  filterInput.addEventListener('keyup', filterProduct)
}
//Getting data from store and populate UI
function getData(productList) {
  productListUL.innerHTML = ''
  if (productData.length > 0) {
    showMessage()
    productList.forEach(({ id, name, price }) => {
      let li = document.createElement('li')
      li.className = 'list-group-item collection-item'
      li.id = `product-${id}`
      li.innerHTML = `<strong>${name}</strong>-<span class="price">$${price}</span>
    <i class="fas fa-pencil-alt float-end edit-product"></i>
    <i class="fas fa-trash float-end delete-product"></i>
      `
      //   li.innerHTML.style.color = "green";
      productListUL.appendChild(li)
    })
  } else {
    // showMessage(true, null);
    showMessage('Please add item to your catalogue')
  }
}
//Handling Message
function showMessage(message = '') {
  msg.textContent = message
}
//https://stackoverflow.com/questions/6449611/check-whether-a-value-is-a-number-in-javascript-or-jquery

//!(!isNaN(parseFloat(price)) && isFinite(price))
//Adding item to the productData

//data level ()
//UI level

function resetInput() {
  nameInput.value = ''
  priceInput.value = ''
}

function resetUI() {
  addBtn.style.display = 'block'
  document.querySelector('.update-product').remove()
  document.querySelector('#id').remove()
}

function addOrUpdateProduct(e) {
  if (e.target.classList.contains('add-product')) {
    addItem(e)
  } else if (e.target.classList.contains('update-product')) {
    updateProduct(e)
    //reset the input
    resetInput()
    //remove update Btn
    resetUI()
  }
}

function updateProduct(e) {
  e.preventDefault()
  const name = nameInput.value
  const price = priceInput.value
  //find the id
  const id = parseInt(e.target.previousElementSibling.value, 10)
  //update the data source
  const productWithUpdates = productData.map(product => {
    if (product.id === id) {
      //update the product
      return {
        ...product,
        name,
        price
      }
    } else {
      return product
    }
  })
  //data level update
  productData = productWithUpdates
  //UI update
  getData(productData)
}

const addItem = e => {
  const name = nameInput.value
  const price = priceInput.value
  let id
  if (productData.length === 0) {
    id = 0
  } else {
    id = productData[productData.length - 1].id + 1
  }
  if (
    name === '' ||
    price === '' ||
    !(!isNaN(parseFloat(price)) && isFinite(price))
  ) {
    alert('Please fill up valid information')
  } else {
    const data = {
      id,
      name,
      price
    }
    //adding data to data store
    productData.push(data)
    //adding Data to UI
    saveDataToLocalStorage(data)
    // productListUL.innerHTML = '';
    getData(productData)
    nameInput.value = ''
    priceInput.value = ''
  }
}

function findProduct(id) {
  return productData.find(product => product.id === id)
}

function populateEditForm(product) {
  nameInput.value = product.name
  priceInput.value = product.price

  //id element
  const idElm = `<input type="hidden" id="id" value=${product.id} /> `

  //update submit button
  const btnElm = `<button class="btn mt-3 btn-block btn-info update-product">Update</button>`

  if (document.querySelector('#id')) {
    document.querySelector('#id').setAttribute('value', product.id)
  }

  if (!document.querySelector('.update-product')) {
    document.forms[0].insertAdjacentHTML('beforeend', idElm)
    document.forms[0].insertAdjacentHTML('beforeend', btnElm)
  }
  //hide submit button
  addBtn.style.display = 'none'
}

//Delete item from the UI and store
const modifyOrRemoveProduct = e => {
  if (e.target.classList.contains('delete-product')) {
    // e.target.parentElement.remove();

    //removing target from the UI
    const target = e.target.parentElement
    e.target.parentElement.parentElement.removeChild(target)
    //removing item from the store
    //Getting id
    const id = parseInt(target.id.split('-')[1])
    let result = productData.filter(productItem => {
      return productItem.id !== id
    })
    productData = result
    deleteItemFromLocalStorage(id)
  } else if (e.target.classList.contains('edit-product')) {
    //finding the ID
    const target = e.target.parentElement
    //product-1
    //Getting id
    const id = parseInt(target.id.split('-')[1])
    //find the product
    const foundProduct = findProduct(id)
    console.log(foundProduct)
    //populate tto the UI form
    populateEditForm(foundProduct)
  }
}

//filter product
const filterProduct = e => {
  const text = e.target.value.toLowerCase()
  let productLength = 0
  document.querySelectorAll('.collection .collection-item').forEach(item => {
    const productName = item.firstElementChild.textContent.toLowerCase()
    if (productName.indexOf(text) === -1) {
      item.style.display = 'none'
    } else {
      item.style.display = 'block'
      ++productLength
    }
  })
  productLength > 0 ? showMessage() : showMessage('No item found')
}

loadEventListener()
