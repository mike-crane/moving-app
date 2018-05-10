const MOCK_BOXES = {
  "boxes": [
    {
      "id": "1111111", 
      "user": "Jeff", 
      "room": "Living Room", 
      "description": "Stuff from bookshelf", 
      "contents": "books, picture frames", 
      "packed": 1470016976609, 
      "unpacked": "false" 
    },
    {
      "id": "2222222",
      "user": "Jill",
      "room": "Kitchen",
      "description": "Bakeware and plates",
      "contents": "pizza pan, cookie sheet, muffin pan, large dishes, bowls",
      "packed": 1470012976609,
      "unpacked": "false"
    },
    {
      "id": "3333333",
      "user": "Bobby",
      "room": "Bobby's Room",
      "description": "Toys and posters",
      "contents": "legos, drone, fidget spinner, scooter, star wars poster, Labron James poster",
      "packed": 1470011976609,
      "unpacked": "false"
    },
    {
      "id": "4444444",
      "user": "Jill",
      "room": "Garage",
      "description": "Tools and recreation equipment",
      "contents": "circular saw, hammer, wrench, bocce ball set, soccer ball, kite",
      "packed": 1470009976609,
      "unpacked": "false"
    }
  ]
};

function getBoxes(callbackFn) {
  setTimeout(function() { callbackFn(MOCK_BOXES)}, 100);
}

function displayBoxes(data) {
  for (index in data.boxes) {
    $('body').append(
      `<h2>${data.boxes[index].room}</h2>
      <p>${data.boxes[index].description}</p>
      <p>${data.boxes[index].contents}</p>
      <hr>`
      // '<p>' + data.boxes[index].text + '</p>'
    );
  }
}

function getAndDisplayBoxes() {
  getBoxes(displayBoxes);
}

$(getAndDisplayBoxes);