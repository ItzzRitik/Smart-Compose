# Type Mate
### A Gmail Smart Compose Clone

**Type Mate** is a predictive text assistant plugin into [Quill Editor](https://quilljs.com/) to help save effort in composing long paragraphs while typing.
Smart compose feature in **Type Mate** offers a faster way to compose paragraphs, while avoiding typos and errors in grammar.
As a user types their paragraphs with Smart Compose enabled, suggestions are offered for the rest of the word or phrase.
The user either implements the suggestions or keeps on typing as they desire.

## Features

### Editor Toolbar
The editing toolbar is displayed where content can be added or edited in course sites, and provides access to commonly used functions such as:

- Format text.
- Insert/edit an image.
- Insert/edit a link.
- Paste content.
- Insert an emoticon.
- View and edit HTML.

### Smart Prediction
Smart compose feature in **Type Mate** offers a faster way to compose paragraphs, while avoiding typos and errors in grammar.
As a user types their paragraphs with Smart Compose enabled, suggestions are offered for the rest of the word or phrase.

#### Word Based Prediction
Word based prediction provides a list of words that are similar to the word the user is typing,
hence it might help the user to type the words correctly.
#### Sentence Based Prediction
Sentence based prediction provides a more natural feel to the typing experience by providing suggestions for the rest of the sentence,
rather than the word or the phrase. It is the default prediction mode in **Type Mate**.

## Algorithm
Suggestion Service is the core of **Type Mate**. It is responsible for providing the list of suggestions for the user to type.
It takes the sentence the user is typing and checks through the mock data of Reddit posts to find the most relevant words.

- Picks user's input from the text editor.
- Filter's out the most relevant part of the sentence based on the suggestion mode (Sentence Mode / Word Mode).
- For **Sentence Mode**, it picks the last sentence from the current caret position and saves it as **Search Token**.
- For **Word Mode**, it picks the last word from the current caret position and saves it as **Search Token**.
- Once the **Search Token** is picked, it searches through the moc data for sentences starting with the **Search Token**.
- If we get at least 5 matching sentences, algorithm will return the first 5 sentences.
- If we get less than 5 matching sentences, algorithm will search for the **Search Token** in between sentences.
- Once both the processes are done, it will sort and return the generated suggestions to the user in the form of dropdown suggestion.

