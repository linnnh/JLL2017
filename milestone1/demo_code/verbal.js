/* verbal part */

// var oddballsQuestions = [ 
//   "When a hot dog expands, in which direction does it split and why?......by Space X",
//   "Would you rather fight 1 horse-sized duck, or 100 duck-sized horses?......by Whole Foods",
//   "If you’re the CEO, what are the first three things you check about the business when you wake up?......by Dropbox",
//   "What would the name of your debut album be?......by Urban Outfitters",
//   "What would you do if you found a penguin in the freezer?......by Trader Joe's",
//   "How many basketballs would fit in this room?......by Delta Airlines",
//   "If you had $2,000, how would you double it in 24 hours?...... by Uniqlo",
//   "What would you do if you were the one survivor in a plane crash?......by Airbnb",
//   "What’s your favorite 90s jam?......by Squarespace",
//   "Who would win in a fight between Spiderman and Batman?......by Stanford University",
//   "What did you have for breakfast?......by Banana Republic",
//   "What’s your favorite Disney Princess?......by Cold Stone Creamery"
//   ];

var bq = [ 
  "Where do you see yourself in five years? Ten years?",
  "Why do you want to leave your current company?",
  "What can you offer us that someone else can not?",
  "What are three things your former manager would like you to improve on?",
  "Tell me about an accomplishment you are most proud of.",
  "Tell me about a time you made a mistake.",
  "Tell me how you handled a difficult situation.",
  "Why should we hire you?",
  "Give a time when you went above and beyond the requirements for a project.",
  "Tell me about a time when you disagreed with your boss.",
  "Are you a leader or a follower?",
  "What are your hobbies?"
  ];


var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

// audio
var audio = new Audio('close.mp3');
function playSound() {
    audio.play();
}


function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Shift + reload = reload without using cache */
    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);
    setEyeColor("gold");

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js
      setEyeColor("black");

      var bot_response = decide_response(user_said)
      speak(bot_response)

      // Play sound effect, and delay 2.5s
      //setTimeout(playSound, 2500)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
    var response;

    var practice_re = /practice\s(.+)/i;  
    // creating a regular expression
    
    var practice_parse_array = user_said.match(practice_re) 
    // parsing the input string with the regular expression
    
    console.log(practice_parse_array) 
    // let's print the array content to the console log so we understand 
    // what's inside the array.


    if (practice_parse_array && state === "initial") {
      response = "ok, let's practice " + practice_parse_array[1] + "Let's see........" + bq[Math.floor(Math.random() * bq.length)];
      State = "initial"
    } else if (user_said.toLowerCase().includes("plant") && state === "initial") {
      response = "Hello human!";
      state = "initial"
    } 
      else if (user_said.toLowerCase().includes("practice") && state === "initial") {
      response = "What type of questions you want to practice?";
      state = "selfRepair"
    } else if (user_said.toLowerCase().includes("behavioral")
      || user_said.toLowerCase().includes("yes") && state === "ABByes-b"
      || user_said.toLowerCase().includes("behavioral") && state === "ABByes-b") {
      response = "Okay! Let's see........" + bq[Math.floor(Math.random() * bq.length)];
      state = "afterResult"
    } else if (user_said.toLowerCase().includes("oddball")
      || user_said.toLowerCase().includes("yes") && state === "ABByes-o"
      || user_said.toLowerCase().includes("oddball") && state === "ABByes-o") {
      response = "Okay! Let's see........" + oddballsQuestions[Math.floor(Math.random() * oddballsQuestions.length)];
      state = "afterResult"
    } else if (user_said.toLowerCase().includes("oq") && state === "selfRepair") {
      response = "Do you mean oddball questions?";
      state = "ABByes-o"
    } else if (user_said.toLowerCase().includes("bq") && state === "selfRepair") {
      response = "Do you mean behavioral questions?";
      state = "ABByes-b"
    } else if (user_said.toLowerCase().includes("no") && state === "ABByes-o"
      || user_said.toLowerCase().includes("no") && state === "ABByes-b" ) {
      response = "What type of questions you want to practice with me?";
      state = "selfRepair"
    } else if (user_said.toLowerCase().includes("no")  && state === "selfRepair"
      || user_said.toLowerCase().includes("i don't know") && state === "selfRepair"
      || user_said.toLowerCase().includes("not ready") && state === "selfRepair") {
      response = "No worries. Let me know when you are ready.";
      state = "selfRepair";
    } else if (user_said.toLowerCase().includes("thanks") && state === "afterResult"
      || user_said.toLowerCase().includes("thank") && state === "afterResult") {
      response = "Anytime!";
      state = "initial"
    } else if (user_said.toLowerCase().includes("anxious")) {
      response = "be yourself! You rock.";
    } else if (user_said.toLowerCase().includes("relax")) {
      response = "You know what? Take a nap. I always do that before any interviews. Seriously.";
    } else if (user_said.toLowerCase().includes("bye")) {
      response = "Good bye! Good luck.";
      state = "initial"
    } else {
      response = "ummmmmmmmmmmmmm....pardon me? try something else?";
    }
    return response;
  }

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
