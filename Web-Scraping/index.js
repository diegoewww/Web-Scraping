import puppeteer from "puppeteer";
import fs from "fs";

async function openWebPage() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 400 })
  const page = await browser.newPage()
  await page.goto("https://example.com")
  await browser.close()
}

// openWebPage()

async function captureScreenshot() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 400 })
  const page = await browser.newPage()
  await page.goto("https://example.com")
  await page.screenshot({ path: "example.png" })
  await browser.close()
}

// captureScreenshot()

async function navigateWebPage() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 400 })
  const page = await browser.newPage()
  await page.goto("https://quotes.toscrape.com")
  await page.click('a[href="/login"]')
  await new Promise((resolve) => setTimeout(resolve, 2000))
  await browser.close()
}
// navigateWebPage()

async function getDataFromWebPage() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 200 })
  const page = await browser.newPage()
  await page.goto("https://example.com")
  const result = await page.evaluate(() => {
    const title = document.querySelector("h1").innerText
    const description = document.querySelector("p").innerText
    const a = document.querySelector("a").innerText
    return {
      title,
      description,
      a,
    }
  })
  console.log(result);
  await browser.close()
}

// getDataFromWebPage()

async function handleWebPage() {
  const browser = await puppeteer.launch({headless: false, slowMo: 200})

  const page = await browser.newPage()
  await page.goto("https://quotes.toscrape.com")
  const data= await page.evaluate(()=>{
    const quotes = document.querySelectorAll(".quote")
    const data = [...quotes].map(quote =>{
      const title = quote.querySelector(".text").innerText
      const author = quote.querySelector(".author").innerText
      const tags = [...quote.querySelectorAll(".tag")].map(tag =>  tag.innerText  )
      return {
        title,
        author,
        tags  
      }
    })
    return data
  })
  console.log(data)
  fs.writeFile("quotes.json", JSON.stringify(data), (err) => {
    if (err) throw err
    console.log("Saved!")
  })

  await browser.close()
 
}
handleWebPage()
  


