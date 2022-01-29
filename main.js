const puppeteer = require('puppeteer')

let START_URL = '';
let URL_PARAM = '';
const HANDLER = process.env.HANDLER
debugger;
switch (HANDLER) {
    case 'boyner':
        START_URL = 'https://www.boyner.com.tr/kadin-elbise-modelleri-c-100101'
        URL_PARAM = '/?dropListingPageSize=90&orderOption=Editor'
        break;
    case 'lcwaikiki':
        START_URL = 'https://www.lcwaikiki.com/tr-TR/TR/kategori/kadin/elbise-c46'
        URL_PARAM = '?PageIndex='
        break;
    case 'ipekyol':
        START_URL = 'https://www.ipekyol.com.tr/indirim-50/giyim/elbise-modelleri/?ps=1000'
        URL_PARAM = ''
        debugger;
        break;
    default:
}




async function scrapeDefacto() {
    try {

        const { defactoHandler, defactoGetUrls } = require('./defactoHandler')
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.goto('https://www.defacto.com.tr/en-sevilenler-kadin?page=1')

        await defactoHandler(page)
        debugger;
        const promises = []
        const pageUrls = await defactoGetUrls(page, 'https://www.defacto.com.tr/en-sevilenler-kadin?page=')
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
        const handlers = []

        for (let page of pages) {
            handlers.push((async () => {
                return await defactoHandler(page)
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
        const handlers = []

        for (let page of pages) {
            handlers.push((async () => {
                return await kotonHandler(page)
            })())

        }

        await Promise.all(handlers)
        debugger;
    } catch (error) {
        debugger;
    }
}

async function scrape() {
    try {

        const { handler, getUrls } = require(`./${HANDLER}handler`)

        const browser = await puppeteer.launch({ headless: false,timeout:120000 })
        const page = await browser.newPage()
debugger;           

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
        await page.goto(START_URL,{timeout:120000})

        await handler(page)

        const promises = []
        const pageUrls = await getUrls(page, URL_PARAM)
        debugger;
        pageUrls.length>0 &&  pageUrls.forEach(url => {
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
                await page.goto(url,{timeout:0})
                return page
            })())

        })

        const pages = await Promise.all(promises)
        const handlers = []

        for (let page of pages) {
            handlers.push((async () => {
                return await handler(page)
            })())

        }

        await Promise.all(handlers)
        debugger;
    } catch (error) {
        debugger;
    }
}

scrape()