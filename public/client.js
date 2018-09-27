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

function login() {

      $('#loginForm').on('submit', function (event) {
        event.preventDefault();
        var userLogin = $('#userField2').val();
        var passLogin = $('#passField2').val();
        const LOGIN_ENDPOINT = 'https://calm-hollows-72370.herokuapp.com/login/' + userLogin + '/' + passLogin + '/';
        $.getJSON(LOGIN_ENDPOINT, function(response) {
          status = response;
          if (status == "Success") {
            console.log('success!');
            ACTIVE_USER = userLogin;
            LOAD_TRIP_URL = 'https://calm-hollows-72370.herokuapp.com/trips/' + ACTIVE_USER;
            $.getJSON(LOAD_TRIP_URL, function(response) {
              if (response !== 'not found') {
                //add alert: success here
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
              clearFormData();
              $('#userNav').text('Log Out');
              $('.page').css('display', 'none');
              $('#locationPage').css('display', 'block');
              }
            })
          } else if (status == "Failure") {
            //add alert: invalid details here
            clearFormData();
          } else {
            //add alert: internal server error here
            clearFormData();
          }
        })
      });
      $('#loginPage').on('click', '#register', function (event) {
        event.preventDefault();
        clearFormData();
        $('.page').css('display', 'none');
        $('#signupPage').css('display', 'block');
      });
  };

function returnToLogin () {

  $('#signupSuccessPage').on('click', '#returnToLogin', function (event) {
        $('.page').css('display', 'none');
        $('#loginPage').css('display', 'block');
        clearFormData();
      });
};

function registerUser () {

  $('#signupForm').on('click', '#signupButton', function (event) {
    event.preventDefault();
    if ($('#passField').val() !== $('#confirmPassField').val()) {
      //add alert: passwords do not match here
      $('#passField').val() = '';
      $('#confirmPassField').val() = '';
    } else if (username !== '' && email !== '' && password !== '') {
      username = $('#userField').val();
      email = $('#emailField').val();
      password = $('#passField').val();
      var userData = {
        "username": username,
        "email": email,
        "password": password
      };
      $.getJSON(USER_ENDPOINT, function(response) {
          userList = response;
          for (let i = 0; i < userList.length; i++) {
            if (userList[i].username == username) {
              var message = 'Username Taken';
            } else {
              var message = 'Username Available';
            }
          }
          if (message == 'Username Taken') {
            //add alert: username taken here
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
      //add alert: try again here
      clearFormData();
    }
  })
};

function generateQuestion () {

      if (state.currentQuestionIndex < state.questions.length) {
        let question = state.questions[state.currentQuestionIndex]
        $('#questionText').text(question.question);
        $('#questionSubText').text(question.subtext);
      } else if (state.currentQuestionIndex >= state.questions.length) {
        createList();
      }
};

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
            //add alert: fill in both fields here
          }
      });
};

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

function createList () {

  $('#confirmList li').remove();
  $('.page').css('display', 'none');
  $('#setupConfirmPage').css('display', 'block');

   list.map(function (item) {

      //Creates a preview of the list for the user to review
      $('#confirmList').append('<li>' + item + '</li>');
    });
    
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

function buildList() {


  $('#moveList li').remove();
  list.map(function (item) {

      //Assembles the full-featured list after user approval
        //Creates International Travel Requirements Content
      if (item == 'Review Travel Requirements') {
        $('#moveList').append('<li>' + '<span class="listItem" id="intTravel">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><a role="link" aria-label="Foreign Travel Requirements" href="https://travel.state.gov/content/travel/en/international-travel/before-you-go/travelers-checklist.html" target="_blank">Click here to see requirements at travel.state.gov</a></section></li>');
      
      } else if (item == 'Book a Flight') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><div role="tab" aria-label="Search for flight" data-skyscanner-widget="SearchWidget"></div><script src="https://widgets.skyscanner.net/widget-server/js/loader.js" async></script></section></li>');
      
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
      
      } else if (item == 'Find a Home to Purchase') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><a role="link" aria-label="Homes for sale on Zillow.com" href="https://www.zillow.com/homes/for_sale/' + toCity + '/" target="_blank">Zillow.com - ' + toCity + ' Homes for Sale</a></section></li>')
      
      } else if (item == 'Find Rental Housing') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="checkbox" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><a role="link" aria-label="Homes for rent on Zillow.com" href="https://www.zillow.com/homes/for_rent/' + toCity + '/" target="_blank">Zillow.com - ' + toCity + ' Rentals</a><br><a role="link" aria-label="Homes for rent on Apartments.com" href="https://www.apartments.com/' + toCity + '/" target="_blank">Apartments.com - ' + toCity + ' Rentals</a></section></li>');
      
      } else if (item == 'Setup Email Reminders'){
        //$('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><p>Date: <input type="date" id="datepicker"></p></section></li>');
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="button" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"><p role="dialog" aria-label="Feature disabled - will be enabled in future version" >[Feature to be implemented in later version]</p></section></li>');
      
      } else {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button role="button" aria-label="Expand item" class="toggleBox">+</button><button role="button" aria-label="Delete item" class="deleteBox">x</button><input role="button" aria-label="Check off item" type="checkbox" class="checkBox"></input><section class="itemContent"></section></li>');
      }
    });
}

function moveList() {

  $('#moveList').on('click', '.toggleBox', function (event) {
    if ($(this).closest('li').find('.itemContent').css("display") == "none") {
      $('.itemContent').css("display", "none");
      $(this).closest('li').find('.itemContent').css("display", "block");
      $('.toggleBox').text('+');
      $(this).text('–');

    } else if ($(this).closest('li').find('.itemContent').css("display") == "block") {
      $(this).closest('li').find('.itemContent').css("display", "none");
      $(this).text('+');
    }
  });

  $('#moveList').on('click', '.checkBox', function (event) {
    $(this).closest('li').toggleClass('checked');
    $(this).closest('li').find('.toggleBox').toggleClass('hidden');
    $(this).closest('li').find('.itemContent').css("display", "none");
  });

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
    $.ajax(LIST_UPDATE, {
        data : JSON.stringify(listUpdate),
        contentType : 'application/json',
        type : 'PUT'
    })
  });

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

$(load);