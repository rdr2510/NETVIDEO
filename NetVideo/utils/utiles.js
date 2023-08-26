import * as cheerio from 'cheerio';
import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

import executablePath from 'puppeteer';

export async function getPageVideo(pageUrl){
    const browser= await puppeteer.launch({ headless: true, executablePath: executablePath.executablePath() });
    const page = await browser.newPage() 
    await page.goto(pageUrl, {waitUntil: 'load'}); 
    await page.setViewport({width: 1080, height: 1024});
    await page.screenshot({
        path: 'screenshot.jpg',
    });
    const pageContent = await page.content();
    await browser.close();
    let data = fs.createWriteStream('file.txt');
    data.write(pageContent.toString());
    data.end();
    return pageContent;
}

export function downloadVideos(pageUrl, pageContent) { // doodstream, uqload.co, vudeo.io, streamvid.net
    const $ = cheerio.load(pageContent);
    let url = '';
    if (pageUrl.includes('dood')){
        url = $('#video_player_html5_api').attr('src');
        if (!url){
            url= '';
        }
    } else if (pageUrl.includes('uqload.co') || pageUrl.includes('vudeo.io')){ 
        url = pageContent.split('sources: ["')[1].split('"')[0];
        if (!url){
           url= '';
        }
    } else if (pageUrl.includes('streamvid.net')){ // besoin converter m3u8 + ffmpeg
        url = pageContent.split('m3u8|master|urlset|')[1].split('|hls|sources|autoplay')[0];
        if (url){
            if (url.includes('|')){
                let urlArray = url.split('|');
                url = '';
                for (let i=urlArray.length-1; i>=0; --i){
                    url = url + urlArray[i];
                }
            }
            let id = '';
            if (pageContent.includes('vvplay|settings||png|')){
                id = pageContent.split('vvplay|settings||png|')[1].split('|fviews|data|')[0];  
            } else if (pageContent.includes('vvplay|settings|png||')){
                id = pageContent.split('vvplay|settings|png||')[1].split('|fviews|data|')[0];
            }
            url = 'https://' + id + '.streamvid.net/hls/' + url + '/index-v1-a1.m3u8';
        } else { // url blob video not found
            url= '';
        }
    }
    return url;
  }

  