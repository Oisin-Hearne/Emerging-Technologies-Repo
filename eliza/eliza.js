testString = "I am eating an orange."

// This function takes in a string, and using the "reflect" dict, switches the context of it.
// For example, "I like you" becomes "You like me".

// The reflect dict is directly from the notes [1], with added conjugates.
reflect = {
    "i": "you",
    "me": "you",
    "my": "your",
    "am": "are",
    "you": "i",
    "your": "my",
    "yours": "mine",
    "are": "am",
    "i'm": "you're",
    "i'd": "you'd",
    "i've": "you've",
    "myself": "yourself",
    "yourself": "myself",
}

function reflectString(text) {
    reflectedWords = "";
    wordList = text.toLowerCase().split(" "); // [2]

    // Adds the reflection of a word to reflectedWords, if it's in there.
    // If not, just adds the word itself.
    wordList.forEach(word => {
        if(word in reflect) {
            reflectedWords += reflect[word]+" "; // [3]
        }
        else {
            reflectedWords += word+" ";
        }
    });
    
    return reflectedWords.trim();
}

// This is an Object containing several responses for ELIZA to use.
/* NOTE: This was generated from ChatGPT, with the following prompts:
    "Hello, can you please generate an Object containing a good amount of responses for an ELIZA chatbot?",
    "Can you instead use patterns, like "hello|hi|hey" for the keys of the object?
     So that a response can be selected by looking at the user's input for certain keywords."

    I then added to this using some of the regex patterns from the notes [1].
*/
const elizaPatterns = {
    // Greeting patterns
    "hello|hi|hey": [
      "Hello! How can I assist you today?",
      "Hi there! What brings you here today?",
      "Greetings! How are you feeling right now?",
      "Hello! What's on your mind today?"
    ],
  
    // Farewell patterns
    "bye|goodbye|see you": [
      "Goodbye, it was nice talking to you!",
      "Take care! Hope to chat with you again soon.",
      "Goodbye for now, feel free to come back anytime.",
      "It was great talking with you. Farewell!"
    ],
  
    // Emotion patterns
    "happy|glad|joyful": [
      "I'm glad to hear you're feeling happy!",
      "That's wonderful! What made you feel this way?",
      "It sounds like you're in a good mood. Care to share more?",
      "I'm happy for you! What's bringing you so much joy?"
    ],
    
    "sad|down|unhappy|not happy|upset": [
      "I'm sorry you're feeling down. Do you want to talk about it?",
      "It seems like you're having a tough time. Would you like to share what's bothering you?",
      "I can sense some sadness. What's been weighing on your heart?",
      "I'm here to listen. What's making you feel this way?"
    ],
  
    "anxious|nervous|worried|scared": [
      "I hear you're feeling anxious. Can you tell me more about what's causing it?",
      "It sounds like you're worried. What's on your mind?",
      "I can understand how anxiety might feel overwhelming. Would you like to explore it?",
      "It's okay to feel anxious sometimes. Do you want to talk about what's going on?"
    ],
  
    "angry|frustrated|mad|furious": [
      "It seems like you're frustrated. What's going on?",
      "I can feel the anger in your words. What's triggering that for you?",
      "You sound upset. Do you want to talk about it?",
      "I hear your frustration. What's been bothering you?"
    ],

    "(.*)mother|father|family|parent(.*)": [
        "Tell me more about your family.",
        "How does that make you feel about your family?",
        "What role does your family play in your thoughts?"
    ],

    "(.*)I need (.*)": [
        "Why do you need {1}?",
        "Would getting {1} really help you?",
        "What if you didn't need {1}?"
    ], 

    "(.*)I am (.*)": [
        "Why do you think you are {1}?",
        "How long have you felt that way?",
        "What made you feel like you're {1}?"
    ],
  
    // Offering advice
    "help|advice|suggestion": [
      "Have you considered taking a step back and looking at things from a different angle?",
      "Sometimes it helps to talk things through. What do you think might help you feel better?",
      "What do you think would make the situation easier to handle?",
      "Taking small steps towards solving the problem might help. What small step could you take today?"
    ],
  
    // Resort to this if no other pattern matches.
    "(.*)": [
      "Tell me more about that.",
      "I see. What else is on your mind?",
      "What do you think is the most important thing here?",
      "I'm curious—what else are you thinking?",
      "Sorry, I'm not sure I follow. Could you clarify?",
      "I didn't quite get that. Can you explain it again?",
      "I'm having trouble understanding. Could you rephrase that for me?",
      "I'm a little confused. Could you give me more context?"
    ]
};

// This function uses the patterns and reflect function to generate a response, searching for a match
// in the patterns to make it seem as though the chatbot is listening to the user.
// This is adapated from the python code in [1].
function generateResponses(input) {
    //Remove only periods and commas, apostrophes and other special characters can stay, but sentence structures
    //can mess with detected words.
    sanitizedInput = input.replaceAll(/[.,]/g, "");
    responses = []

    Object.entries(elizaPatterns).forEach(pattern => {

        regpattern = new RegExp(pattern[0], "gi") //[5]
        match = sanitizedInput.match(regpattern)
        parts = regpattern.exec(sanitizedInput)

        // If a match is found, generate a response randomly from the group.
        //If applicable, insert a reflected string from the user input. This is for cases with "I need" and "I am".
        if(match) {
            response = pattern[1][Math.floor(Math.random()*pattern[1].length)]; //[6]
            if(parts[2]) {
              response = response.replace("{1}", reflectString(parts[2]))
            }

            responses.push(response)
        }
    });

    return responses
}

// This code is for interacting with the HTML interface and was heavily adapted from a script provided by
// ChatGPT in the same prompt. The code provided was largely static, so it was adapted to use these methods.

document.getElementById("sendButton").addEventListener("click", sendMessage) //Using eventlistener because onclick was being stubborn.

function sendMessage() {
  userInput = document.getElementById("userInput").value.trim()
  chatBox = document.getElementById("chatWindow")
  
  //Creates a new div for the user/bot messages and appends it to the chatbox.
  if(userInput) {
    //Add User Message
    message = document.createElement("div");
    message.textContent = userInput;
    message.className = "user-message message"
    chatBox.appendChild(message)
    chatBox.scrollTop = chatBox.scrollHeight

    //Add Bot Message
    message = document.createElement("div");
    message.textContent = generateResponses(userInput)[0]
    message.className = "bot-message message"
    chatBox.appendChild(message)
    chatBox.scrollTop = chatBox.scrollHeight
  }

  document.getElementById("userInput").value = "";
}

//Eventlistener for detecting if the user presses the enter key in the userInput box. If they do, send the message.
var enter = document.getElementById("userInput");
enter.addEventListener("keydown", function (e) { // [7]
  if (e.code === "Enter") {
    sendMessage()
  }
});


/* References:
 [1] Eliza Notes                  https://github.com/ianmcloughlin/2425_emerging_technologies/blob/main/03_eliza.ipynb
 [2] JavaScript String Methods    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#instance_methods
 [3] JavaScript Objects           https://www.w3schools.com/js/js_objects.asp
 [4] Regex in Javascript          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
 [5] String to RegExp             https://stackoverflow.com/a/874722
 [6] Randomly select from Array   https://stackoverflow.com/a/5915122
 [7] Eventlisteners in Javascript https://stackoverflow.com/a/16011365
 */