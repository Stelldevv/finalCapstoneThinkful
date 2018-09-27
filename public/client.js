//Lots of variables made global scope for ease.
var list = [];
var fromCity;
var toCity;
var tripID
var service;
var workingItem;
var yelpMap;
var username;
var email;
var password;
var result;
var status;
var message;
var ACTIVE_USER;
var TRIP_DATA;
var YELP_SEARCH_URL;
var LOAD_TRIP_URL;
const USER_ENDPOINT = 'https://calm-hollows-72370.herokuapp.com/users';
const TRIP_ENDPOINT = 'https://calm-hollows-72370.herokuapp.com/trips';

//Establishes a navbar that listens for clicks.
function navbar () {

  $('#navBar').on('click', '#contactNav', function (event) {
    event.preventDefault();
    $('.page').css('display', 'none');
    $('#contactPage').css('display', 'block');
  })
  $('#navBar').on('click', '#homeNav', function (event) {
    event.preventDefault();
    $('.page').css('display', 'none');
    $('#homePage').css('display', 'block');
  })
  $('#navBar').on('click', '#aboutNav', function (event) {
    event.preventDefault();
    $('.page').css('display', 'none');
    $('#disclaimerPage').css('display', 'block');
  })
  $('#navBar').on('click', '#tripNav', function (event) {
    $('.page').css('display', 'none');
    $('#listPage').css('display', 'block');
  })
  //This one changes state from "Log In" to "Log Out" once a user is logged in.
  $('#navBar').on('click', '#userNav', function (event) {
    event.preventDefault();
    $('.page').css('display', 'none');
    $('#loginPage').css('display', 'block');
    ACTIVE_USER = '';
    resetList();
    $('#tripNavButton').css('display', 'none');
    $('#userNav').text('Log In');
  })
}

//Establishes "Yeah!" button to bring user to the next page via click listener.
function landingPage() {

  $('#homePage').on('click', '#goToLogin', function (event) {
    $('.page').css('display', 'none');
    $('#loginPage').css('display', 'block');
    ACTIVE_USER = '';
    resetList();
    $('#tripNavButton').css('display', 'none');
    $('#userNav').text('Log In');
    $('.page').css('display', 'none');
    $('#loginPage').css('display', 'block');
    });
};

//Queries the server database for login information.
function login() {

      //Upon submission of login data..
      $('#loginForm').on('submit', function (event) {
        event.preventDefault();
        var userLogin = $('#userField2').val();
        var passLogin = $('#passField2').val();
        const LOGIN_ENDPOINT = 'https://calm-hollows-72370.herokuapp.com/login/' + userLogin + '/' + passLogin + '/';
        //Sends login data to server..
        $.getJSON(LOGIN_ENDPOINT, function(response) {
          status = response;
          //If server detects valid login data.. Success!
          if (status == "Success") {
            console.log('success!');
            ACTIVE_USER = userLogin;
            LOAD_TRIP_URL = 'https://calm-hollows-72370.herokuapp.com/trips/' + ACTIVE_USER;
            //Server loads the user's Trip List, if available. Greets the user appropriately.
            $.getJSON(LOAD_TRIP_URL, function(response) {
              if (response !== 'not found') {
                //List data found - Returning user response
                alert("Welcome back to Planit!");
                TRIP_DATA = response;
                list = TRIP_DATA.list;
                fromCity = TRIP_DATA.location;
                toCity = TRIP_DATA.destination;
                tripID = TRIP_DATA._id;
                $('.fromCity').text(fromCity);
                $('.toCity').text(toCity);
                buildList();
                clearFormData();
                $('#userNav').text('Log Out');
                $('#tripNavButton').css('display', 'block');
                $('.page').css('display', 'none');
                $('#listPage').css('display', 'block');
              } else {
                //No list data found - New user response 
                alert("Thanks for signing up! Please take a moment to answer some questions.")
                clearFormData();
                $('#userNav').text('Log Out');
                $('.page').css('display', 'none');
                $('#locationPage').css('display', 'block');
              }
            })
          //If server detects invalid details
          } else if (status == "Failure") {
            alert("Login Failed");
            clearFormData();
          //If server finds no matching information or suffers an internal error
          } else {
            alert("Login Failed");
            clearFormData();
          }
        })
      });
      //listens for user to begin signup
      $('#loginPage').on('click', '#register', function (event) {
        event.preventDefault();
        clearFormData();
        $('.page').css('display', 'none');
        $('#signupPage').css('display', 'block');
      });
  };

