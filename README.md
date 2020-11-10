# weather-dashboard

## Deployed at: https://beatypete.github.io/weather-dashboard/

## Mockup:
![mockup](mockup.png)

Used both current weather api and opencall api even though they share some data. Current weather api allows a name to be entered into the url while uvindex and opencall require longitude and latitude, so i used current weather to fetch the lon and lat. Becuase it was redundant, the current section was excluded from the api fetch in opencall. 
The history only allows retrieved cities to be logged to make sure it can't be clogged with gibberish, and it only allows each succesful input to be logged once.
