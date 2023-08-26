import * as cheerio from 'cheerio';
import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import m3u8ToMp4 from 'm3u8-to-mp4';
import https from 'https';
import got from 'got';
puppeteer.use(StealthPlugin());

//import executablePath from 'puppeteer';

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const urlVideo= 'https://doods.pro/e/eig2j2jau71g';

export async function getPageVideo(pageUrl){
    const browser= await puppeteer.launch({ headless: true, executablePath: executablePath });
    const page = await browser.newPage() 
    await page.goto(pageUrl, {waitUntil: 'load'}); 
    /*await page.setViewport({width: 1080, height: 1024});
    await page.screenshot({
        path: 'screenshot.jpg',
    });*/
    const pageContent = await page.content();
    await browser.close();
    //let data = fs.createWriteStream('file.txt');
    //data.write(pageContent.toString());
    //data.end();
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

  function downloadM3U8(url, filename){
    const converter = new m3u8ToMp4();
    (async function() {
        await converter
          .setInputFile(url)
          .setOutputFile(filename)
          .start();
        console.log('File converted');
    })();
  }

  function downloadMP4(embed_url, video_url, filename){
    const downloadStream = got.stream(video_url, {headers: { "referer": embed_url }});
    const fileWriterStream = fs.createWriteStream(filename);
    downloadStream.on("downloadProgress", ({ transferred, total, percent }) => {
        const percentage = Math.round(percent * 100);
        console.error(`progress: ${transferred}/${total} (${percentage}%)`);
    }).on("error", (error) => {
        console.error(`Download failed: ${error.message}`);
    });
    fileWriterStream.on("error", (error) => {
        console.error(`Could not write file to system: ${error.message}`);
    }).on("finish", () => {
        console.log(`File downloaded to ${filename}`);
    });
    downloadStream.pipe(fileWriterStream);
}

  const p= await getPageVideo(urlVideo);
  const urlStream= downloadVideos(urlVideo, p);
  console.log(urlStream);
  downloadMP4(urlVideo, urlStream, 'video.mp4');
  