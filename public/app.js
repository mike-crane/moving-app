// GLOBAL VARIABLES
const BOX = {};

/**
 * ============================================================================
 *            SIGNUP FUNCTION
 * ============================================================================
 */
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
    registration(user);
    e.preventDefault();
  });
}

/**
 * ============================================================================
 *            LOGIN FUNCTION
 * ============================================================================
 */
function signInUser() {
  // Set up an event listener for the sign in form.
  $('#login-form').submit(function (e) {

    // Store the user info 
    let username = $('#login-username').val();
    let password = $('#login-password').val();

    const user = {
      username,
      password
    };

    // Submit the form using AJAX.
    authentication(user);
    e.preventDefault();
  });
}

/**
 * ============================================================================
 *            EVENT LISTENER FUNCTIONS
 * ============================================================================
 */
function addNewBox() {
  // Set up an event listener for add new box form.
  $('#new-box-form').submit(function (e) {

    // Store the box info 
    BOX.room = $('#room').val();
    BOX.description = $('#description').val();
    BOX.contents = $('#contents').val();
    BOX.user = localStorage.getItem('currentUser');

    // Submit the form using AJAX.
    newBox(BOX);

    // Clear out the form values after submission
    $('#new-box-form')[0].reset();
    e.preventDefault();
  });
}

function handleSubmitButtons() {
  // create account / sign in link
  $('.message').on('click', 'a', function () {
    $('form').animate({
      height: "toggle",
      opacity: "toggle"
    }, "slow");
  });

  // pack link
  $('#choose-pack').on('click', function () {
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.pack-or-unpack').css('display', 'none');
    getAllBoxes(displayBoxes);
  });

  // unpack link
  $('#choose-unpack').on('click', function () {
    $('.unpacking').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.pack-or-unpack').css('display', 'none');
    getAllBoxes(displayBoxes);
  });

  // button to add new box on pack screen
  $('#add-box-btn').on('click', function () {
    $('.new-box').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('#new-box-form').css('display', 'block');
    $('.packing').css('display', 'none');
  });

  // back button
  $('#pack-back').on('click', function () {
    $('.pack-or-unpack').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.packing').css('display', 'none');
  });

  // back button
  $('#unpack-back').on('click', function () {
    $('.pack-or-unpack').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.unpacking').css('display', 'none');
  });

  // back button
  $('#addbox-back').on('click', function () {
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.new-box').css('display', 'none');
    $('#new-box-form')[0].reset();
  });

  // back button
  $('#edit-packed-box-back').on('click', function () {
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.edit-packed-box').css('display', 'none');
    $('.formSection').remove();
  });

  // back button
  $('#box-contents-back').on('click', function () {
    $('.unpacking').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.box-contents').css('display', 'none');
  });

  // to expand edit screen for single box
  $('.packed-list').on('click', '.packed-item', function () {
    BOX.id = $(this).attr('box-id');
    BOX.room = $(this).attr('room');
    BOX.description = $(this).attr('desc');
    BOX.contents = $(this).attr('cont');

    displayBoxEdit(BOX);
    displayEditView();

    $('.edit-packed-box').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.packing').css('display', 'none');
  });

  // to expand content screen for single box
  $('.unpacked-list').on('click', '.unpacked-item', function () {
    BOX.id = $(this).attr('box-id');
    BOX.room = $(this).attr('room');
    BOX.description = $(this).attr('desc');
    BOX.contents = $(this).attr('cont');
    BOX.unpacked = $(this).attr('unpacked');

    displayBoxContents(BOX);

    $('.box-contents').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.unpacking').css('display', 'none');
  });

  // delete button on edit screen
  $(document).on("click", ".deleteButton", function () {
    deleteBox(BOX.id);
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.edit-packed-box').css('display', 'none');
    $('.formSection').remove();
  });

  // save changes button on edit screen
  $(document).on('click', '.saveButton', function(e) {
    BOX.room = $('#edit-room').val();
    BOX.description = $('#edit-desc').val();
    BOX.contents = $('#edit-cont').val();
    
    updateBox(BOX);
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.edit-packed-box').css('display', 'none');
    $('.formSection').remove();
    e.preventDefault();
  });
}

/**
 * ============================================================================
 *            FUNCTIONS RESPONSIBLE FOR RENDERING TO DOM
 * ============================================================================
 */
function displayBoxes(data) {
  $('.unpacked-list').empty();
  $('.packed-list').empty();
  for (let i = 0; i < data.length; i++) {
    let id = data[i].id;
    let room = data[i].room;
    let desc = data[i].description;
    let cont = data[i].contents;
    let unpacked = data[i].unpacked;

    if (unpacked) {
      $('.unpacked-list').append(
        `<li class="unpacked" box-id="${id}" room="${room}" desc="${desc}" cont="${cont}" unpacked="${unpacked}">${room}<br><br><span>${cont}</span></li>`
      );
    } else {
      $('.unpacked-list').append(
        `<li class="unpacked-item" box-id="${id}" room="${room}" desc="${desc}" cont="${cont}" unpacked="${unpacked}">${desc} from ${room}</li>`
      );
      $('.packed-list').append(
        `<li class="packed-item" box-id="${id}" room="${room}" desc="${desc}" cont="${cont}">${desc} from ${room} </li>`
      );
    }
  }
}

