//JavaScript CRUD
//userInterface (DOM)
//Data/state source
//localStorage

// C-create
// R-Read
// U-Update
// D-Delete

const storage = {
  getItems() {
    let items = ''
    if (localStorage.getItem('productItems') === null) {
      items = []
    } else {
      items = JSON.parse(localStorage.getItem('productItems'))
    }
    return items
  },
  saveItem(item) {
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
  },
  saveItems(items) {
    localStorage.setItem('productItems', JSON.stringify(items))
  },
  deleteItem(id) {
    const items = JSON.parse(localStorage.getItem('productItems'))
    let result = items.filter((productItem) => {
      return productItem.id !== id
    })
    localStorage.setItem('productItems', JSON.stringify(result))
    //If there is any input clear the input
    UI.resetInput()
    //In update state clear state
    UI.clearUpdateState()
    if (result.length === 0) location.reload()
  }
}

const UI = {
  selectors() {
    const filterInput = document.querySelector('#filter')
    const productListUL = document.querySelector('.collection')
    const msg = document.querySelector('.msg')
    const nameInput = document.querySelector('.product-name')
    const priceInput = document.querySelector('.product-price')
    const addBtn = document.querySelector('.add-product')
    const deleteBtn = document.querySelector('.delete-product')
    const formElm = document.querySelector('form')
    return {
      filterInput,
      productListUL,
      msg,
      nameInput,
      priceInput,
      addBtn,
      deleteBtn,
      formElm
    }
  },
  init() {
    const { productListUL, addBtn, filterInput } = this.selectors()
    const productData = data.getItems()
    productListUL.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-product')) {
        this.removeItem(e)
      } else if (e.target.classList.contains('edit-product')) {
        this.editItem(e)
      }
    })
    window.addEventListener('DOMContentLoaded', (e) => {
      this.addItems(productData)
    })
    addBtn.addEventListener('click', data.addItem)
    filterInput.addEventListener('keyup', this.filterProduct)
  },
  addItems(productList) {
    const { productListUL } = this.selectors()
    const { showMessage } = this
    const productData = data.getItems()
    productListUL.innerHTML = ''
    if (productData.length > 0) {
      UI.showMessage()
      productList.forEach(({ id, name, price }) => {
        let li = document.createElement('li')
        li.className = 'list-group-item collection-item'
        li.id = `product-${id}`
        li.innerHTML = `<strong>${name}</strong>-<span class="price">$${price}</span>
      <div class="float-right">
        <i class="fa fa-pencil-alt edit-product"></i>
        <i class="fa fa-trash delete-product"></i>
      </div>
      `
        productListUL.appendChild(li)
      })
    } else {
      showMessage('please add item to your catalog')
    }
  },
  getId(e) {
    const target = e.target.parentElement.parentElement
    return parseInt(target.id.split('-')[1])
  },
  updateItem(id) {
    const {
      showMessage,
      addItems,
      validateInput,
      resetInput,
      clearUpdateState
    } = this

    const { nameInput, priceInput } = this.selectors()

    const inputIsInvalid = validateInput(nameInput.value, priceInput.value)

    if (inputIsInvalid) {
      showMessage('Invalid Input Data')
    } else {
      addItems.call(this, data.updateItem(id))
      resetInput()
      clearUpdateState.call(UI)
    }
  },
  clearUpdateState() {
    const { addBtn } = this.selectors()
    this.resetInput()
    addBtn.style.display = 'block'
    /* In edit state if anyone click delete btn we are going to remove the update Product button */
    if (document.querySelector('.update-product')) {
      document.querySelector('.update-product').remove()
    }
  },

  updateState() {
    const { addBtn, nameInput, priceInput } = this.selectors()
    //Change UI element
    nameInput.value = ''
    priceInput.value = ''
    document.querySelector('update-product').remove()
    addBtn.style.display = 'block'
  },

  removeItem(e) {
    let productData = data.getItems()
    const id = UI.getId(e)
    const target = e.target.parentElement.parentElement
    e.target.parentElement.parentElement.parentElement.removeChild(target)

    productData = data.removeItem(id)
    storage.deleteItem(id)
  },
  editItem(e) {
    const id = UI.getId(e)
    const foundProduct = data.findItem(id)

    if (!foundProduct) {
      UI.showMessage('some Unknown Error occured')
    }
    this.populateInput(foundProduct.name, foundProduct.price, id)

    this.showUpdateState(e, foundProduct.id)
  },
  populateInput(name, price) {
    const { nameInput, priceInput } = this.selectors()
    nameInput.value = name
    priceInput.value = price
  },
  showUpdateState(e, id) {
    const { updateItem } = this
    const { formElm, addBtn } = this.selectors()
    let updateBtn
    //create updateBtn and input to UI
    const updateBtnElm = `<Button type='submit' class='btn btn-info update-product btn-block'>Update</Button>`
    formElm.insertAdjacentHTML('beforeend', updateBtnElm)
    //cleaning the submit Button
    addBtn.style.display = 'none'
    //hide edit button
    e.target.style.display = 'none'
    //selecting update Btn
    updateBtn = document.querySelector('.update-product')
    updateBtn.addEventListener('click', function (e) {
      e.preventDefault()
      updateItem.call(UI, id)
    })
  },
  filterProduct(e) {
    const text = e.target.value.toLowerCase()
    let itemLength = 0
    document
      .querySelectorAll('.collection .collection-item')
      .forEach((item) => {
        const productName = item.firstElementChild.textContent.toLowerCase()
        if (productName.indexOf(text) === -1) {
          item.style.display = 'none'
        } else {
          item.style.display = 'block'
          ++itemLength
        }
      })
    itemLength > 0 ? showMessage() : showMessage('No item found')
  },
  showMessage(message = '') {
    const { msg } = UI.selectors()
    msg.textContent = message
  },
  validateInput(name, price) {
    return (
      name === '' ||
      price === '' ||
      !(!isNaN(parseFloat(price)) && isFinite(price))
    )
  },
  resetInput() {
    const { nameInput, priceInput } = UI.selectors()
    nameInput.value = ''
    priceInput.value = ''
  }
}

const data = {
  getItems() {
    return storage.getItems()
  },

  findItem(id) {
    const productData = this.getItems()
    return productData.find((productItem) => productItem.id === id)
  },
  addItem(e) {
    e.preventDefault()
    const { nameInput, priceInput } = UI.selectors()
    const { addItems, resetInput, showMessage, validateInput } = UI
    const productData = data.getItems()
    const name = nameInput.value
    const price = priceInput.value

    let id
    if (productData.length === 0) {
      id = 0
    } else {
      id = productData[productData.length - 1].id + 1
    }

    const inputIsInValid = validateInput(name, price)

    if (inputIsInValid) {
      showMessage('please fill up necessary and valid information')
    } else {
      const data = {
        id,
        name,
        price
      }
      productData.push(data)
      storage.saveItem(data)
      addItems.call(UI, productData)
      resetInput()
    }
  },
  updateItem(id) {
    const { nameInput, priceInput } = UI.selectors()
    let productData = this.getItems()

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

    storage.saveItems(productData)
    return productData
  },
  removeItem(id) {
    const productData = this.getItems()

    return productData.filter((productItem) => {
      return productItem.id !== id
    })
  }
}

//initializing all event listener  and initial flushing of data from localStorage
UI.init()
