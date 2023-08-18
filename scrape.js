//!PACKAGES
const axios = require("axios");
const cheerio = require("cheerio");
// ! cheerio is used to fetch selected data.
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const senderPhone = process.env.SENDER_PHONE;
const receiverPhone = process.env.RECEIVER_PHONE;
const baseUrl = process.env.BASE_URL;
const client = require("twilio")(accountSid, authToken);

// console.log(accountSid,authToken)

//!aaaaabbbbb  sensitive bilgiyi console da goruruz
// console.log(process.env.SENSITIVEINFO);

const url = baseUrl;

const product = { name: "", price: "", link: "" };

//! LAST:SET INTERVAL
const handle = setInterval(scrape, 5000);
console.log(product);

//!FETCH THE DATA
async function scrape() {
  //! axios fetches data in html
  const { data } = await axios.get(url);
  //   console.log(data);

  //! LOAD UP THE HTML
  const i = cheerio.load(data);
  const item = i("div#dp-container");
  //!EXTRACT THE DATA THAT WE NEED
  product.name = i(item).find("h1 span#productTitle").text();
  //console.log(product);
  product.link = url;
  const price = i(item)
    .find("span .a-price-whole")
    .first()
    .text()
    .replace(/[,.]/g, "");
  //! why replace()  herhangi bir nokta ve virgulu aldik.
  //   console.log(price);
  //   console.log(typeof price);
  //! price bize string donuyor. biz bunu integer yapmaliyiz.
  const priceNum = parseInt(price);
  product.price = priceNum;
  //   name, price ve link  console da yaziyor.
  console.log(product);
  //!SEND MESSAGE by phone. bunun icin bir paket lazim. twillio dotenv

  if (priceNum < 1500) {
    // client.messages
    //   .create({
    //     body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
    //     from: senderPhone,
    //     to: receiverPhone,
    //   })
    //   .then((message) => {
    //     console.log(message);
    //     clearInterval(handle);
    //   });
    console.log(
      `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`
    );
    clearInterval(handle)
  }
}

scrape();
