# song2stream

**Get your current Spotify song to display in your stream.**

Hey Streamers, I've been building this small tool and some of you might find it useful. It creates a small webserver on your computer that serves up a page with your currently playing Spotify song. You can change the colors, position, font, etc... You can then put this page into your stream using BrowserSource in OSB.

## [Download Here](https://github.com/bobbylaporte/song2stream/releases/tag/0.0.1)

[Homepage](https://bobbylaporte.github.io/song2stream/)

![Demo GIF](https://media.giphy.com/media/xDoKwY1gZKlNK/giphy.gif)

[Demo Video](https://www.youtube.com/watch?v=3_9dBPEzlaU)

### 1. Download and launch song2stream

### 2. Make sure Spotify is running

### 3. View Overlay @ [http://localhost:1337](http://localhost:1337)

### 4. Adjust Settings

- *Google Font*: Use any [Google Font](https://fonts.google.com/) you want. Just Paste in the name, spaces and all.
- *Font Size*: The size of the song name in pixels. Artist name is automatically 65% the size.
- *Font Color*: Any HEX, RGB, or RGBA value. Artist name is automatically 65% opacity.
- *Align Text*: Left or Right
- *Background Color*: Color of the box. Any HEX, RGB, or RGBA value.
- *Animation Type*: Slide Left, Slide Right, Slide Up, Slide Down, Fade Out
- *Position X*: Align box to Left or Right of the window
- *Position Y*: Align box to Top or Bottom of the window
- *Auto Hide*: Hide box after X seconds. 0 never hides.


### 5. Get Overlay into OBS 
Create a BrowserSource and paste in the url http://localhost:1337.

Tip: Don't scale the BrowserSource window, but instead adjust it's Height and Width settings. Then adjust the Font Size in song2stream to shrink and grow the text and box.



### 6. Start the Chat Bot

Authorize the app to get your twitch channel and the 'song2stream' bot will idle in your chat. Viewers may use commands to get your current song information:

- !song - returns 'Track Title - Artist Name'
- !songlink - returns Link to song in Spotify
