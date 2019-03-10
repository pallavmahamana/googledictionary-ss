const express = require('express')
const path = require('path')
const mergeImg = require('merge-img')
const pgp = require('pg-promise')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const redis = require('redis')
const https = require('https')


const PORT = process.env.PORT || 5000
const app = express()
const credis = redis.createClient(process.env.REDIS_URL)


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.use(express.static('public'));

app.get('/createlist', function(req, res) {
    const listname = req.query.name;



});


app.get('/list', function(req, res) {


});



app.get('/api/search', function(req, res) {

    credis.sismember("words", req.query.word, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            if (result) {
            	var cldnryImgUrl = 'https://res.cloudinary.com/' + process.env.CLOUDINARY_CLOUD_NAME + '/image/upload/' + req.query.word + '.png';
            	var file = fs.createWriteStream(res.query.word+'.png');
            	https.get(cldnryImgUrl,function(response){
            		response.pipe(file);
            		file.on('finish',function(){
            			res.set('Content-Type','image/png');
            			res.sendFile(res.query.word+'.png',{ root: __dirname });
            		})
            	});
            } else {
                const puppeteer = require('puppeteer');
                (async () => {
                    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-fullscreen'] });
                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080, devicescalefactor: 2 });
                    const word = req.query.word;
                    await page.goto('https://www.google.com/search?q=meaning+of+' + word + '&ie=utf-8&oe=utf-8&client=firefox-b-ab', { waitUntil: 'networkidle2' });

                    if ((await page.$$('input[class=dw-sbi]')).length == 0)
                        res.send('NOT FOUND')

                    await page.type('input[class=dw-sbi]', word);
                    await page.click('.dw-sb-btn');
                    await page.click('.iXqz2e.aI3msd.xpdarr.pSO8Ic.vk_arc');

                    let elems = await page.$$('.lr_dct_more_btn')

                    for (let element of elems)
                        await element.click();

                    await page.evaluate(() => {
                        document.querySelector('.sfbg.nojsv').remove();
                        document.querySelector('#tsf').remove();

                    });


                    let elements = await page.$$('div.lr_dct_ent.vmod.XpoqFe');
                    for (let i = 0; i < elements.length; i++) {
                        try {

                            // get screenshot of a particular element

                            await elements[i].screenshot({ path: `${i}.png` })
                        } catch (e) {
                            // if element is 'not visible', spit out error and continue
                            console.log(`couldnt take screenshot of element with index: ${i}. cause: `, e)
                        }
                    }
                    let imgFiles = Array.from(Array(elements.length).keys()).map(item => item + '.png');

                    mergeImg(imgFiles, { 'direction': true }).then((img) => {
                        img.write(word + '.png', () => {
                        		res.set('Content-Type','image/png');
                                res.sendFile(word + '.png', { root: __dirname });
                                cloudinary.uploader.upload(
                                    word + '.png', { public_id: word },
                                    function(error, result) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log(result.url);
                                            // add word to redis
                                            credis.sadd("words", word, function(err, res) {
                                                console.log(err, res);
                                            })

                                        }
                                    });


                            },
                            imgFiles.forEach(function(element, index) {
                                fs.unlink(element, (err) => { if (err) { console.log(err); } });
                            }, (err) => { if (err) { console.log(err); } }))

                    })
                    await page.close();
                    await browser.close();
                })();

            }
        }
    })
})

app.listen(PORT, () => console.log(`Listening on${ PORT }`))