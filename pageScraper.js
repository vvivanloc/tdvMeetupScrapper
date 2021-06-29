const scraperObject = {
  url: ` file:///${process.env.PWD}/input/Rencontres%20%E2%80%93%20TDV%20Toulouse%20dataviz%20%E2%80%93%20analyse%20et%20visualisation%20de%20donn%C3%A9es%20%E2%80%93%20open%20data.html`,
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);

    // Wait for the required DOM to be rendered
    await page.waitForSelector(".event-venue");

    // Get the cards
    let result = await page.evaluate(() => {
      let cards = [
        ...document.querySelectorAll("div.post-area.card.event-past"),
      ];

      return cards.map((card) => {
        let date = card.querySelector(".date").innerText.replaceAll("\n", " ");

        let title = [...card.querySelectorAll(".content h3")]
          .map((el) => (el ? el.innerHTML : ""))
          .join(" ")
          .replace(/\#\d/, "")
          .trim();

        let description = [...card.querySelectorAll("div.description")]
          .map((el) => (el ? el.innerHTML.replaceAll("\n", "") : ""))
          .join(" ");

        //debugger

        return { date: date, title: title, description: description };
      });
    });

    await browser.close();

    //console.log(result);

    // reverse order, add some id and convert values from html to markdown to be CVS friendly

    result = result.reverse();

    let TurndownService = require("turndown");
    let turndownService = new TurndownService();

    let meetupId = 0;
    result = result.map((item) => {
      meetupId++;
      const titleMd = item.title ? turndownService.turndown(item.title) : "";
      let descriptionMd = item.description
        ? turndownService.turndown(item.description)
        : "";
      descriptionMd = descriptionMd.replace(/.*Description.*\s\n/g, "");
      return {
        meetupid: meetupId,
        date: item.date,
        title: titleMd,
        description: descriptionMd,
      };
    });

    fs = require("fs");

    const outputFilename = "output/meetups.json";
    fs.writeFile(outputFilename, JSON.stringify(result), (err) => {
      if (err) throw err;
      console.log(`The json ${outputFilename} file has been saved!`);
    });
  },
};

module.exports = scraperObject;
