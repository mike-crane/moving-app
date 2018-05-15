const MOCK_BOXES = {
  "boxes": [
    {
      "id": "1111111", 
      "user": "Jeff", 
      "room": "Living Room", 
      "description": "Stuff from bookshelf", 
      "contents": "books, picture frames", 
      "packed": 1470016976609, 
      "unpacked": false 
    },
    {
      "id": "2222222",
      "user": "Jill",
      "room": "Kitchen",
      "description": "Bakeware and plates",
      "contents": "pizza pan, cookie sheet, muffin pan, large dishes, bowls",
      "packed": 1470012976609,
      "unpacked": true
    },
    {
      "id": "3333333",
      "user": "Bobby",
      "room": "Bobby's Room",
      "description": "Toys and posters",
      "contents": "legos, drone, fidget spinner, scooter, star wars poster, Labron James poster",
      "packed": 1470011976609,
      "unpacked": false
    },
    {
      "id": "4444444",
      "user": "Jill",
      "room": "Garage",
      "description": "Tools and recreation equipment",
      "contents": "circular saw, hammer, wrench, bocce ball set, soccer ball, kite",
      "packed": 1470009976609,
      "unpacked": false
    },
    {
      "id": "5555555",
      "user": "Jeff",
      "room": "Office",
      "description": "Office equipment and supplies",
      "contents": "computer, monitor, files, stapler, paper, pens",
      "packed": 1470013976609,
      "unpacked": true
    },
  ]
};

$('.message').on('click', 'a', function () {
  $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
})

function getBoxes(callbackFn) {
  setTimeout(function() { callbackFn(MOCK_BOXES)}, 100);
}

function displayBoxes(data) {
  for (index in data.boxes) {
    $('.unpacked-list').append(
      `<li class="unpacked-item">${data.boxes[index].description} from ${data.boxes[index].room} <div class="box-status"><label for="checkBox">Unpacked:</label><input id="checkBox" type="checkbox"></div><ul><li class="box-contents">${data.boxes[index].contents}</li></ul></li>`
    );
    $('.packed-list').append(
      `<li class="packed-item">${data.boxes[index].description} from ${data.boxes[index].room} <div class="box-status"><a href="#">edit / delete</a></div><ul><li class="box-contents">${data.boxes[index].contents}</li></ul></li>`
    );
  }
}

function getAndDisplayBoxes() {
  getBoxes(displayBoxes);
}

$(getAndDisplayBoxes);