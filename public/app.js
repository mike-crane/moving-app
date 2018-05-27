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

// get all boxes API
function getAllBoxes(callback) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: 'http://localhost:8080/api/boxes',
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

/**
 * ============================================================================
 *            EVENT LISTENER FUNCTIONS
 * ============================================================================
 */
function addNewBox() {
  // Set up an event listener for add new box form.
  $('#new-box-form').submit(function (e) {

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
    newBox(box);

    e.preventDefault();
  });
}

function handleSubmitButtons() {
  $('.message').on('click', 'a', function () {
    $('form').animate({
      height: "toggle",
      opacity: "toggle"
    }, "slow");
  });

  $('#add-box-btn').on('click', function () {
    $('.new-box').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.packing').css('display', 'none');
  });

  $('#choose-pack').on('click', function () {
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.unpacking').css('display', 'none');
    $('.pack-or-unpack').css('display', 'none');
    getAllBoxes(displayBoxes);
  });

  $('#choose-unpack').on('click', function () {
    $('.unpacking').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.packing').css('display', 'none');
    $('.pack-or-unpack').css('display', 'none');
    getAllBoxes(displayBoxes);
  });

  $('#pack-back').on('click', function () {
    $('.pack-or-unpack').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.packing').css('display', 'none');
  });

  $('#unpack-back').on('click', function () {
    $('.pack-or-unpack').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.unpacking').css('display', 'none');
  });

  $('#addbox-back').on('click', function () {
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.new-box').css('display', 'none');
  });

  $('#edit-packed-box-back').on('click', function () {
    $('.packing').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.edit-packed-box').css('display', 'none');
    $('.formSection').remove();
  });

  $('.packed-list').on('click', '.packed-item', function () {
    let boxId = $(this).attr('id');
    let boxRoom = $(this).attr('room');
    let boxDesc = $(this).attr('desc');
    let boxCont = $(this).attr('cont');
    displayBoxEdit(boxRoom, boxDesc, boxCont);
    displayEditView();
    $('.edit-packed-box').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
    $('.packing').css('display', 'none');
  });

  $('.unpacked-list').on('click', '.unpacked-item', function () {
    let selectedBoxId = $(this).attr('id');
    console.log(selectedBoxId);
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

    $('.unpacked-list').append(
      `<li class="unpacked-item" id="${id}">${desc} from ${room} <div class="box-status"><label for="checkBox">Unpacked:<input class="checkBox" type="checkbox" title="checkbox"></label></div></li>`
    );
    $('.packed-list').append(
      `<li class="packed-item" id="${id}" room="${room}" desc="${desc}" cont="${cont}">${desc} from ${room} </li>`
    );
  }
}

function displayBoxEdit(room, desc, cont) {
  $('.edit-packed-box').append(
    `<div class="formSection readOnly">
      <form>
        <label>Room</label>
        <input class="edit-field" type="text" value="${room}" id="edit-room" disabled>
        <label>Description</label>
        <input class="edit-field" type="text" value="${desc}" id="edit-desc" disabled>
        <label>Contents</label>
        <input class="edit-field" type="text" value="${cont}" id="edit-cont" disabled>
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

// FUNCTION RESPONSIBLE FOR EDIT SCREEN
function displayEditView() {
  let oldValues = null;

  $(document).on("click", ".editButton", function () {
    let section = $(this).closest(".formSection");
    let inputs = section.find("input");
    oldValues = {};

    section.removeClass("readOnly");

    inputs.each(function () {
      oldValues[this.id] = $(this).val();
    }).prop("disabled", false);
  }).on("click", ".cancelButton", function (e) {

    let section = $(this).closest(".formSection");
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
  $.ajax({
    url: 'http://localhost:8080/api/users',
    type: 'POST',
    data: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .done(function (data) {
      console.log(data);
    })
    .fail(function (err) {
      console.log(err);
    });
}

// login API
function authentication(user) {
  $.ajax({
    url: 'http://localhost:8080/api/auth/login',
    type: 'POST',
    data: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .done(token => {
      localStorage.setItem("authToken", token.authToken);
      $('.pack-or-unpack').animate({
        height: "toggle",
        opacity: "toggle"
      }, "fast");
      $('.landing').css('display', 'none');
    })
    .fail(function (err) {
      console.log(err);
    });
}

// new box API
function newBox(box) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: 'http://localhost:8080/api/boxes',
    type: 'POST',
    data: JSON.stringify(box),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
    .done(data => {
      $('.packed-list').append(
        `<li class="packed-item" id="${data.id}" room="${data.room}">${data.description} from ${data.room} <div class="box-status"><a href="#" class="box-edit">edit</a></div></li>`
      );
      $('.unpacked-list').append(
        `<li class="unpacked-item" id="${data.id}">${data.description} from ${data.room} <div class="box-status"><label for="checkBox">Unpacked:<input class="checkBox" type="checkbox" title="checkbox"></label></div></li>`
      );
      $('.packing').animate({
        height: "toggle",
        opacity: "toggle"
      }, "fast");
    })
    .fail(function (err) {
      console.log(err);
    });
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