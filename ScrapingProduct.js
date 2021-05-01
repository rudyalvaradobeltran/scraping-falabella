const cheerio = require('cheerio');

class ScrapingProduct {
    async getDataFromPage(page) {
        console.log('Loading html content');
        await page.reload();
        const html = await page.evaluate(() => document.body.innerHTML);
        const load = cheerio.load(html);
        console.log('Loading data from html');
        const product = {};
        product.name = this.getProductName(load);
        product.price = this.getProductPrice(load);
        product.priceBefore = this.getProductPriceBefore(load);
        product.discount = this.getProductDiscount(
            product.price,
            product.priceBefore,
        );
        product.specifications = this.getProductSpecifications(load, html);
        product.images = this.getProductImages(load, html);
        product.breadcrumbs = this.getProductBreadcrumbs(load, html);
        console.log(product);
    }

    getProductName(load) {
        return load('.product-name').text().trim();
    }
    
    getProductPrice(load) {
        let price = load('li[data-internet-price]')
            .first()
            .text()
            .replace(/\s/g, '')
            .replace(/\D/g, '');
        if (price === '') {
          price = load('li[data-event-price]')
            .first()
            .text()
            .replace(/\s/g, '')
            .replace(/\D/g, '');
        }
        return parseInt(price);
    }
    
    getProductPriceBefore(load) {
        const priceBefore = load('li[data-normal-price]')
            .first()
            .text()
            .replace(/\s/g, '')
            .replace(/\D/g, '');
        return priceBefore ? parseInt(priceBefore) : 0;
    }
    
    getProductDiscount(price, priceBefore) {
        return priceBefore ? this.getDiscount(price, priceBefore) : 0;
    }
    
    getProductSpecifications(load, html) {
        const specifications = [];
        load('.specification', html)
            .find('section > div')
            .last()
            .find('table > tbody > tr')
            .map(function (index, element) {
                specifications.push({
                    name: cheerio(element).find('td').first().text(),
                    value: cheerio(element).find('td').last().text(),
                });
            });
        return specifications;
    }
    
    getProductImages(load, html) {
        const images = [];
        load('.image-wrapper', html)
            .find('div > div')
            .map(function (index, element) {
                const image = cheerio(element).find('img').attr('src');
                if (image) images.push(image);
            });
        if (images.length < 1) {
            load('.product-specifications-column', html)
            .find('div > div')
            .map(function (index, element) {
                const image = cheerio(element).find('img').attr('src');
                if (image) images.push(image);
            });
        }
        return images;
    }
    
    getProductBreadcrumbs(load, html) {
        const breadcrumbs = [];
        load('.breadcrumb', html)
        .find('li')
        .map(function (index, element) {
            const breadcrumb = cheerio(element).find('a').text();
            if (breadcrumb) breadcrumbs.push(breadcrumb);
        });
        return breadcrumbs;
    }
    
    getDiscount(price, priceBefore) {
        return parseInt((((priceBefore - price) / priceBefore) * 100).toFixed(0));
    }
}

exports.ScrapingProduct = ScrapingProduct;