import scrapy
from scrapy.http import Response, Request


class SpiderSpider(scrapy.Spider):
    name = "spider"
    allowed_domains = ["florist.ca"]
    start_urls = ["https://florist.ca"]

    # def parse(self, response):
    #     pass

    def parse(self, response: Response):
        product_urls = response.xpath(
            "//div[@class='row product']/div/h3/a/@href"
        ).getall()
        for url in product_urls:
            yield Request(url, callback=self.parse_product)
        # or shortcut in scrapy >2.0
        # yield from response.follow_all(product_urls, callback=self.parse_product)
    
    def parse_product(self, response: Response):
        print(response)