const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()


app.get('/search',function(req,res){
	const puppeteer = require('puppeteer');
  (async() => {
    const browser = await puppeteer.launch({headless: true,args: ['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({width:1600,height:2071})
    const word = req.query.word;
    await page.goto('https://www.google.com/search?q=meaning+of+'+word+'&ie=utf-8&oe=utf-8&client=firefox-b-ab', {waitUntil: 'networkidle2'});
    await page.click('.iXqz2e.aI3msd.xpdarr.pSO8Ic.vk_arc');
    await page.waitFor(1000);
    let elems = await page.$$('.lr_dct_more_btn')
    for (let element of elems)
    	element.click();
    await page.waitFor(1000);
     const rect = await page.evaluate(selector => {
            const element = document.querySelector('.lr_dct_ent.vmod.XpoqFe');
            if (!element)
                return null;
            const {x, y, width, height} = element.getBoundingClientRect();
            return {left: x, top: y, width, height, id: element.id};});
    await page.waitFor(1000);
    const ssbuffer = await page.screenshot({
    	 	encoding: 'binary',
            clip: {
                x: rect.left-10,
                y: rect.top,
                width: rect.width+10,
				height: rect.height
            }
	});

    browser.close();
    res.contentType('image/jpeg');
	res.send(ssbuffer);
})();

})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))