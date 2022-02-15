const puppeteer = require('puppeteer')
const {uploadToMongodb}=require('./uploadToMongodb')
let START_URL = '';
let URL_PARAM = '';
const HANDLER = process.env.MARKA


debugger;
switch (HANDLER) {
    case 'koton':
        START_URL = 'https://www.koton.com/tr/kadin/giyim/elbise/c/M01-C02-N01-AK103'
        URL_PARAM = ''
        break;
    case 'defacto':
        START_URL = 'https://www.defacto.com.tr/en-sevilenler-kadin?page=1'
        URL_PARAM = 'https://www.defacto.com.tr/en-sevilenler-kadin?page='
        break;
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
    case 'machka':
        START_URL = 'https://www.machka.com.tr/elbise-modelleri-c_828'
        URL_PARAM = ''
        debugger;
        break;
    default:
}








async function scrape() {
    try {

        const { handler, getUrls } = require(`./handlers/${HANDLER}Handler`)
debugger;
        const browser = await puppeteer.launch({ headless: false, timeout: 120000 })
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
        await page.goto(START_URL, { timeout: 120000 })

        await handler(page)

        const promises = []
        const pageUrls = await getUrls(page, URL_PARAM)
        debugger;
        pageUrls.length > 0 && pageUrls.forEach(url => {
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
                await page.goto(url, { timeout: 0 })
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

    const datas =    await Promise.all(handlers)
    const merged =datas.flat()
   await uploadToMongodb({data:merged,colName:HANDLER})
        debugger;
    } catch (error) {
        debugger;
    }
}

scrape()