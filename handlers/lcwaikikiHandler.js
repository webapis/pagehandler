async function handler(page) {
    
    await page.waitForSelector('.product-grid .product-card')
    const data = await page.evaluate(()=>{
        const items =window.catalogModel.CatalogList.Items
        return items.map(item=>{
            const { DefaultOptionImageUrl:imageUrl,
                                 OldPrice:priceOld,
                                    Price:priceNew,
                            DiscountRatio:discPerc,
                            ModelUrl,
                            ProductDescription:title,
                            CampaignBadges 
                 } =item
            const Basdisk =CampaignBadges && CampaignBadges.length>0 && CampaignBadges[0]
            return {
                    title,
                    priceOld:priceOld ===priceNew?null:priceOld.replace('TL','').trim(),
                    priceNew:priceNew.replace('TL','').trim(),
                    priceBasket:Basdisk && Basdisk.DiscountedPrice ,
                    basketDiscount:Basdisk && Basdisk.DiscountRate,
                    imageUrl,
                    link:'https://www.lcwaikiki.com/'+ModelUrl,
                    timestamp: Date.now(),
                    plcHolder:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 640'%3E%3Cpath d='M0 0h480v639.4H0z' fill='%23f2f2f2'/%3E%3Cpath d='M235 303.8l-9 30.8h-9.5l-6.3-23.7-6.4 23.7h-8.7l-9.8-30.8h8l6.5 22.8 6-22.8h9l6.2 22.8 6.1-22.8zm25.3 24c0 2.3.5 4.4.7 6.8h-7.3v-.2l-.1-14h-4.2c-3.6 0-9 .6-9 5.4 0 2.6 2.3 3.7 5.2 3.7a6.8 6.8 0 005.6-2.7l.4-.6v6a11.6 11.6 0 01-8 3.2c-5.5 0-10.9-3.2-10.9-9.1a9 9 0 015.4-8.9 24.6 24.6 0 0110.3-1.7h4.5c0-5-2.2-6.7-7-6.7-4.2.3-8.3 1.6-11.8 4l2-7.5c3.4-1.5 7-2.3 10.8-2.4 9.4 0 13.3 4 13.3 13v4l.1 7.7m3.4-23.9h8.1v30.8h-8.1zm12 0h8.1v12.4l9.8-12.4h9.6l-11.6 13.8 12.8 17h-10.2L284 319.7l-.2 14.8h-8zm30.2 0h8.1v30.8H306zm11.8 0h8v12.4l9.9-12.4h9.5l-11.6 13.8 12.9 17H336l-10.2-14.9-.1 14.8h-8.1zm30.5 0h8.1v30.8h-8.2zm-224.5 0h8.2v23.8h13.4v7h-21.6zm53.6 7.4l.4 1.8h-7.8a9 9 0 00-.8-1.5 5.4 5.4 0 00-.8-1 8.2 8.2 0 00-6-2c-2.5-.1-4.9 1-6.5 2.8a12.3 12.3 0 00-2.3 8 10.8 10.8 0 002.5 7.8c1.6 1.8 3.9 2.7 6.3 2.6a7.7 7.7 0 006-2.2 6.3 6.3 0 001.6-3h7.7a12 12 0 01-4.9 7.7c-3 2.2-6.6 3.3-10.3 3.1a17 17 0 01-12.3-4.2c-3-3.2-4.7-7.4-4.4-11.8 0-5.4 1.7-9.6 5-12.5 3.2-2.6 7.2-4 11.3-3.8 6 0 10.5 1.7 13.4 5.1a12.2 12.2 0 011.9 3.2' fill='%23b5b7b9'/%3E%3C/svg%3E",
                    discPerc:discPerc===0?null:discPerc,
                    hizliGonderi:null,
                    kargoBedava:null
                }
        }).filter(f => f.imageUrl !== null)
    })

      console.log('data length_____', data.length)
  
      return data
}

async function getUrls(page) {
    const param ='?PageIndex='
    await page.waitForSelector('.paginator__info-text-product-count')

    const firstUrl =await page.url()
    
    const productCount = await page.$eval('.paginator__info-text-product-count', element => parseInt(element.innerText))
    const totalPages = Math.ceil(productCount / 96)
    const pageUrls = []
    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {
        const url = `${firstUrl}${param}${i}`
        debugger;
        console.log('i', i)
        if (pagesLeft > 0) {
            pageUrls.push(url)
            --pagesLeft
        }
    }
    return pageUrls
}
module.exports = { handler, getUrls }