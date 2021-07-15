const puppeteer = require("puppeteer");
const axios = require("axios").default;
(async () => {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  await page.goto("https://blog.theashishmaurya.me/");

  //   await page.screenshot({ path: "example.png" });
  const blogData = [];

  const posts = await page.$$(".blog-post-card-wrapper");
  console.log(posts.length);
  for (const post of posts) {
    const link = await post.$eval("a", (el) => el.getAttribute("href"));
    const heading = await post.$eval("a", (el) =>
      el.getAttribute("aria-label")
    );
    const description = await post.$eval("p>a", (el) => el.textContent);
    const blog = {
      title: heading,
      link: link,
      description: description,
    };
    axios
      .post("http://localhost:3000/posts", {
        id: 1 + Math.random(),
        title: blog.title,
        link: `https://blog.theashishmaurya.me${blog.link}`,
        description: blog.description,
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }

  await browser.close();
})();
