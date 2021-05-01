const puppeteer = require('puppeteer');
const { ScrapingProduct } = require('./ScrapingProduct');

class Scraping {
    constructor(){
        this.categories = [
            'https://www.falabella.com/falabella-cl/collection/ofertas-mujer-v2',
            'https://www.falabella.com/falabella-cl/collection/ofertas-ninos-y-bebes-v2',
            'https://www.falabella.com/falabella-cl/collection/ofertas-accesorios-v2',
            'https://www.falabella.com/falabella-cl/collection/ofertas-hombre-v2',
            'https://www.falabella.com/falabella-cl/collection/ofertas-belleza-v2',
            'https://www.falabella.com/falabella-cl/collection/ofertas-hogar-2fmascotas-v2',
            'https://www.falabella.com/falabella-cl/collection/outlet-ver-todo-electro'
        ];
        this.timeout = 0;
    }

    async configureBrowser(browser, url){
        console.log('Loading url: '+url);
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(this.timeout); 
        await page.goto(url);
        await page.click('.layout_grid-view');
        await page.waitForSelector('.product-name');
        return page;
    }

    async start(){
        try{
            const scrapingProduct = new ScrapingProduct();
            await Promise.all(this.categories.map(async (url) => {
                const browser = await puppeteer.launch();
                let page = await this.configureBrowser(browser, url);
                await scrapingProduct.getDataFromPage(page);
                await browser.close();
            }));
        }catch(error){
            console.log(error);
        }
    }
}

exports.Scraping = Scraping;