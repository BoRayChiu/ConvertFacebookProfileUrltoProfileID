const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: "new", 
        slowMo: 100,
        args: [
        "-no-sandbox",
        "--disable-extensions"
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36");
    await page.goto("https://commentpicker.com/find-facebook-id.php", {
        waitUntil: "load",
        timeout: 0
    });
    // For example
    let profile_urls = [
        "https://www.facebook.com/zuck",
        "https://www.facebook.com/saverin"
    ]    
    const new_url = [];
    for(let url of profile_urls) {
        new_url.push(await TransToID(page, url));
    }
    console.log(new_url);
    await page.close();
    await browser.close();
})();

async function TransToID(context, profile_url) {
    const input_selector = "#js-facebook-link";
    const captha_x_selector = "#captcha-x";
    const captha_y_selector = "#captcha-y";
    const captha_selector = "#captcha";
    const search_selector = "#js-start-button";
    const copy_selector = "#js-results > svg";
    const reslt_selector = "#js-results";
    let id_url = "";
    await context.$eval(input_selector, el => el.value = "");
    try {
        await context.waitForSelector(input_selector);
        await context.type(input_selector, profile_url, {delay: 80});
        const ans = (parseInt(await GetTextContent(context, captha_x_selector)) + parseInt(await GetTextContent(context, captha_y_selector))).toString();
        await context.type(captha_selector, ans, {delay: 80});
        await context.click(search_selector);
        await context.waitForSelector(copy_selector);
        id_url = await GetTextContent(context, reslt_selector);
    }
    catch(e) {
        console.log(e);
    }
    return id_url;
}

async function GetTextContent(context, selector) {
    try {
        await context.waitForSelector(selector);
        const result = await context.$eval(selector, el => el.textContent);
        return result;
    }
    catch(e) {
        console.log(e);
        return "";
    }
}