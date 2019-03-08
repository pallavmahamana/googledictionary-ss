const express = require('express')
const path = require('path')
const mergeImg = require('merge-img')
const fs = require('fs')
const PORT = process.env.PORT || 5000
const app = express()

app.use(express.static('public'));

app.get('/search',function(req,res){
	const puppeteer = require('puppeteer');
  (async() => {
    const browser = await puppeteer.launch({headless: true,args: ['--no-sandbox','--disable-setuid-sandbox','--start-fullscreen']});
    const page = await browser.newPage();
    await page.setViewport({width:1920,height:1080, devicescalefactor:2});
    const word = req.query.word;
    await page.goto('https://www.google.com/search?q=meaning+of+'+word+'&ie=utf-8&oe=utf-8&client=firefox-b-ab', {waitUntil: 'networkidle2'});
    await page.type('input[class=dw-sbi]',word);
    await page.click('.dw-sb-btn');
    await page.click('.iXqz2e.aI3msd.xpdarr.pSO8Ic.vk_arc');
    await page.waitFor(1500);
    let elems = await page.$$('.lr_dct_more_btn')
    for (let element of elems)
    	element.click();
    await page.waitFor(1000);

    let elements = await page.$$('div.lr_dct_ent.vmod.XpoqFe');
    for (let i = 0; i < elements.length; i++) {
  try {
    // get screenshot of a particular element
    await elements[i].screenshot({path: `${i}.png`})
  } catch(e) {
    // if element is 'not visible', spit out error and continue
    console.log(`couldnt take screenshot of element with index: ${i}. cause: `,  e)
  }
}
    let imgFiles = Array.from(Array(elements.length).keys()).map(item=>item+'.png');

	mergeImg(imgFiles,{'direction':true}).then((img)=> {
		img.write('out.png',()=>{res.sendFile('out.png',{ root: __dirname});

	},
	imgFiles.forEach( function(element, index) {
    	fs.unlink(element,(err)=>{console.log(err)});
    },(err)=>{console.log(err)}))

	}
	)

    browser.close();

})();

})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))