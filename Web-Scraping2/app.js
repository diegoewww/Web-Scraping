import { chromium } from "playwright"

async function getResultsFromGoogle(query,browser){

  const page = await browser.newPage()
  await page.goto('https://www.google.com/')
  await page.waitForSelector('textarea[name="q"]')
  await page.type('textarea[name="q"]', query)
  await page.keyboard.press('Enter')
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  const listadoResultados = await page.evaluate(()=>{
    let resultados = []
    // como aceder a un div que tiene como clase yuRUbf
    document.querySelectorAll('div[class="yuRUbf"] div span a').forEach((anchor,index)=>{
      resultados.push({
        index:index,
        text: anchor.innerText,
        url: anchor.href
      })
    })
    return resultados
  })
  return listadoResultados
}

// Visitar los resultados y extraer su informacion
async function visitResultAndGetContent(resultado, browser){
  const page = await browser.newPage()
  await page.goto(resultado.url)
  await page.waitForLoadState('domcontentloaded')
  const content = await page.evaluate(()=>{
    const rawText = document.querySelector('main')?.innerText || document.querySelector('body')?.innerText
    return rawText
  })

  return content
}

async function startScraping(query){
  const browser = await chromium.launch()
  const allTexts= []
  const listadoResultados = await getResultsFromGoogle(query, browser)
  //sincrono
  // listadoResultados.forEach(resultado =>{
  //   visitResultAndGetContent(resultado, browser)
  // })
  //asincrono
  for await (const resultado of listadoResultados) {
    const contenido = await visitResultAndGetContent(resultado, browser);
    allTexts.push(contenido)
  }

  console.log(allTexts)
  await browser.close()
}

let queryTerminal = process.argv.slice(2)[0];

startScraping(queryTerminal)