//Returns user to the login page after signing up
function returnToLogin () {

  $('#signupSuccessPage').on('click', '#returnToLogin', function (event) {
        $('.page').css('display', 'none');
        $('#loginPage').css('display', 'block');
        clearFormData();
      });
};

//Allows user to create an account by posting data to the server database
function registerUser () {

  $('#signupForm').on('click', '#signupButton', function (event) {
    event.preventDefault();
    //If user submits data, but passwords don't match
    if ($('#passField').val() !== $('#confirmPassField').val()) {
      alert('Passwords do not match!');
      $('#passField').val() = '';
      $('#confirmPassField').val() = '';
    //if user satisfactorily submits registration data.
    } else if (username !== '' && email !== '' && password !== '') {
      username = $('#userField').val();
      email = $('#emailField').val();
      password = $('#passField').val();
      var userData = {
        "username": username,
        "email": email,
        "password": password
      };
      //post data to server
      $.getJSON(USER_ENDPOINT, function(response) {
          userList = response;
          for (let i = 0; i < userList.length; i++) {
            //but reject it is the username is already taken
            if (userList[i].username == username) {
              var message = 'Username Taken';
            //or allow it if username is available.
            } else {
              var message = 'Username Available';
            }
          }
          if (message == 'Username Taken') {
            alert('Username Taken!')
            clearFormData();
          } else {
            $.ajax(USER_ENDPOINT, {
              data : JSON.stringify(userData),
              contentType : 'application/json',
              type : 'POST'
            })
          }
      })
      $('#signupSuccessEmail').text(email);
      $('.page').css('display', 'none');
      $('#signupSuccessPage').css('display', 'block');
    } else {
      alert('Try again!');
      clearFormData();
    }
  })
};

//Generates the setup questions from a static database
function generateQuestion () {

      if (state.currentQuestionIndex < state.questions.length) {
        let question = state.questions[state.currentQuestionIndex]
        $('#questionText').text(question.question);
        $('#questionSubText').text(question.subtext);
      } else if (state.currentQuestionIndex >= state.questions.length) {
        createList();
      }
};

//Resets all local data to ensure setup can be properly done, then starts the process
function beginSetup() {

      $('#locationPage').on('click', '#beginQuestions', function (event) {
        resetList();
        event.preventDefault();
        if ($('#locationField').val() !== '' && $('#destinationField').val() !== '') {
        fromCity = $('#locationField').val();
        toCity = $('#destinationField').val();
        $('#locationField').val('');
        $('#destinationField').val('');
        $('.fromCity').text(fromCity);
        $('.toCity').text(toCity);
        $('.page').css('display', 'none');
        $('#setupPage').css('display', 'block');
          } else {
            alert('fill in both fields here');
          }
      });
};

//Adds tasks to the Trip List for each time the user answers "Yes"
function listMaker () {

      $('#setupPage').on('click', '.yesButton', function (event) {
        event.preventDefault();
        if (state.questions[state.currentQuestionIndex].task) {
          list = list.concat(state.questions[state.currentQuestionIndex].task);
        }
        state.currentQuestionIndex++;
        generateQuestion();
      });
      $('#setupPage').on('click', '.noButton', function (event) {
        event.preventDefault();
        state.currentQuestionIndex++;
        generateQuestion();
    });
};

//Compiles the answers from the setup into a presentation for the user to confirm or deny
function createList () {

  $('#confirmList li').remove();
  $('.page').css('display', 'none');
  $('#setupConfirmPage').css('display', 'block');

   list.map(function (item) {

      //Creates a preview of the list for the user to review
      $('#confirmList').append('<li>' + item + '</li>');
    });
  
  //If the user confirms, posts list data to server database
  $('#setupConfirmPage').on('click', '.confirmButton', function (event) {

    buildList();
    $('.page').css('display', 'none');
    $('#listPage').css('display', 'block');
    $('#tripNavButton').css('display', 'block');
    var TRIP_DATA = {
        "list": list,
        "username": ACTIVE_USER,
        "location": fromCity,
        "destination": toCity
    };
    $.ajax(TRIP_ENDPOINT, {
        data : JSON.stringify(TRIP_DATA),
        contentType : 'application/json',
        type : 'POST'
    })
    $.getJSON(LOAD_TRIP_URL, function(response) {
      if (response !== 'not found') {
        TRIP_DATA = response;
        list = TRIP_DATA.list;
        fromCity = TRIP_DATA.location;
        toCity = TRIP_DATA.destination;
        tripID = TRIP_DATA._id;
      } else {
      }
    });
  });

  $('#setupConfirmPage').on('click','.retryButton', function (event) {
    resetList();
    generateQuestion();
    $('.page').css('display', 'none');
    $('#locationPage').css('display', 'block');
  });
};