function displayBoxEdit(box) {
  $('.edit-packed-box').append(
    `<div class="formSection readOnly">
      <form>
        <label for="edit-room">Room</label>
        <input class="edit-field" type="text" value="${box.room}" id="edit-room" disabled>
        <label for="edit-desc">Description</label>
        <input class="edit-field" type="text" value="${box.description}" id="edit-desc" disabled>
        <label for="edit-cont">Contents</label>
        <input class="edit-field" type="text" value="${box.contents}" id="edit-cont" disabled>
        <button type="button" class="editButton">Edit</button>
        <button type="button" class="deleteButton">Delete</button>
        <div class="actionButtons">
          <a href="#" class="cancelButton">Cancel</a>
          <button class="saveButton" type="submit">Save</button>
        </div>
      </form>
    </div>`
  );
}

function displayBoxContents(box) {
  
  $('.contents-container').html(`<h3>${box.room}</h3><p>${box.contents}</p><div class="box-status"><button type="button" id="unpack-btn">Mark Unpacked</button></div>`);

  $('.contents-container').on('click', '#unpack-btn', function () {
    box.unpacked = true;
    updateBox(box);
    $('.unpacking').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.box-contents').css('display', 'none');
  });
}

// FUNCTION RESPONSIBLE FOR EDIT SCREEN
function displayEditView() {
  let oldValues = null;

  $(document).on("click", ".editButton", function () {
    let section = $(".formSection");
    let inputs = section.find("input");
    oldValues = {};

    section.removeClass("readOnly");

    inputs.each(function () {
      oldValues[this.id] = $(this).val();
    }).prop("disabled", false);
  }).on("click", ".cancelButton", function (e) {

    let section = $(".formSection");
    let inputs = section.find("input");

    section.addClass("readOnly");

    $('button').prop("disabled", false);

    inputs.each(function () {
        $(this).val(oldValues[this.id]);
    }).prop("disabled", true);

    e.stopPropagation();
    e.preventDefault();
  });
}

/**
 * ============================================================================
 *            FUNCTIONS RESPONSIBLE FOR API CALLS
 * ============================================================================
 */

// registration API
function registration(user) {
  let password = user.password;
  let username = user.username;
  $.ajax({
    url: '/api/users',
    type: 'POST',
    data: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .done(function (data) {
    $('#login-form').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('#register-form').css('display', 'none');
    $('.ui-message').remove();
  })
  .fail(function (err) {
    if (password.length < 10) {
      $('.ui-message').html("Password must be at least 10 characters");
    }
    if (err.responseJSON.location === 'username') {
      $('.ui-message').html(`${err.responseJSON.message}. Please choose a different username.`);
    }
  });
}

// login API
function authentication(user) {
  let password = user.password;
  let username = user.username;
  $.ajax({
    url: '/api/auth/login',
    type: 'POST',
    data: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .done(token => {
    localStorage.setItem("authToken", token.authToken);
    localStorage.setItem("currentUser", username);    
    $('.pack-or-unpack').prepend(`<h2 id="welcome-message">Welcome ${user.username}!</h2>`);
    $('.pack-or-unpack').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.landing').css('display', 'none');
    $('body').removeClass('background');
    $('.ui-message').remove();
  })
  .fail(function (err) {
    console.log(err);
    if (err.status === 401) {
      $('.ui-message').html('Username and/or password incorrect');
    }
  });
}

// get all boxes API
function getAllBoxes(callback) {
  let token = localStorage.getItem('authToken');
  let user = localStorage.getItem('currentUser');
  $.ajax({
    url: `/api/boxes/${user}`,
    type: 'GET',
    headers: {
      "Authorization": 'Bearer ' + token
    },
    dataType: 'JSON'
  })
    .done(data => {
      callback(data);
    })
    .fail(function (err) {
      console.error(err);
    });
}

// new box API
function newBox(box) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: '/api/boxes',
    type: 'POST',
    data: JSON.stringify(box),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .done(data => {
    $('.packed-list').append(
      `<li class="packed-item" box-id="${data.id}" room="${data.room}">${data.description} from ${data.room}</li>`
    );
    $('.unpacked-list').append(
      `<li class="unpacked-item" box-id="${data.id}" room="${data.room}" desc="${data.description}" cont="${data.contents}" unpacked="${data.unpacked}">${data.description} from ${data.room}</li>`
    );
    getAllBoxes(displayBoxes);
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.new-box').css('display', 'none');
  })
  .fail(function (err) {
    console.log(err);
  });
}

// Update Box API
function updateBox(box) {
  let token = localStorage.getItem('authToken');

  $.ajax({
    url: `/api/boxes/${box.id}`,
    type: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }, 
    data: JSON.stringify(box)
  })
  .done((data) => {
    getAllBoxes(displayBoxes);
  })
  .fail(function (err) {
    console.log(err);
  })
}

// Delete Box API
function deleteBox(id) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: `/api/boxes/${id}`,
    type: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .done(function (data) {    
    getAllBoxes(displayBoxes);
  })
  .fail(function (err) {
    console.log(err);
  })
}

/**
 * ============================================================================
 *            ON READY FUNCTIONS
 * ============================================================================
 */
function initiateApp() {
  $(handleSubmitButtons);
  $(registerNewUser);
  $(signInUser);
  $(addNewBox);
}

$(initiateApp);