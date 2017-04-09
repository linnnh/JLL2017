var questions = [ 
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

var user_score = 0
var afinn = afinn_en;
var user_score_evaluation = "placeholder"

var user_word_count = 0
var word_count_evaluation = "placeholder"

var user_answer = "placeholder"
var user_answer_array = ["you have no answer......because, you haven't practiced...... hmm...... therefore......"];

var practiced_q = "placeholder"
var practiced_q_array = ["you haven't practiced!"];

var ramdon_question = "placeholder"



// // audio
// var audio = new Audio('close.mp3');
// function playSound() {
//     audio.play();
// }


function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);
    setEyeColor("gold");
    // speak("I am a demo text. Test my speed! Test my tune!")

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
      setEyeColor("white");
      // // Play sound effect, and delay 2.5s
      // setTimeout(playSound, 2500)


      var bot_response = decide_response(user_said)
      speak(bot_response)

      document.getElementById("txt").value = bot_response;

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
  var practice_re = /practice\s(.+)/i;  // creating a regular expression
  var practice_parse_array = user_said.match(practice_re) // parsing the input string with the regular expression

  // Counting numbers of user_said
  function WordCount(user_said) { 
    return user_said.split(" ").length;
  }
  var user_word_count = user_said.split(" ").length;
  console.log("# user_word_count: " + user_word_count);

  if (user_word_count > 10) {
    word_count_evaluation = "the length of your answer is just right!"
  } else {
    word_count_evaluation = "I am afraid your answer is a bit of short. You might want to speak more."
  }

  // sentiment analysis
  console.log(JSON.stringify(sentiment(user_said), undefined, 2))
  console.log(JSON.stringify(sentiment(user_said).score))
  var user_score = sentiment(user_said).score

  if (user_score > 0) {
    user_score_evaluation = "Your answer sounds positive!"
  } else if (user_score == 0) {
    user_score_evaluation = "Your answer sounds neutral."
  } else {
    user_score_evaluation = "Oh-oh. your answer sounds a little bit negative."
  }

  console.log("# user_score:" + user_score)
  console.log("# user_score_evaluation: " + user_score_evaluation)
  console.log("# user_said: " + user_said) 
  console.log("# practice_parse_array: " + practice_parse_array)

  var ramdon_question = questions[Math.floor(Math.random() * questions.length)]



  if (user_said.toLowerCase().includes("last time"))  {
    response = "You got it! Last time you practiced...... hmm....... " + practiced_q_array[practiced_q_array.length - 1]
    + "And...... this is your answer......" + user_answer_array[user_answer_array.length - 1]
    + "the total words are...." + user_word_count
    + "And your score is....." + user_score

    state = "initial"

  } else if (practice_parse_array && state === "initial"
    || user_said.toLowerCase().includes("practice") && state === "initial"
    || user_said.toLowerCase().includes("yes") && state === "waiting"
    || user_said.toLowerCase().includes("practice") && state === "waiting") {
    response = "Sounds good! Let's do this." 
    + "Let's see........"
    + "Hmmm...."
    + ramdon_question

    practiced_q_array.push(ramdon_question);
    console.log("## practiced_q_array: " + practiced_q_array.join(", "))

    state = "listening"

  } else if (user_said.toLowerCase().includes("hello plant") && state === "initial") {
    response = "Hello human! My job is being a plant...... and helping you practice interviews.... Are you ready?";
    state = "waiting"

  } else if (user_said.toLowerCase().includes("goodbye")
    || user_said.toLowerCase().includes("bye")) {
    response = "bye bye, bye bye!";
    state = "initial"

  } else if (user_said.toLowerCase().includes("no") && state === "waiting"
    || user_said.toLowerCase().includes("not ready") && state === "waiting")  {
    response = "It's alright. Let me know when you are ready!"
    state = "initial"

  } else if (state === "listening")  {
    user_answer_array.push(user_said);
    console.log("## user_answer_array: " + user_answer_array.join(", "))

    response = 
    "Excellent! Your score is: " + user_score + user_score_evaluation
    + "And...... your words are: " + user_word_count
    + word_count_evaluation
    + "And...... this is your answer: " + user_answer_array[user_answer_array.length - 1]
    + "And...... the question you just practiced is: " + practiced_q_array[practiced_q_array.length - 1]
    state = "initial"

  } else {
    response = "Ops, what did you say?";
  }

  return response;
  console.log("# response: " + response)
}

/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

printVoices();


/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  // console.log("Voices: ")
  // printVoices();

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
  u.volume = 1 //between 0.1
  u.pitch = 0.3 //between 0 and 2
  u.rate = 1 //between 0.1 and 5-ish //0.7 original
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Karen"; })[0]; //pick a voice

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
