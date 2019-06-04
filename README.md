# googledictionary-ss
A nifty node app for getting google dictionary DOM element screenshot



GET

/api/search?word=<Search_Word>


I Hosted this app on heroku at
https://googledictionary.herokuapp.com/api/search?word=<Search_Word>

List of words in search history can be accessed at
https://googledictionary.herokuapp.com/api/list


## Setting Up
set up a Redis instance, and add its URL in environment of Heroku at REDIS_URL
set up a Cloudinary instance and add CLOUDINARY_CLOUD_NAME , CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment.


