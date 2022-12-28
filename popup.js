document.addEventListener("DOMContentLoaded", function() {
    // Handle form submission
    document.getElementById("post-form").addEventListener("submit", function(event) {
      event.preventDefault();
  
      // Get form data
      let accessCode = document.getElementById("access-code").value;
      let groupId = document.getElementById("group-id").value;
      let postText = document.getElementById("post-text").value;
      let postImage = document.getElementById("post-image").files[0];
      let postTime = document.getElementById("post-time").value;
  
      // Validate access code
      if (accessCode !== "paysup2023") {
        document.getElementById("message").innerHTML = "Invalid access code.";
        return;
      }
  
      // Validate form data
      if (!groupId || !postText || !postTime) {
        document.getElementById("message").innerHTML = "Please fill out all required fields.";
        return;
      }
  
      // Prepare post data
      let postData = {
        groupId: groupId,
        postText: postText,
        postTime: postTime
      };
      if (postImage) {
        postData.postImage = postImage;
      }
  
      // Save post data to storage
      chrome.storage.sync.get(["posts"], function(items) {
        let posts = items.posts || [];
        posts.push(postData);
        chrome.storage.sync.set({ posts: posts }, function() {
          document.getElementById("message").innerHTML = "Post scheduled successfully.";
        });
      });
    });
  });