// This function takes in a string, and using the "reflect" dict, switches the context of it.
// For example, "I like you" becomes "You like me".

// The reflect dict is directly from the notes [1].
reflect = {
    "i": "you",
    "me": "you",
    "my": "your",
    "am": "are",
    "you": "i",
    "your": "my",
    "yours": "mine",
    "are": "am",
    "i'm": "you're"
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
    
    return reflectedWords;
}

console.log(reflectString("I am eating an orange. What are you doing?"))



/* References:
 [1] Eliza Notes                  https://github.com/ianmcloughlin/2425_emerging_technologies/blob/main/03_eliza.ipynb
 [2] JavaScript String Methods    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#instance_methods
 [3] JavaScript Objects           https://www.w3schools.com/js/js_objects.asp
 [4]
 [5]

 */