var list = [];

function login() {
      $('#loginPage').on('click', '#login', function (event) {
        event.preventDefault();
        $('#loginPage').css('display', 'none');
        $('#setupPage').css('display', 'block');
        generateQuestion();
      });
      $('#loginPage').on('click', '#register', function (event) {
        event.preventDefault();
        $('#loginPage').css('display', 'none');
        $('#signupPage').css('display', 'block');
        registerUser();
      });
  };



function registerUser () {
  $('#signupForm').on('click', '#signupButton', function (event) {
    event.preventDefault();
    const userData = $('#userField').val();
    const emailData = $('#emailField').val();
    const passwordData = $('#passField').val();
    if (userData !== '' && emailData !== '' && passwordData !== '') {
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
        confirmSetup();
      }
    }

function beginSetup() {
      listMaker();
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

function confirmSetup () {
  $('#setupPage').css('display', 'none');
  $('#setupConfirmPage').css('display', 'block');
  list.map(function (item) {
      $('#moveList').append('<li>' + item + '</li>');
      $('#confirmList').append('<li>' + item + '</li>');
    });
  $('#setupConfirmPage').on('click', '.confirmButton', function (event) {
    $('#setupConfirmPage').css('display','none');
    $('#listPage').css('display','block');
  });
  $('#setupConfirmPage').on('click','.retryButton', function (event) {
    state.currentQuestionIndex = 0;
    list = [];
    $('#moveList').html('');
    $('#confirmList').html('');
    generateQuestion();
    $('#setupConfirmPage').css('display', "none");
    $('#setupPage').css('display', 'block');
  });
}

function load() {
  login();
  beginSetup();
  returnToLogin();
}

$(load);