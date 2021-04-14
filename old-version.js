//selector
const filterInput = document.querySelector('#filter')
const productListUL = document.querySelector('.collection')
const msg = document.querySelector('.msg')
const nameInput = document.querySelector('.product-name')
const priceInput = document.querySelector('.product-price')
const addBtn = document.querySelector('.add-product')
const deleteBtn = document.querySelector('.delete-product')

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
  let result = items.filter((productItem) => {
    return productItem.id !== id
  })
  localStorage.setItem('productItems', JSON.stringify(result))
  if (result.length === 0) location.reload()
}
//load all event listener
function loadEventListener() {
  productListUL.addEventListener('click', ModifyOrRemoveProduct)
  window.addEventListener('DOMContentLoaded', getData.bind(null, productData))
  addBtn.addEventListener('click', addItem)

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
    <i class="fa fa-trash float-right delete-product"></i>
    <i class="fa fa-pencil-alt float-right edit-product"></i>
      `
      productListUL.appendChild(li)
    })
  } else {
    // showMessage(true, null);
    showMessage('please add item to your catalog')
  }
}

//Handeling Message
function showMessage(message = '') {
  msg.textContent = message
}

function validateInput(name, price) {
  return (
    name !== '' && price !== '' && !isNaN(parseFloat(price)) && isFinite(price)
  )
}
//https://stackoverflow.com/questions/6449611/check-whether-a-value-is-a-number-in-javascript-or-jquery
//!(!isNaN(parseFloat(price)) && isFinite(price))
//Adding item to the productData
const addItem = (e) => {
  e.preventDefault()
  const name = nameInput.value
  const price = priceInput.value
  let id
  if (productData.length === 0) {
    id = 0
  } else {
    id = productData[productData.length - 1].id + 1
  }
  const isInputOk = validateInput(name, price)
  console.log(isInputOk)
  if (!isInputOk) {
    alert('please fill up necessary and valid information')
    return
  }
  const data = {
    id,
    name,
    price
  }
  productData.push(data)
  saveDataToLocalStorage(data)
  // productListUL.innerHTML = '';
  getData(productData)
  nameInput.value = ''
  priceInput.value = ''
}
//Delete item from the UI and store
const ModifyOrRemoveProduct = (e) => {
  //getting thr targeted product li
  const target = e.target.parentElement

  //Getting id
  const id = parseInt(target.id.split('-')[1])

  if (e.target.classList.contains('delete-product')) {
    // e.target.parentElement.remove();

    //removing target from the UI
    e.target.parentElement.parentElement.removeChild(target)
    //removing item from the store

    let result = productData.filter((productItem) => {
      return productItem.id !== id
    })
    productData = result
    deleteItemFromLocalStorage(id)
  } else if (e.target.classList.contains('edit-product')) {
    console.log('you want to edit the' + id + 'product')
    //i have to select the item to edit
    const foundProduct = findProduct(id)
    //populate the item into existing it's own
    populateEditItem(foundProduct)
    //update Product
    updateProductItem(foundProduct.id)
  }
}
function findProduct(id) {
  const foundProduct = productData.find((productItem) => productItem.id === id)
  if (!foundProduct) {
    alert('You product is not Found')
    return
  }

  return foundProduct
}

function populateEditItem(foundProduct) {
  nameInput.value = foundProduct.name
  priceInput.value = foundProduct.price
  addBtn.style.display = 'none'
  const updateBtn =
    "<button type='submit' class='btn btn-block btn-info update-product text-center'>update</button>"
  document.querySelector('form').insertAdjacentHTML('beforeend', updateBtn)
  document.querySelector('.edit-product').style.display = 'none'
}

function updateProductItem(id) {
  document.querySelector('.update-product').addEventListener('click', (e) => {
    e.preventDefault()
    //get the input
    console.log(nameInput.value, priceInput.value, id)
    debugger
    //validate the input
    const isInputOk = validateInput(nameInput.value, priceInput.value)
    console.log(isInputOk)
    if (isInputOk) {
      //update the item
      productData = productData.map((productItem) => {
        if (productItem.id === id) {
          return {
            ...productItem,
            name: nameInput.value,
            price: priceInput.value
          }
        } else {
          return productItem
        }
      })
    } else {
      alert('please fill up necessary and valid information')
    }

    //add the updated data to the UI
    getData(productData)
    //clear the
    nameInput.value = ''
    priceInput.value = ''
    addBtn.style.display = 'block'
    document.querySelector('.update-product').remove()
    //save updated array to localStorage
    console.log(productData)
    localStorage.setItem('productItems', JSON.stringify(productData))

    console.log('You are submitting the form')
  })
}

//filter product
const filterProduct = (e) => {
  const text = e.target.value.toLowerCase()
  let itemLength = 0
  document.querySelectorAll('.collection .collection-item').forEach((item) => {
    const productName = item.firstElementChild.textContent.toLowerCase()
    if (productName.indexOf(text) === -1) {
      item.style.display = 'none'
    } else {
      item.style.display = 'block'
      ++itemLength
    }
  })
  itemLength > 0 ? showMessage() : showMessage('No item found')
}

loadEventListener()
