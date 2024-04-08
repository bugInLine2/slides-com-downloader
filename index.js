const { firefox  } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const R = require('ramda');
const fs = require('fs');
const util = require('util');
var sizeOf = require('image-size');

const fsOpen = util.promisify(fs.open);
const fsWriteFile = util.promisify(fs.writeFile);
const fsClose = util.promisify(fs.close);
const TIMEOUT = 180000;

const args = process.argv.slice(2) || process.exit(1);
const run = async (link, pdfname) => {
  const linkElements = link.split('?');
  link = `${linkElements[0]}/fullscreen` + ( linkElements.length > 1 ? `?${linkElements[1]}` : '' );

  const browser = await firefox.launch();

  // Get number of mainslides
  const rootUrl = `${link}#/`;
  console.log('Getting number of main slides...');
  const urlMax = `${rootUrl}1000`
  const loadObj = await load(urlMax, browser);
  console.log(`${loadObj.slides} main slide(s) found.`);

  // Get array with subslides for every main slide
  let subSlides = [];
  const mainLoops = R.range(0, Number(loadObj.slides));
  const loadSubSlides = async (slide) => {
    const urlMainSlide = `${rootUrl}${slide+1}`;
    const urlSubMax = `${rootUrl}${slide+1}/1000`;

    // Starting threads some seconds apart
    const rand = Math.floor((Math.random()+0.3) * 30)+1;
    await sleep(rand*1000);

    const subLoadObj = await load(urlSubMax, browser);

    if(subLoadObj.redirectedUrl === urlMainSlide){
      subSlides[slide] = 0;
    } else {
      subSlides[slide] = subLoadObj.slides;
    }
  
    console.log(`Main slide ${slide+1} has ${subSlides[slide]} subslide(s).`);

    return subSlides;
  }
  await Promise.all(mainLoops.map(loadSubSlides));

  // Make Screenshots of each mainslide with every subslide
  const subLoops = R.range(0, Number(subSlides.length));
  const makeScreenshots = async (i) => {
    const mainSlide = i+1;
    const numberSubSlides = subSlides[i];

    // Starting threads some seconds apart
    const rand = Math.floor((Math.random()+0.3) * 30)+1;
    await sleep(rand*1000);

    console.info(`Downloading main slide: #${mainSlide}`);
    await loadScreenShot(`${rootUrl}${mainSlide}`, `slides/pngs/${mainSlide}.png`, browser);

    if(numberSubSlides > 0){
      for(let j=1; j<=numberSubSlides; j++){
        console.info(`Downloading subslide #${j} for main slide: #${mainSlide}`);
        await loadScreenShot(`${rootUrl}${mainSlide}/${j}`, `slides/pngs/${mainSlide}_${j}.png`, browser);
      }
    }
  }
  await Promise.all(subLoops.map(makeScreenshots));

  // Save all slide images into a PDF
  const pdfDoc = await PDFDocument.create();
  for(let i=0; i<subSlides.length; i++){
    let path = `slides/pngs/${i+1}.png`;
    addPageToPdf(path, pdfDoc);

    if(subSlides[i] > 0){
      for(let j=0; j<subSlides[i]; j++){
        path = `slides/pngs/${i+1}_${j+1}.png`;
        addPageToPdf(path, pdfDoc);
      }
    }
  }

  console.log('Saving slides to PDF.');
  const pdfBytes = await pdfDoc.save();
  await saveFile(`slides/${pdfname}`, pdfBytes);
}



const checkDownloadFolder = async () => {
  if (!fs.existsSync('slides/')) {
    fs.mkdirSync('slides/');
    fs.mkdirSync('slides/pngs');
    fs.rem
  } else {
    fs.readdirSync('slides/pngs').forEach(f => fs.rmSync(`slides/pngs/${f}`));
    if (fs.existsSync('slides/slides.pdf')) {
      fs.unlinkSync('slides/slides.pdf');
    }
  }
}

async function addPageToPdf(path, pdfDoc){
  const dimensions = sizeOf(path);
  const page = pdfDoc.addPage([dimensions.width, dimensions.height]);
  const png = fs.readFileSync(path);

  const img = await pdfDoc.embedPng(png);
  page.drawImage(img, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight()
  });
}

async function load(url, browser) {
  console.log('Getting number of slides by calling URL ' + url);
  const page = await browser.newPage();

  await page.goto(url, {timeout: TIMEOUT});
  await page.waitForSelector('.present', {timeout: TIMEOUT});

  const redirectedUrl = page.url();
  const slides = redirectedUrl.substring(redirectedUrl.lastIndexOf('/') + 1);
  page.close();

  return {slides: slides, redirectedUrl: redirectedUrl};
}

async function loadScreenShot(url, filename, browser){
  const page = await browser.newPage();
  await page.goto(url, {timeout: TIMEOUT});
  await page.waitForSelector('.present', {timeout: TIMEOUT});
  await page.screenshot({ path: filename, timeout: TIMEOUT });
  page.close();
}

async function saveFile(path, data) {
  return new Promise((async (resolve, reject) => {
    let fileToCreate;

    // Open the file for writing
    try {
      fileToCreate = await fsOpen(path, 'wx');
    } catch (err) {
      reject('Could not create new file, it may already exist');
      return;
    }

    // Write the new data to the file
    try {
      await fsWriteFile(fileToCreate, data);
    } catch (err) {
      reject('Error writing to new file');
      return;
    }

    // Close the file
    try {
      await fsClose(fileToCreate);
    } catch (err) {
      reject('Error closing new file');
      return;
    }

    resolve('File created');
  }));
};

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

checkDownloadFolder()


run(...args)
  .then(() => console.log('Done!'))
  .then(() => process.exit(0))
  .catch(console.error)