const scraperObject = {
  url:
    ` file:///${process.env.PWD }/Rencontres%20%E2%80%93%20TDV%20Toulouse%20dataviz%20%E2%80%93%20analyse%20et%20visualisation%20de%20donn%C3%A9es%20%E2%80%93%20open%20data.html`,
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
          .join(" ")
          .replaceAll("<b>Description :</b><br>", "");

        //debugger
        return [date, title, description];
      });
    });
    console.log(result);
    fs = require('fs');
    
   /* const outputFilename="rencontres.csv";
    fs.writeFile( outputFilename, result.map(row=>row.map(col=>"\""+col+"\"").join(";")).join("\n"),(err) => {
        if (err) throw err;
        console.log(`The csv ${outputFilename} file has been saved!`);
      });*/
  },
};

module.exports = scraperObject;
