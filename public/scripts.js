$(document).ready(() => {

  $('.add_item_form').on('submit', createNewItem)
  $('.list').on('click', '.packed_check', updatePackedStatus);
  
  function appendItem(name, packed, id) {
    let packedCheckBox

    if (packed) {
      packedCheckBox = `<input class='packed_check' type="checkbox" checked>`
    } else {
      packedCheckBox = `<input class='packed_check' type="checkbox">`
    }

    $('.list').append(`
    <div class='list_item' id=${id}>
        <h2 class='item_name'>${name}</h2>
        <button class='item_delete'>Delete</button>
        <br>
        ${packedCheckBox}
        <span>Packed</span>
      </div>`)
  }

  function createNewItem(e) {
    e.preventDefault()
    const name = $('#item_input').val()
    
    return fetch('/api/v1/items', {
      body: JSON.stringify({name}),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    })
    .then(response => response.json())
    .then(id => {
      appendItem(name, false, id)
      $('#item_input').val('')
    })
  }

  function getAllItems() {
    return fetch('/api/v1/items')
      .then(response => response.json())
      .then(items => {
        items.forEach(item => {
          appendItem(item.name, item.packed, item.id)
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  function updatePackedStatus() {
    const id = $(this).parent().attr('id');
    const packed = $(this).is(':checked');

    return fetch(`/api/v1/items/${id}`, {
      body: JSON.stringify({ packed }),
      headers: {
        'content-type': 'application/json'
      },
      method: 'PATCH'
    })
  }

  getAllItems()
})
