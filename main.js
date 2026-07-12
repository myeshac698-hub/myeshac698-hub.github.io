const latestList = document.getElementById("latest-posts");

const postsData = window.posts;

if (!latestList || !Array.isArray(postsData)) {
  console.warn("Posts not loaded or missing DOM element.");
} else {

  const sortedPosts = [...postsData].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const latestPosts = sortedPosts.slice(0, 3);

  if (latestPosts.length === 0) {
    latestList.innerHTML = "<p>No posts yet.</p>";
  } else {

    latestPosts.forEach(post => {
      const section = document.createElement("section");
      section.className = "post-preview";

      section.innerHTML = `
        <h3>
          <a href="${post.url}">${post.title}</a>
        </h3>

        <p class="excerpt">
          ${post.excerpt}
        </p>

        <small>${post.date}</small>

        <div class="tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}
        </div>
      `;

      latestList.appendChild(section);
    });
  }
}

const currentlyCard = document.getElementById("currently-card");

if (currentlyCard && window.currently) {

  currentlyCard.innerHTML = `
    <p><strong>📖 Reading</strong><br>
      ${window.currently.reading.title}
    </p>

    <p><strong>🎬 Watching</strong><br>
      ${window.currently.watching.title}
    </p>

    <p><strong>🎮 Playing</strong><br>
      ${window.currently.playing.title}
    </p>

    <p><strong>🎵 Listening</strong><br>
      ${window.currently.listening.title}
    </p>
  `;
}