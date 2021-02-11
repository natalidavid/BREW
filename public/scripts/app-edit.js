$(() => {

  // books for edits
  // 1. when you click the edit button for a specific item
  $(document).on("click", ".edit", function(event) {
    const userURL = window.location.pathname;
    const userId = userURL.slice(1);

    $('.bubble').slideDown();  // 2. it should display instructions to move to another table

    //this is data of the item on edit them
    const $itemToEdit = $(event.target).parents('table.item');
    const data = {
        category: $itemToEdit.attr('data-type'),
        itemId: $itemToEdit.attr('data-itemId'),
        name: $itemToEdit.attr('data-name'),
        date: $itemToEdit.attr('data-date')
      };

      console.log("This is the data:", data);

    // if reading clicked , delete the item from original table
    $(".reading").click(() => {

      $itemToEdit.remove();
      console.log("DELETING item FROM list!!!!!")
      $('.bubble').slideUp();

      $.post(`/books/${userId}/edit`, data)
        .then(() => {
          console.log("Adding new item to list!!!!!")
          $('section.book-items').add($itemToEdit);
          return false;
        })
        .catch(err => {
          console.log(err)
        })


      })

      // if eating clicked
      $(".eating").click(() => {
        $itemToEdit.remove();
        $('.bubble').slideUp();

        $.post(`/restaurants/${userId}/edit`, data)
          .then(() => {
            $('section.food-items').add($itemToEdit);
            return false;
          })
          .catch(err => {
            console.log(err)
          })


        })

    })


  });
