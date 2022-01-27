const puppeteer = require('puppeteer')





async function scrapeDefacto() {
    try {

        const { defactoHandler, defactoGetUrls } = require('./defactoHandler')
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.goto('https://www.defacto.com.tr/en-sevilenler-kadin?page=1')

        await defactoHandler(page)
        debugger;
        const promises = []
        const pageUrls = await defactoGetUrls(page,'https://www.defacto.com.tr/en-sevilenler-kadin?page=')
        debugger;
        pageUrls.forEach(url => {
            promises.push((async () => {
                const page = await browser.newPage()
                await page.setRequestInterception(true);
                page.on('request', req => {
                    const resourceType = req.resourceType();
                    if (resourceType === 'image') {
                        req.respond({
                            status: 200,
                            contentType: 'image/jpeg',
                            body: ''
                        });


                    } else {
                        req.continue();
                    }
                });
                await page.goto(url)
                return page
            })())

        })

        const pages = await Promise.all(promises)
        const handlers =[]
  
        for (let page of pages) {
            handlers.push((async ()=>{
            return    await defactoHandler(page)
            })())
          
        }

        await Promise.all(handlers)
        debugger;
    } catch (error) {
        debugger;
    }
}


async function scrapeKoton() {
    try {

        const { kotonHandler, kotonGetUrls } = require('./kotonHanldler')
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.goto('https://www.koton.com/tr/kadin/giyim/elbise/c/M01-C02-N01-AK103')

        await kotonHandler(page)
        debugger;
        const promises = []
        const pageUrls = await kotonGetUrls(page)
        debugger;
        pageUrls.forEach(url => {
            promises.push((async () => {
                const page = await browser.newPage()
                await page.setRequestInterception(true);
                page.on('request', req => {
                    const resourceType = req.resourceType();
                    if (resourceType === 'image') {
                        req.respond({
                            status: 200,
                            contentType: 'image/jpeg',
                            body: ''
                        });


                    } else {
                        req.continue();
                    }
                });
                await page.goto(url)
                return page
            })())

        })

        const pages = await Promise.all(promises)
        const handlers =[]
  
        for (let page of pages) {
            handlers.push((async ()=>{
            return    await kotonHandler(page)
            })())
          
        }

        await Promise.all(handlers)
        debugger;
    } catch (error) {
        debugger;
    }
}

scrapeDefacto()