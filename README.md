Udacity - Front-End Web Programming
Project 3
By Benedetto Lo Giudice

frontend-nanodegree-arcade-game
===============================
How to:
There are various ways to execute this game depending on your configuration.
One way to execute it is *NOT* loading it via the browser.
The simplest way is to execute the SimpleHTTPServer via python:
- download the game from github
- cd into the game directory
- execute python -m SimpleHTTPServer
- check for the message "Serving HTTP on 0.0.0.0 8000 ..." 
- open your browser and use the url: http://localhost:8000 
- if the port number used by the HTTP server is different, change
  accordingly in the URL.

To play the game:
- use arrows to move your character. Avoid the enemies dashing from left to right over the rocky tiles.
- The grass tiles are safe.
- Catch the stars to earn points.
