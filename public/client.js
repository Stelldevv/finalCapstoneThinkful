var list = [];
var fromCity;
var toCity;
var service;
var workingItem;
var yelpMap;
var username;
var email;
var password;
var login_status;
var result;
var status;
var YELP_SEARCH_URL;
const USER_ENDPOINT = 'http://localhost:8080/users';

function navbar () {

  $('#navBar').on('click', '#contactNav', function (event) {
    event.preventDefault();
    $('.page').css('display', 'none');
    $('#contactPage').css('display', 'block');
  })
  $('#navBar').on('click', '#homeNav', function (event) {
    event.preventDefault();
    $('.page').css('display', 'none');
    $('#loginPage').css('display', 'block');
  })
  $('#navBar').on('click', '#aboutNav', function (event) {
    event.preventDefault();
    $('.page').css('display', 'none');
    $('#disclaimerPage').css('display', 'block');
  })

}

function landingPage() {

  $('#homePage').on('click', '#goToLogin', function (event) {
    $('.page').css('display', 'none');
    $('#loginPage').css('display', 'block');
  })

};

function login() {

      $('#loginPage').on('click', '#login', function (event) {
        event.preventDefault();
        var userLogin = $('#userField2').val();
        var passLogin = $('#passField2').val();
        const LOGIN_ENDPOINT = 'http://localhost:8080/login/' + userLogin + '/' + passLogin + '/';
        $.getJSON(LOGIN_ENDPOINT, function(response) {
          status = response;
          if (status == "Success") {
            alert('Welcome to Moovit!');
            clearFormData();
            $('.page').css('display', 'none');
            $('#locationPage').css('display', 'block');
          } else if (status == "Failure") {
            alert('Login Failed. Please Try Again.');
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

function registerUser () {

  $('#signupForm').on('click', '#signupButton', function (event) {
    event.preventDefault();
    if ($('#passField').val() !== $('#confirmPassField').val()) {
      alert('Passwords do not match!');
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
      $.ajax(USER_ENDPOINT, {
        data : JSON.stringify(userData),
        contentType : 'application/json',
        type : 'POST'
      })
      console.log(userData + 'posted to User Database.');
      $('#signupSuccessEmail').text(email);
      $('.page').css('display', 'none');
      $('#signupSuccessPage').css('display', 'block');
    } else {
      alert('Error! Try again');
      clearFormData();
    }
  })

};

function returnToLogin () {

  $('#signupSuccessPage').on('click', '#returnToLogin', function (event) {
        $('.page').css('display', 'none');
        $('#loginPage').css('display', 'block');
        clearFormData();
      });

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
            alert('Error! Fill in both fields.');
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

    $('#moveList li').remove();
    list.map(function (item) {

      //Assembles the full-featured list after user approval
        //Creates International Travel Requirements Content
      if (item == 'Review International Travel Requirements') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><a href="https://travel.state.gov/content/travel/en/international-travel/before-you-go/travelers-checklist.html" target="_blank">[See requirements at travel.state.gov]</a></section></li>');

      } else if (item == 'Ship your Vehicle') {
        service = 'vehicle shipping';
        YELP_SEARCH_URL = 'http://localhost:8080/yelp/' + fromCity + '/' + service + '/';
        $.getJSON(YELP_SEARCH_URL, function(jsonData) {
          result = jsonData;
          yelpMap = result.name + ' ' + result.location.display_address;
          $('#yelpVShip').html('<span class="bestOnYelp">Best on Yelp</span><br>' + result.name + '<br>(' + result.rating + '/5 rating, ' + result.review_count + ' reviews)');
          $('#yelpVShip2').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + yelpMap + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s')
        })
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><section id="yelpVShip" class="yelpResult"></section><iframe id="yelpVShip2" width="150" height="150" frameborder="1" style="border:2" src=""></iframe></section></li>');
      
      } else if (item == 'Find a Storage Unit') {
        service = 'storage unit';
        YELP_SEARCH_URL = 'http://localhost:8080/yelp/' + fromCity + '/' + service + '/';
        $.getJSON(YELP_SEARCH_URL, function(jsonData) {
          result = jsonData;
          yelpMap = result.name + ' ' + result.location.display_address;
          $('#yelpStorage').html('<span class="bestOnYelp">Best on Yelp</span><br>' + result.name + '<br>(' + result.rating + '/5 rating, ' + result.review_count + ' reviews)');
          $('#yelpStorage2').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + yelpMap + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s')
        })
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><section id="yelpStorage" class="yelpResult"></section><iframe id="yelpStorage2" width="150" height="150" frameborder="1" style="border:2" src=""></iframe></section></li>');


      } else if (item == 'Hire Movers') {
        service = 'movers';
        YELP_SEARCH_URL = 'http://localhost:8080/yelp/' + fromCity + '/' + service + '/';
        $.getJSON(YELP_SEARCH_URL, function(jsonData) {
          result = jsonData;
          yelpMap = result.name + ' ' + result.location.display_address;
          $('#yelpMovers').html('<span class="bestOnYelp">Best on Yelp</span><br>' + result.name + '<br>(' + result.rating + '/5 rating, ' + result.review_count + ' reviews)');
          $('#yelpMovers2').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + yelpMap + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s')
        })
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><section id="yelpMovers" class="yelpResult"></section><iframe id="yelpMovers2" width="150" height="150" frameborder="1" style="border:2" src=""></iframe></section></li>');        

      } else if (item == 'Rent a Moving Truck') {
        service = 'moving truck rental';
        YELP_SEARCH_URL = 'http://localhost:8080/yelp/' + fromCity + '/' + service + '/';
        $.getJSON(YELP_SEARCH_URL, function(jsonData) {
          result = jsonData;
          yelpMap = result.name + ' ' + result.location.display_address;
          $('#yelpTruck').html('<span class="bestOnYelp">Best on Yelp</span><br>' + result.name + '<br>(' + result.rating + '/5 rating, ' + result.review_count + ' reviews)');
          $('#yelpTruck2').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + yelpMap + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s')
        })
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><section id="yelpTruck" class="yelpResult"></section><iframe id="yelpTruck2" width="150" height="150" frameborder="1" style="border:2" src=""></iframe></section></li>');
        
      } else if (item == 'Find a Home to Purchase') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><div id="zillow-large-search-box-widget-container" style="width:432px;overflow:hidden;background-color:#e7f1fd;color:#555; font: normal normal normal 13px verdana,arial,sans-serif;line-height:13px;margin:0 auto;padding:0;text-align:center;border:1px solid #adcfff;letter-spacing:0;text-transform:none;"><h2 style="color:#d61;text-align:left;font-size:20px;line-height:20px;font-weight:normal;float:left;width:200px;margin-left:10px;margin-top:5px;letter-spacing:0;text-transform:none;">Find Homes</h2><div style="float:right;"><a href="https://www.zillow.com/" target="_blank" rel="nofollow"><img alt="Zillow Real Estate Information" style="border:0;" src="https://www.zillow.com/widgets/GetVersionedResource.htm?path=/static/images/powered-by-zillow.gif"></img></a></div><iframe scrolling="no" src="https://www.zillow.com/widgets/search/LargeSearchBoxWidget.htm?did=zillow-large-search-box-iframe-widget&type=iframe&rgname=' + toCity + '&shvi=yes" width="430" frameborder="0" height="400"></iframe><table id="zillow-tnc-widget-footer-links" width="100%" style="font: normal normal normal 10px verdana,arial,sans-serif;text-align:left;line-height:12px;margin:10px 5px;padding:0;border-spacing:0;border-collapse:collapse;"><tbody style="margin:0;padding:0;"><tr style="margin:0;padding:0;"><td style="font-weight:bold;font-size:10px;color:#555;text-align:left;margin:0;padding:0;">QUICK LINKS:</td></tr><tr style="margin:0;padding:0;"><td style="margin:0;padding:0;"><span id="widgetFooterLink" class="regionBasedLink"><a href="https://www.zillow.com/' + toCity + '/" target="_blank" rel="nofollow" style="color:#36b;font-family:verdana,arial,sans-serif;font-size:10px;margin:0 5px 0 0;padding:0;text-decoration:none;"><span class="region">' + toCity + '</span> Real Estate Listing</a></span></td><td style="margin:0;padding:0;"><span id="widgetFooterLink"><a href="https://www.zillow.com/mortgage-rates/" target="_blank" rel="nofollow" style="color:#36b;font-family:verdana,arial,sans-serif;font-size:10px;margin:0 5px 0 0;padding:0;text-decoration:none;">Mortgage Rates</a></span></td><td style="margin:0;padding:0;"><span id="widgetFooterLink"><a href="https://www.zillow.com/refinance/" target="_blank" rel="nofollow" style="color:#36b;font-family:verdana,arial,sans-serif;font-size:10px;margin:0 5px 0 0;padding:0;text-decoration:none;">Refinancing</a></span></td></tr><tr style="margin:0;padding:0;"><td style="margin:0;padding:0;"><span id="widgetFooterLink" class="regionBasedLink"><a href="https://www.zillow.com/' + toCity + '/foreclosures/" target="_blank" rel="nofollow" style="color:#36b;font-size:10px;margin:0 5px 0 0;padding:0;text-decoration:none;"><span class="region">' + toCity + '</span> Foreclosures</a></span></td><td style="margin:0;padding:0;"><span id="widgetFooterLink"><a href="https://www.zillow.com/mortgage-calculator/" target="_blank" rel="nofollow" style="color:#36b;font-size:10px;margin:0 5px 0 0;padding:0;text-decoration:none;">Mortgage Calculators</a></span></td><td style="margin:0;padding:0;"><span id="widgetFooterLink"><a href="https://www.zillow.com/mortgage-rates/" target="_blank" rel="nofollow" style="color:#36b;font-size:10px;margin:0 5px 0 0;padding:0;text-decoration:none;">Purchase Loans</a></span></td></tr></tbody></table></div></section></li>');

      } else if (item == 'Find Rental Housing') {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><a href="https://www.zillow.com/homes/' + toCity + '_rb/" target="_blank">[Find a rental in ' + toCity + ' on Zillow.com!]</a><br><a href="https://www.apartments.com" target="_blank">[Find a rental in ' + toCity + ' on Apartments.com!]</a></section></li>');

      } else if (item == 'Setup Email Reminders'){
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"><p>Date: <input type="date" id="datepicker"></p></section></li>');

      } else {
        $('#moveList').append('<li>' + '<span class="listItem">' + item + '</span><button class="toggleBox">+</button><input type="checkbox" class="checkBox"></input><section class="itemContent"></section></li>');
        
      }
    });
    $('.page').css('display', 'none');
    $('#listPage').css('display', 'block');
  });

  $('#setupConfirmPage').on('click','.retryButton', function (event) {
    resetList();
    generateQuestion();
    $('.page').css('display', 'none');
    $('#locationPage').css('display', 'block');
  });

};

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
    $(this).closest('li').find('.listItem').toggleClass('checked');
  });

};

function resetList() {

  list = [];
  state.currentQuestionIndex = 0;
  let question = state.questions[state.currentQuestionIndex]
  $('#questionText').text(question.question);
  $('#questionSubText').text(question.subtext);
  fromCity = '';
  toCity = '';
  service = '';
  console.log('resetList ran!');

};

function clearFormData() {

  $('#userField').val('');
  $('#emailField').val('');
  $('#passField').val('');
  $('#confirmPassField').val('');
  $('#userField2').val('');
  $('#passField2').val('');
  status = '';

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