const MOCK_BOXES = {
  "boxes": [
    {
      "id": "1111111", 
      "user": "Jeff", 
      "room": "Living Room", 
      "description": "Bookshelf items", 
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
    }
  ]
};

function registerNewUser() {

  // Set up an event listener for the registration form.
  $('#register-form').submit(function (e) {

    // Store the user info 
    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let username = $('#userName').val();
    let password = $('#passWord').val();

    const user = {
      firstName,
      lastName,
      username,
      password
    };

    // Submit the form using AJAX.
    $.ajax({
      headers: {
        'Content-Type': 'application/json' 
      },
      type: 'POST',
      url: 'http://localhost:8080/api/users',
      data: JSON.stringify(user)
    });

    e.preventDefault(); // avoid to execute the actual submit of the form.
  });
}

function signInUser() {

  // Set up an event listener for the sign in form.
  $('#login-form').submit(function (e) {
    e.preventDefault();
    // Store the user info 
    let username = $('#login-username').val();
    let password = $('#login-password').val();

    const user = {
      username,
      password
    };

    // Submit the form using AJAX.
    $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'POST',
      url: 'http://localhost:8080/api/auth/login',
      data: JSON.stringify(user)
    })
    .done(token => localStorage.setItem("authToken", token.authToken));
  });
}

function getAllBoxes() {

  let token = localStorage.getItem('authToken');
    // Submit the form using AJAX.
  $.ajax({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    type: 'GET',
    url: 'http://localhost:8080/api/boxes'
  })
  .done(function(response) {
    console.log(response);
  })
  // .done(boxes => displayBoxes(boxes)); 
}

function addNewBox() {

  // Set up an event listener for the registration form.
  $('#new-box-form').submit(function(e) {

    // Store the box info 
    let room = $('#room').val();
    let description = $('#description').val();
    let contents = $('#contents').val();

    const box = {
      room,
      description,
      contents
    };

    // Submit the form using AJAX.
    $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'POST',
      url: 'http://localhost:8080/api/boxes',
      data: JSON.stringify(box)
    });

    $('.packing').animate({ height: "toggle", opacity: "toggle" }, "fast");
    $('.new-box').css('display', 'none');

    e.preventDefault(); // avoid to execute the actual submit of the form.
  });
}


function handleSubmitButtons() {
  $('.message').on('click', 'a', function () {
    $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
  });

  $('#login-form').submit(function (e) {
    e.preventDefault();
    $('.pack-or-unpack').animate({ height: "toggle", opacity: "toggle" }, "fast");
    $('.landing').css('display', 'none');
  });

  $('#add-box-btn').on('click', function () {
    $('.new-box').animate({ height: "toggle", opacity: "toggle" }, "fast");
    $('.packing').css('display', 'none');
  });

  // $('#new-box-form').submit(function (e) {
  //   // addNewBox();
  //   $('.packing').animate({ height: "toggle", opacity: "toggle" }, "fast");
  //   $('.new-box').css('display', 'none');
  //   e.preventDefault();
  // });

  $('#choose-pack').on('click', function () {
    $('.packing').animate({ height: "toggle", opacity: "toggle" }, "fast");
    $('.unpacking').css('display', 'none');
    $('.pack-or-unpack').css('display', 'none');
  });

  $('#choose-unpack').on('click', function () {
    $('.unpacking').animate({ height: "toggle", opacity: "toggle" }, "fast");
    $('.packing').css('display', 'none');
    $('.pack-or-unpack').css('display', 'none');
  });
}

function getBoxes(callbackFn) {
  setTimeout(function() { callbackFn(MOCK_BOXES)}, 100);
}

function displayBoxes(data) {
  for (index in data.boxes) {
    $('.unpacked-list').append(
      `<li class="unpacked-item">${data.boxes[index].description} from ${data.boxes[index].room} <div class="box-status"><label for="checkBox">Unpacked:<input class="checkBox" type="checkbox" title="checkbox"></label></div></li>`
    );
    $('.packed-list').append(
      `<li class="packed-item">${data.boxes[index].description} from ${data.boxes[index].room} <div class="box-status"><a href="#" class="box-edit">edit</a></div></li>`
    );
  }
}

function getAndDisplayBoxes() {
  getBoxes(displayBoxes);
  $(handleSubmitButtons);
  $(registerNewUser);
  $(signInUser);
  $(addNewBox);
}

$(getAndDisplayBoxes);