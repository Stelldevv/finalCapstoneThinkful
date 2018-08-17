var list = [];
var fromCity;
var toCity;
var chosenCity;
var userData;
var emailData;
var passwordData;


function disclaimer () {
  $('#disclaimerPage').on('click', '#accept', function (event) {
    event.preventDefault();
    $('#disclaimerPage').css('display', 'none');
    $('#loginPage').css('display', 'block');
  });
  $('#disclaimerPage').on('click', '#decline', function (event) {
    event.preventDefault();
    $('#disclaimerPage').css('display', 'none');
    $('#waitingRoom').css('display', 'block');
  });
  $('#waitingRoom').on('click', '#leaveWaiting', function (event) {
    $('#waitingRoom').css('display', 'none');
    $('#disclaimerPage').css('display', 'block');
    $('#waitingRoom').empty();
  });
}

function login() {
      $('#loginPage').on('click', '#login', function (event) {
        event.preventDefault();
        $('#loginPage').css('display', 'none');
        $('#locationPage').css('display', 'block');
        generateQuestion();
      });
      $('#loginPage').on('click', '#register', function (event) {
        event.preventDefault();
        $('#loginPage').css('display', 'none');
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
    } else if (userData !== '' && emailData !== '' && passwordData !== '') {
      userData = $('#userField').val();
      emailData = $('#emailField').val();
      passwordData = $('#passField').val();
      $('#signupSuccessEmail').text(emailData);
      $('#signupPage').css('display', 'none');
      $('#signupSuccessPage').css('display', 'block');
    } else {
      alert('Error! Try again');
      $('#userField').val() = '';
      $('#emailField').val() = '';
      $('#passField').val() = '';
      $('#confirmPassField').val() = '';
    }
  })
};

function returnToLogin () {
  $('#signupSuccessPage').on('click', '#returnToLogin', function (event) {
        $('#signupSuccessPage').css('display', 'none');
        $('#loginPage').css('display', 'block');
      });
}

function generateQuestion () {
      if (state.currentQuestionIndex < state.questions.length) {
        let question = state.questions[state.currentQuestionIndex]
        $('#questionText').text(question.question);
        $('#questionSubText').text(question.subtext);
      } else if (state.currentQuestionIndex >= state.questions.length) {
        createList();
      }
    }

function beginSetup() {
      $('#locationPage').on('click', '#beginQuestions', function (event) {
        event.preventDefault();
        if ($('#locationField').val() !== '' && $('#destinationField').val() !== '') {
        fromCity = $('#locationField').val();
        toCity = $('#destinationField').val();
        $('.fromCity').text(fromCity);
        $('.toCity').text(toCity);
        $('#locationPage').css('display', 'none');
        $('#setupPage').css('display', 'block');
          } else {
            alert('Error! Fill in both fields.');
          }
      });
    }

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
  } 

function createList () {
  chosenCity = fromCity;
  $('#setupPage').css('display', 'none');
  $('#setupConfirmPage').css('display', 'block');
  list.map(function (item) {
      //Creates a preview of the list for the user to review
      $('#confirmList').append('<li>' + item + '</li>');

      //Assembles the full-featured list after user approval
        //Creates International Travel Requirements Content
      if (item == 'Review International Travel Requirements') {
        $('#moveList').append('<section class="itemContainer"><li>' + item + '<div class="checkBox"></div>' + '</li>' + '<section class="itemContent"><a href="https://travel.state.gov/content/travel/en/international-travel/before-you-go/travelers-checklist.html" target="_blank">' + 'Visit travel.state.gov' + '</a></section></section>');

      } else if (item == 'Find a Storage Unit') {
        $('#moveList').append('<section class="itemContainer"><li>' + item + '<div class="checkBox"></div>' + '</li>' + '<section class="itemContent"><iframe width="150" height="150" frameborder="1" style="border:2" src="https://www.google.com/maps/embed/v1/place?q=storage+unit+' + chosenCity + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s"></iframe></section></section>');

      } else if (item == 'Hire Movers') {
        $('#moveList').append('<section class="itemContainer"><li>' + item + '<div class="checkBox"></div>' + '</li>' + '<section class="itemContent"><iframe width="150" height="150" frameborder="1" style="border:2" src="https://www.google.com/maps/embed/v1/place?q=movers+' + chosenCity + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s"></iframe></section></section>');

      } else if (item == 'Rent a Moving Truck') {
        $('#moveList').append('<section class="itemContainer"><li>' + item + '<div class="checkBox"></div>' + '</li>' + '<section class="itemContent"><iframe width="150" height="150" frameborder="1" style="border:2" src="https://www.google.com/maps/embed/v1/place?q=moving+truck+rental+' + chosenCity + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s"></iframe></section></section>');

      } else if (item == 'Ship your Vehicle') {
        $('#moveList').append('<section class="itemContainer"><li>' + item + '<div class="checkBox"></div>' + '</li>' + '<section class="itemContent"><iframe width="150" height="150" frameborder="1" style="border:2" src="https://www.google.com/maps/embed/v1/place?q=auto+transport+' + chosenCity + '&key=AIzaSyCpG8rWBDb4xfvviR1-Y7yr7pIt3bulT0s"></iframe></section></section>');

      } else {
        $('#moveList').append('<section class="itemContainer"><li>' + item + '<div class="checkBox"></div>' + '</li></section>');
      }
    });
    
  $('#setupConfirmPage').on('click', '.confirmButton', function (event) {
    $('#setupConfirmPage').css('display', 'none');
    $('#listPage').css('display', 'block');
  });
  $('#setupConfirmPage').on('click','.retryButton', function (event) {
    state.currentQuestionIndex = 0;
    list = [];
    fromCity = '';
    toCity = '';
    $('#moveList').html('');
    $('#confirmList').html('');
    generateQuestion();
    $('#setupConfirmPage').css('display', 'none');
    $('#locationPage').css('display', 'block');
  });
}

function moveList() {
  $('#moveList').on('click', '.itemContainer', function (event) {
    //$(this).toggle();
    $(this).find('.itemContent').toggle();
  });
  $('#moveList').on('click', '.checkBox', function (event) {
    $('.itemContainer').toggleClass("checked");
  });
}

function load() {
  disclaimer();
  registerUser();
  returnToLogin();
  login();
  beginSetup();
  listMaker();
  moveList();
}

$(load);