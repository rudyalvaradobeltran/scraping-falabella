const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { Scraping } = require('./Scraping');

const scraping = new Scraping();
scraping.start();