//Builds the actual Trip Overview interface from a given "list" variable (stored as "trip" on the server database)
function buildList() {

  //Assembles the full-featured list from variable "list". Clears #moveList just in case.
  $('#moveList li').remove();
  list.map(function (item) {

      //Creates International Travel Requirements List Item
      if (item == 'Review Travel Requirements') {
        $('#moveList').append('<li>' + '<span class="listItem" id="intTravel">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><a role="link" aria-label="Foreign Travel Requirements" href="https://travel.state.gov/content/travel/en/international-travel/before-you-go/travelers-checklist.html" target="_blank">Click here to see requirements at travel.state.gov</a></section></li>');
      
      //Creates the Flight List Item
      } else if (item == 'Book a Flight') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><div role="tab" aria-label="Search for flight" data-skyscanner-widget="SearchWidget"></div><script src="https://widgets.skyscanner.net/widget-server/js/loader.js" async></script></section></li>');
      
      //Creates Vehicle Shipping List Item
      } else if (item == 'Ship your Vehicle') {
        service = 'vehicle shipping';
        YELP_SEARCH_URL = 'https://calm-hollows-72370.herokuapp.com/yelp/' + fromCity + '/' + service + '/';
        $.getJSON(YELP_SEARCH_URL, function(jsonData) {
          result = jsonData;
          yelpMap = result.name + ' ' + result.location.display_address;
          $('#yelpVShip').html('<span class="bestOnYelp">Best on Yelp</span><br>' + result.name + '<br>(' + result.rating + '/5 rating, ' + result.review_count + ' reviews)');
          $('#yelpVShip2').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + yelpMap + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s')
        })
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><section role="dialog" aria-label="Best Yelp Result" id="yelpVShip" class="yelpResult"></section><iframe role="tab" aria-label="Google Maps Location" id="yelpVShip2" width="150" height="150" frameborder="1" style="border:2" src=""></iframe><br><span class="clickSnip">Click map for details!</span></section></li>');
      
      //Create Storage Unit List Item
      } else if (item == 'Find a Storage Unit') {
        service = 'storage unit';
        YELP_SEARCH_URL = 'https://calm-hollows-72370.herokuapp.com/yelp/' + fromCity + '/' + service + '/';
        $.getJSON(YELP_SEARCH_URL, function(jsonData) {
          result = jsonData;
          yelpMap = result.name + ' ' + result.location.display_address;
          $('#yelpStorage').html('<span class="bestOnYelp">Best on Yelp</span><br>' + result.name + '<br>(' + result.rating + '/5 rating, ' + result.review_count + ' reviews)');
          $('#yelpStorage2').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + yelpMap + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s')
        })
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><section role="dialog" aria-label="Best Yelp Result" id="yelpStorage" class="yelpResult"></section><iframe role="tab" aria-label="Google Maps Location" id="yelpStorage2" width="150" height="150" frameborder="1" style="border:2" src=""></iframe><br><span class="clickSnip">Click map for details!</span></section></li>');
      
      //Creates Movers List Item
      } else if (item == 'Hire Movers') {
        service = 'movers';
        YELP_SEARCH_URL = 'https://calm-hollows-72370.herokuapp.com/yelp/' + fromCity + '/' + service + '/';
        $.getJSON(YELP_SEARCH_URL, function(jsonData) {
          result = jsonData;
          yelpMap = result.name + ' ' + result.location.display_address;
          $('#yelpMovers').html('<span class="bestOnYelp">Best on Yelp</span><br>' + result.name + '<br>(' + result.rating + '/5 rating, ' + result.review_count + ' reviews)');
          $('#yelpMovers2').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + yelpMap + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s')
        })
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><section role="dialog" aria-label="Best Yelp Result" id="yelpMovers" class="yelpResult"></section><iframe role="tab" aria-label="Google Maps Location" id="yelpMovers2" width="150" height="150" frameborder="1" style="border:2" src=""></iframe><br><span class="clickSnip">Click map for details!</span></section></li>');        
      
      //Creates Truck Rental List Item
      } else if (item == 'Rent a Moving Truck') {
        service = 'moving truck rental';
        YELP_SEARCH_URL = 'https://calm-hollows-72370.herokuapp.com/yelp/' + fromCity + '/' + service + '/';
        $.getJSON(YELP_SEARCH_URL, function(jsonData) {
          result = jsonData;
          yelpMap = result.name + ' ' + result.location.display_address;
          $('#yelpTruck').html('<span class="bestOnYelp">Best on Yelp</span><br>' + result.name + '<br>(' + result.rating + '/5 rating, ' + result.review_count + ' reviews)');
          $('#yelpTruck2').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + yelpMap + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s')
        })
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><section role="dialog" aria-label="Best Yelp Result" id="yelpTruck" class="yelpResult"></section><iframe role="tab" aria-label="Google Maps Location" id="yelpTruck2" width="150" height="150" frameborder="1" style="border:2" src=""></iframe><br><span class="clickSnip">Click map for details!</span></section></li>');
      
      //Creates Home Purchase List Item
      } else if (item == 'Find a Home to Purchase') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><a role="link" aria-label="Homes for sale on Zillow.com" href="https://www.zillow.com/homes/for_sale/' + toCity + '/" target="_blank">Zillow.com - ' + toCity + ' Homes for Sale</a></section></li>')
      
      //Creates Rental Housing List Item
      } else if (item == 'Find Rental Housing') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><a role="link" aria-label="Homes for rent on Zillow.com" href="https://www.zillow.com/homes/for_rent/' + toCity + '/" target="_blank">Zillow.com - ' + toCity + ' Rentals</a><br><a role="link" aria-label="Homes for rent on Apartments.com" href="https://www.apartments.com/' + toCity + '/" target="_blank">Apartments.com - ' + toCity + ' Rentals</a></section></li>');
      
      //Creates Email Reminder List Item
      } else if (item == 'Setup Email Reminders'){
        //$('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><p>Date: <input type="date" id="datepicker"></p></section></li>');
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="button" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><p role="dialog" aria-label="Feature disabled - will be enabled in future version" >[Feature to be implemented in later version]</p></section></li>');
      
      //Should a user/entity be able to create an item outside of the interface, creates List Item
      } else {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="button" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"></section></li>');
      }
    });
}

