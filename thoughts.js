const list = document.getElementById("post-list");

// Make a copy so we don't modify the original array
const sortedPosts = [...window.posts].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

// ----------------------------
// Create one post
// ----------------------------
function createPostElement(post) {

  const li = document.createElement("li");

  const tagsHTML = (post.tags || [])
    .map(tag => `<span class="tag">${tag}</span>`)
    .join(" ");

  li.innerHTML = `
    <a href="${post.url}">
      ${post.title}
    </a>

    <small>${post.date}</small>

    ${
      post.excerpt
        ? `<p class="excerpt">${post.excerpt}</p>`
        : ""
    }

    <div class="tags">
      ${tagsHTML}
    </div>
  `;

  return li;
}

// ----------------------------
// Render a list of posts
// ----------------------------
function renderPosts(postsToRender) {

  // Clear previous content
  list.innerHTML = "";

  // Show a message if nothing matches
  if (postsToRender.length === 0) {

    list.innerHTML = `
      <p>No posts matched your search.</p>
    `;

    return;
  }

  const grouped = {};

  postsToRender.forEach(post => {

    const week = post.week;

    if (!grouped[week]) {
      grouped[week] = [];
    }

    grouped[week].push(post);

  });

  const weeks = Object.keys(grouped).sort((a, b) => b - a);

  const newestWeek = weeks[0];

  weeks.forEach(week => {

    const details = document.createElement("details");

    if (week === newestWeek) {
      details.open = true;
    }

    const summary = document.createElement("summary");

    summary.textContent = `Week ${String(week).padStart(2, "0")}`;

    details.appendChild(summary);

    const ul = document.createElement("ul");

    grouped[week].forEach(post => {
      ul.appendChild(createPostElement(post));
    });

    details.appendChild(ul);

    list.appendChild(details);

  });

}

// ----------------------------
// Initial page load
// ----------------------------
renderPosts(sortedPosts);

// ----------------------------
// Search
// ----------------------------
const search = document.getElementById("search");

if (search) {

  search.addEventListener("input", () => {

    const query = search.value
      .toLowerCase()
      .trim();

    const filtered = sortedPosts.filter(post => {

      const title = post.title.toLowerCase();

      const excerpt = (post.excerpt || "").toLowerCase();

      const tags = (post.tags || [])
        .join(" ")
        .toLowerCase();

      return (
        title.includes(query) ||
        excerpt.includes(query) ||
        tags.includes(query)
      );

    });

    renderPosts(filtered);

  });

}