import nest_asyncio; nest_asyncio.apply()  # This is needed to use sync API in repl
from playwright.sync_api import sync_playwright
from parsel import Selector

with sync_playwright() as pw:
    chrome = pw.chromium.launch(headless=False)
    context = chrome.new_context(viewport={"width": 900, "height": 600})
    page = chrome.new_page()
    # page.goto("https://twitch.tv")
    page.goto("https://florist.ca")
    # wait for first result to appear
    # page.wait_for_selector("div[data-target=directory-first-item]")
    page.wait_for_selector("div > section > section > main")
    # selectors examples
    # <div data-v-6f5a6eaa="" class="footer__main-info" bis_skin_checked="1"></div>
    # app > div > section > section > main
    
    # retrieve final HTML content
    print(page.content())

    page_html = page.content()

    sel = Selector(text=page_html)
    parsed = []
    for item in sel.xpath("//div[contains(@class,'tw-tower')]/div[@data-target]"):
        parsed.append({
            'title': item.css('h3::text').get(),
            'url': item.css('.tw-link::attr(href)').get(),
            'username': item.css('.tw-link::text').get(),
            'tags': item.css('.tw-tag ::text').getall(),
            'viewers': ''.join(item.css('.tw-media-card-stat::text').re(r'(\d+)')),
        })

