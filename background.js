const {Builder, By, Key, until} = require('selenium-webdriver');

// Set up Selenium
let driver = new Builder()
  .forBrowser('chrome')
  .build();

// Check for new posts every minute
setInterval(function() {
  // Get current time
  let currentTime = new Date();

  // Get scheduled posts from storage
  chrome.storage.sync.get(["posts"], function(items) {
    let posts = items.posts || [];

    // Publish scheduled posts
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];
      let postTime = new Date(post.postTime);
      if (postTime <= currentTime) {
        // Open group page in new tab
        let groupId = post.groupId.split(",");
        for (let j = 0; j < groupId.length; j++) {
          chrome.tabs.create({ url: `https://www.facebook.com/groups/${groupId[j]}` });
        }

        // Log in to Facebook
        driver.get('https://www.facebook.com/');
        driver.findElement(By.id('email')).sendKeys('YOUR_EMAIL');
        driver.findElement(By.id('pass')).sendKeys('YOUR_PASSWORD');
        driver.findElement(By.id('loginbutton')).click();

        // Wait for login
        driver.wait(until.titleIs('Facebook'), 10000);

        // Publish post
        if (post.postImage) {
          // Upload image
          driver.findElement(By.css('[data-testid="status-attachment-add-photo"]')).click();
          driver.sleep(1000);
          driver.findElement(By.css('[data-testid="media-attachment-photo-input"] input')).sendKeys(post.postImage);
          driver.sleep(5000);

          // Add post text
          driver.findElement(By.css('[data-testid="status-attachment-mentions-input"]')).sendKeys(post.postText);

          // Publish post
          driver.findElement(By.css('[data-testid="react-composer-post-button"]')).click();
        } else {
          // Add post text
          driver.findElement(By.css('[data-testid="status-attachment-mentions-input"]')