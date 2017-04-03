# Assignment 8


1. Playing with TTS:

One way to make a conversation livelier, express personality and emotion, is to vary the voice. In this homework you will experiment with various characterics of the voice syntehesis.

1.1 Watch this introduction to Text-to-Speech technology:
ttps://www.youtube.com/watch?v=xzL-pxcpo-E

1.2 Play with varying voice parameters using this example:
http://codepen.io/matt-west/full/wGzuJ

You can read the deails about this example and TTS API in general here: 
http://blog.teamtreehouse.com/getting-started-speech-synthesis-api

1.3 Examine the attached verbal.js. The modifications I made are between lines 77 and 107. Update your latest chatbot (HW6) with this chunk of code.

1.4 Run your chatbot from HW6 with various values for the following parameters:

  u.volume = 0.5 //between 0.1
  u.pitch = 2.0 //between 0 and 2
  u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Karen"; })[0]; //pick a voice

  To see the possible values of voices, in addition to "Karen", run your script with the debug console open.

  Pick the values of the parameters that you like the best with your conversational agent's character.

1.5 Upload the new version of your embodied conversational agent to a directory hw8 of your github. Include the link in your homework submission in Google Classroom.

2. The project teams that have not presented your progress update will present next Monday, April 3rd.