//Establishes Trip Overview interaction
function moveList() {

  //Click togglebox to expand a list item
  $('#moveList').on('click', '.toggleBox', function (event) {
    if ($(this).closest('li').find('.itemContent').css("display") == "none") {
      $('.itemContent').css("display", "none");
      $(this).closest('li').find('.itemContent').css("display", "block");
      $('.toggleBox').text('+');
      $(this).text('–');

    //Then click it again to close it
    } else if ($(this).closest('li').find('.itemContent').css("display") == "block") {
      $(this).closest('li').find('.itemContent').css("display", "none");
      $(this).text('+');
    }
  });

  //Click checkbox to check off an item
  $('#moveList').on('click', '.checkBox', function (event) {
    $(this).closest('li').toggleClass('checked');
    $(this).closest('li').find('.toggleBox').toggleClass('hidden');
    $(this).closest('li').find('.itemContent').css("display", "none");
  });

  //Click to delete an item from Trip List
  $('#moveList').on('click', '.deleteBox', function (event) {
    var removeItem = $(this).closest('li').find('.listItem').text();   
    list = $.grep(list, function(value) {
      return value != removeItem;
    })
    $(this).closest('li').remove();
    const LIST_UPDATE = TRIP_ENDPOINT + '/' + tripID;
    var listUpdate = {
        "list": list
    };
    //and then PUT the new list on the server
    $.ajax(LIST_UPDATE, {
        data : JSON.stringify(listUpdate),
        contentType : 'application/json',
        type : 'PUT'
    })
  });

  //Clear Trip List, begin Setup process. DELETE Trip List from server
  $('#listPage').on('click', '#restartButton', function (event) {
    $('.page').css('display', 'none');
    const LIST_DELETE = TRIP_ENDPOINT + '/' + tripID;
    $.ajax(LIST_DELETE, {
        type : 'DELETE'
    });
    resetList();
    clearFormData();
    generateQuestion();
    $('#locationPage').css('display', 'block');
  });
};

//Clears all local list and field data
function resetList() {

  list = [];
  tripID = '';
  state.currentQuestionIndex = 0;
  let question = state.questions[state.currentQuestionIndex]
  $('#questionText').text(question.question);
  $('#questionSubText').text(question.subtext);
  fromCity = '';
  toCity = '';
  service = '';
  $('#tripNavButton').css('display', 'none');
};

//Clears form data for login and signup
function clearFormData() {

  $('#userField').val('');
  $('#emailField').val('');
  $('#passField').val('');
  $('#confirmPassField').val('');
  $('#userField2').val('');
  $('#passField2').val('');
  status = '';
  message = '';
};

//Set listeners for page behavior
function load() {

  landingPage();
  navbar();
  registerUser();
  returnToLogin();
  login();
  beginSetup();
  listMaker();
  moveList();
};

//Launch Planit
$(load);