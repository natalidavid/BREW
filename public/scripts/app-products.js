$(() => {
   //-- Plugin for dayjs ---//
  dayjs.extend(window.dayjs_plugin_relativeTime);

  const userURL = window.location.pathname;
  const userId = userURL.slice(1);

  $(function()  {
    $.ajax({
      method: "GET",
      url: `/products/${userId}`
    })
    .then((result) => {
      renderList(result.products);

      //counter
      const itemCount = $('.product-items table.item').length;
      $('.buying').click(() => {
        if (!itemCount) {
          $('.product-counter').effect( "shake", {times: 3, distance: 10} , 300);
        }
      });

      if (itemCount === 1) {
        $('.product-counter').text(itemCount + " ITEM");
      } else {
        $('.product-counter').text(itemCount + " ITEMS");
      }

    })
    .catch((err) => {
      console.log("AJAX ERROR CAUGHT RENDER BOOKS", err);
    })
  });

  // button to display items in a list
  $('.product-button').click(() => {
    if ($('.product-items').is(":visible")) {
      $('.product-items').slideUp();
    } else {
      $('.product-items').slideDown();
    }
  });

    // function to render items
    const renderList = (items) => {
      for (item of items) {
        generateNewElement(item);
      }
    };

    // function to create new items and push them into the list
    const generateNewElement = (obj) => {
      const name = obj.name;
      const date = new Date(obj.date_added).toISOString();
      const dateAdded = dayjs(date).fromNow();
      const author = obj.author;

      const $markup = `
      <table class="item">
      <tbody>
          <tr>
              <td><input type="checkbox" name="" value=""></td>
              <td class="title-td"><b>${name}</b></td>
              <td class="date-td">Added: ${dateAdded}</td>
          </tr>
      </tbody>
      <table>
      `;

      const $item = $('.product-items').prepend($markup);
      console.log("THIS IS THE ITEM from generate new element:", $item)
      return $item;
    }
  });
