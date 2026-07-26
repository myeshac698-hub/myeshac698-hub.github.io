const list = document.getElementById("post-list");

// Make a copy so we don't modify the original array
const sortedPosts = [...window.posts].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

const activeFilter = document.getElementById("active-filter");
const pageCategory = document.body.dataset.category || null;

let activeTag = null;
let searchQuery = "";


// ----------------------------
// Update posts (all filtering)
// ----------------------------
function updatePosts() {

  let filtered = [...sortedPosts];

  // Filter by page category
  if (pageCategory) {
    filtered = filtered.filter(post =>
      post.mediaType === pageCategory
    );
  }

  // Filter by active tag
  if (activeTag) {
    filtered = filtered.filter(post =>
      (post.tags || []).includes(activeTag)
    );
  }

  // Filter by search query
  if (searchQuery) {

    filtered = filtered.filter(post => {

      const title = post.title.toLowerCase();

      const excerpt = (post.excerpt || "").toLowerCase();

      const tags = (post.tags || [])
        .join(" ")
        .toLowerCase();

      return (
        title.includes(searchQuery) ||
        excerpt.includes(searchQuery) ||
        tags.includes(searchQuery)
      );

    });

  }

  renderPosts(filtered);

}


// ----------------------------
// Create one post
// ----------------------------
function createPostElement(post) {

  const li = document.createElement("li");

  const tagsHTML = (post.tags || [])
    .map(tag => `
      <button
        class="tag"
        data-tag="${tag}">
        ${tag}
      </button>
    `)
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
// Render posts
// ----------------------------
function renderPosts(postsToRender) {

  list.innerHTML = "";

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

    summary.textContent =
      `Week ${String(week).padStart(2, "0")}`;

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
updatePosts();


// ----------------------------
// Search
// ----------------------------
const search = document.getElementById("search");

if (search) {

  search.addEventListener("input", () => {

    searchQuery = search.value
      .toLowerCase()
      .trim();

    updatePosts();

  });

}


// ----------------------------
// Click handling
// ----------------------------
document.addEventListener("click", event => {

  // Tag clicked
  if (event.target.classList.contains("tag")) {

    activeTag = event.target.dataset.tag;

    activeFilter.innerHTML = `
      <div class="filter-banner">
        <span>🏷️ Active Filter</span>

        <button
          class="active-tag"
          id="clear-filter"
          title="Remove filter"
        >
          ${activeTag}
          <span class="remove-filter">&times;</span>
        </button>
      </div>
    `;

    updatePosts();

    return;
  }

  // Clear filter clicked
  if (event.target.closest("#clear-filter")) {

    activeTag = null;
    searchQuery = "";

    if (search) {
      search.value = "";
    }

    activeFilter.innerHTML = "";

    updatePosts();

    return;
  }

});