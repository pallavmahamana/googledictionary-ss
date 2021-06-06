# googledictionary-ss
A nifty node app for getting google dictionary DOM element screenshot. It uses Puppeteer as headless browser to take screenshot of DOM element of google dictionary and then upload it to cloudinary, maintaining a Redis instance for all the already looked up words in memory. 


# Working

![Arch](https://raw.githubusercontent.com/pallavmahamana/googledictionary-ss/master/google%20ss.png)


Redis sitting in between makes thing faster as words which are looked up in past are already available in cloudinary storage.

__Method__:
**GET**

/api/search?word=<Search_Word>


I have hosted this app on heroku at
https://googledictionary.herokuapp.com/api/search?word=<Search_Word>

List of words in search history can be accessed at
https://googledictionary.herokuapp.com/api/list


## Setting Up
set up a Redis instance, and add its URL in environment of Heroku at REDIS_URL
set up a Cloudinary instance and add CLOUDINARY_CLOUD_NAME , CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment.


