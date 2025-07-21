  const updateUrl = "https://boekvanherinnering.github.io/bibleapp/update-message.json";
  const currentAppVersion = "1.4"; // This must match your app version


  
  fetch(updateUrl)
    .then(res => res.json())
    .then(data => {
      if (data.update && data.version !== currentAppVersion) {
        // Show the popup every time until version matches
        document.getElementById("updatePopup").style.display = "block";
        document.getElementById("updateMessage").innerText = data.message;

        document.getElementById("downloadBtn").onclick = () => {
          window.location.href = data.link;
        };
      }
    })
    .catch(err => {
      console.error("Update check failed:", err);
    });

  // Dismiss only hides temporarily, it will come back on next load if not updated
  document.getElementById("dismissBtn").onclick = () => {
    document.getElementById("updatePopup").style.display = "none";
  };










const menuBtn = document.getElementById('menuToggleBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('show');

  if (menu.classList.contains('show')) {
    menuBtn.textContent = '❌ Menu';
    menuBtn.classList.add('open');
  } else {
    menuBtn.textContent = '🔵 Menu';
    menuBtn.classList.remove('open');
  }
});















let lastTapTime = 0;
let selectedVerses = [];

document.querySelectorAll("p[data-verse]").forEach(verse => {
  verse.addEventListener("click", function () {
    const now = Date.now();
    if (now - lastTapTime < 400) {
      const id = this.id; // e.g., "genésis_1_1"
      const [book, chapter, verseNum] = id.split("_");
      const verseText = this.textContent.trim();

      if (!selectedVerses.find(v => v.id === id)) {
        selectedVerses.push({
          id,
          book,
          chapter,
          verse: verseNum,
          text: verseText
        });
        this.classList.add("verse-selected");
      }

      updatePopupContent();
      document.getElementById("versePopup").classList.remove("hidden");
    }
    lastTapTime = now;
  });
});

function updatePopupContent() {
  const container = document.getElementById("popupVerseText");
  container.innerHTML = "";

  const grouped = {};

  selectedVerses.forEach(v => {
    const el = document.getElementById(v.id);
    const pageDiv = el.closest(".page");
    const h2 = pageDiv ? pageDiv.querySelector("h2") : null;
    const title = h2 ? h2.textContent.trim() : "📖 Onbekend";

    if (!grouped[title]) grouped[title] = [];
    grouped[title].push(v);
  });

  const titles = Object.keys(grouped);
  titles.forEach((title, index) => {
    const titleDiv = document.createElement("div");
    titleDiv.innerHTML = `<h3 style="margin-bottom: 6px; font-weight: bold;">📖 ${title}</h3>`;
    container.appendChild(titleDiv);

    grouped[title].forEach(v => {
      const div = document.createElement("div");
      div.style.marginBottom = "6px";
      div.textContent = v.text;
      container.appendChild(div);
    });

    if (index !== titles.length - 1) {
      container.appendChild(document.createElement("hr"));
    }
  });

  // ✅ Wait for content to render, then scroll
  setTimeout(() => {
    const scrollable = document.querySelector(".popup-scrollable");
    if (scrollable) {
      scrollable.scrollTop = scrollable.scrollHeight;
    }
  }, 0);
}







function closePopup() {
  document.getElementById("versePopup").classList.add("hidden");
  clearSelectedVerses();
}

function addToFavorites() {
  const existing = JSON.parse(localStorage.getItem("favorites") || "[]");

  selectedVerses.forEach(v => {
    const el = document.getElementById(v.id);
    const pageDiv = el.closest(".page");
    const h2 = pageDiv ? pageDiv.querySelector("h2") : null;
    const title = h2 ? h2.textContent.trim() : "📖 Onbekend";

    if (!existing.find(f => f.id === v.id)) {
      existing.push({
        ...v,
        title
      });
    }
  });

  localStorage.setItem("favorites", JSON.stringify(existing));
  closePopup();

  // ✅ Show a friendly message instead of alert
  showMessage("✅ Verse(s) added to Favorites!");

  // ✅ Open the menu if it's closed
  const menu = document.getElementById("menu");
  const menuBtn = document.getElementById("menuToggleBtn");
  if (!menu.classList.contains("show")) {
    menu.classList.add("show");
    menuBtn.textContent = "❌ Menu";
    menuBtn.classList.add("open");
  }

  // ✅ Trigger click on viewFavoritesBtn to load favorites
  const favBtn = document.getElementById("viewFavoritesBtn");
  if (favBtn) favBtn.click();

  // ✅ Scroll to favorites list after it's loaded
  setTimeout(() => {
    const favList = document.getElementById("favoritesList");
    if (favList) {
      favList.scrollIntoView({ behavior: "smooth" });
    }
  }, 300);
}


function showMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = "#007bff";
  msg.style.color = "white";
  msg.style.padding = "10px 20px";
  msg.style.borderRadius = "10px";
  msg.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  msg.style.zIndex = "9999";
  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 2000);
}




document.getElementById("viewFavoritesBtn").addEventListener("click", () => {
  const list = document.getElementById("favoritesList");
  list.innerHTML = ""; // Clear previous

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (favorites.length === 0) {
    list.innerHTML = "<p>Geen gunsteling verse gestoor nie.</p>";
  } else {
    favorites.forEach((v) => {
      const div = document.createElement("div");
      div.style.marginBottom = "10px";
      div.style.position = "relative";

      const cleanedText = v.text.replace(/\(\(.*?\)\)/g, "").trim();
      div.innerHTML = `
  <strong>📖 ${v.title}</strong><br>
  <span>${capitalize(v.book)} ${v.chapter}:${v.verse} - ${cleanedText}</span>
  <br>
  <button style="margin-top: 5px;" onclick="removeFavorite('${v.id}')">🗑️ Verwyder</button>
`;


      list.appendChild(div);
    });
  }

  list.classList.remove("hidden"); // Always show list
});

function removeFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const updated = favorites.filter(v => v.id !== id);
  localStorage.setItem("favorites", JSON.stringify(updated));

  // Refresh the list instantly
  document.getElementById("viewFavoritesBtn").click();
}

function clearFavorites() {
  if (confirm("Is jy seker jy wil al jou gunsteling verse verwyder?")) {
    localStorage.removeItem("favorites");
    document.getElementById("favoritesList").innerHTML = "<p>Gunstelinge verwyder.</p>";
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function highlightFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  favorites.forEach(fav => {
    const el = document.getElementById(fav.id);
    if (el) {
      el.classList.add("highlight-favorite");
    }
  });
}
window.addEventListener("DOMContentLoaded", highlightFavorites);
























function previewVerse() {
  const text = selectedVerses.map(v =>
    `${capitalize(v.book)} ${v.chapter}:${v.verse} - ${v.text}`
  ).join('\n\n');

  // Get grouped HTML format (same as in updatePopupContent)
  const container = document.createElement("div");
  const grouped = {};

  selectedVerses.forEach(v => {
    const el = document.getElementById(v.id);
    const pageDiv = el.closest(".page");
    const h2 = pageDiv ? pageDiv.querySelector("h2") : null;
    const title = h2 ? h2.textContent.trim() : "📖 Onbekend";

    if (!grouped[title]) grouped[title] = [];
    grouped[title].push(v);
  });

  Object.keys(grouped).forEach(title => {
    const section = document.createElement("div");
    section.innerHTML = `<h3>📖 ${title}</h3>`;
    grouped[title].forEach(v => {
      const line = document.createElement("div");
      line.textContent = v.text;
      section.appendChild(line);
    });
    container.appendChild(section);
    container.appendChild(document.createElement("hr"));
  });

  const data = {
    reference: "Die Boek Van Herinnering",
    html: container.innerHTML
  };

  const encoded = encodeURIComponent(JSON.stringify(data));
  window.open(`preview.html?data=${encoded}`, "_blank");

  // ✅ Clear highlights and verses after preview
  clearSelectedVerses();
}




function clearSelectedVerses() {
  selectedVerses.forEach(v => {
    const el = document.getElementById(v.id);
    if (el) el.classList.remove("verse-selected");
  });
  selectedVerses = [];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function addMoreVerses() {
  // Just hide popup but keep selected verses
  document.getElementById("versePopup").classList.add("hidden");
}






























  

function goToVerse(targetPage, verseNumbers) {
    let scrollPosition = window.scrollY;
    localStorage.setItem('scrollPosition', scrollPosition);
    lastVisitedVerse = document.querySelector('.page:not(.hidden)').id;

    navigate(targetPage);

    const verses = typeof verseNumbers === 'string'
        ? verseNumbers.split(',').map(v => parseInt(v.trim()))
        : Array.isArray(verseNumbers) ? verseNumbers : [verseNumbers];

    document.querySelectorAll('.highlight-verse').forEach(el => {
        el.classList.remove('highlight-verse', 'fade-out');
    });

    setTimeout(() => {
        const firstVerseElement = document.querySelector(`#${targetPage} p[data-verse="${verses[0]}"]`);
        if (firstVerseElement) {
            let offset = 130;
            let versePosition = firstVerseElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: versePosition - offset,
                behavior: 'smooth'
            });
        }

        verses.forEach(verseNumber => {
            const verseElement = document.querySelector(`#${targetPage} p[data-verse="${verseNumber}"]`);
            if (verseElement) {
                verseElement.classList.add('highlight-verse');
                setTimeout(() => verseElement.classList.add('fade-out'), 20000);
                setTimeout(() => verseElement.classList.remove('highlight-verse', 'fade-out'), 40000);
            }
        });

        // --- Show Return button ---
        let returnButton = document.querySelector('.return-popup');
        if (!returnButton) {
            returnButton = document.createElement('button');
            returnButton.classList.add('return-popup');
            returnButton.innerText = 'Return';
            document.body.appendChild(returnButton);
        }

        returnButton.style.display = 'block';
        returnButton.onclick = () => {
            navigate(lastVisitedVerse);
            const savedPosition = localStorage.getItem('scrollPosition');
            if (savedPosition) {
                window.scrollTo({ top: parseInt(savedPosition), behavior: 'smooth' });
            }
            returnButton.classList.remove('visible');
            returnButton.style.display = 'none';
        };

        // Optional: hide return button when any other button is clicked
        document.querySelectorAll('button:not(.return-popup)').forEach(button => {
            button.addEventListener('click', () => {
                returnButton.style.display = 'none';
            });
        });

    }, 100);
}


function goToVerse(targetPage, verseNumbers) {
    let scrollPosition = window.scrollY;
    localStorage.setItem('scrollPosition', scrollPosition);
    lastVisitedVerse = document.querySelector('.page:not(.hidden)').id;

    navigate(targetPage);

    const verses = typeof verseNumbers === 'string'
        ? verseNumbers.split(',').map(v => parseInt(v.trim()))
        : Array.isArray(verseNumbers) ? verseNumbers : [verseNumbers];

    document.querySelectorAll('.highlight-verse').forEach(el => {
        el.classList.remove('highlight-verse', 'fade-out');
    });

    setTimeout(() => {
        const firstVerseElement = document.querySelector(`#${targetPage} p[data-verse="${verses[0]}"]`);
        if (firstVerseElement) {
            let offset = 130;
            let versePosition = firstVerseElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: versePosition - offset,
                behavior: 'smooth'
            });
        }

        verses.forEach(verseNumber => {
            const verseElement = document.querySelector(`#${targetPage} p[data-verse="${verseNumber}"]`);
            if (verseElement) {
                verseElement.classList.add('highlight-verse');
                setTimeout(() => verseElement.classList.add('fade-out'), 20000);
                setTimeout(() => verseElement.classList.remove('highlight-verse', 'fade-out'), 40000);
            }
        });

        // --- Show Return button ---
        let returnButton = document.querySelector('.return-popup');
        if (!returnButton) {
            returnButton = document.createElement('button');
            returnButton.classList.add('return-popup');
            returnButton.innerText = '↩️ Return to Verse';
            document.body.appendChild(returnButton);
        }

        returnButton.style.display = 'block';
        returnButton.onclick = () => {
            navigate(lastVisitedVerse);
            const savedPosition = localStorage.getItem('scrollPosition');
            if (savedPosition) {
                window.scrollTo({ top: parseInt(savedPosition), behavior: 'smooth' });
            }
            returnButton.classList.remove('visible');
            returnButton.style.display = 'none';
        };

        // Optional: hide return button when any other button is clicked
        document.querySelectorAll('button:not(.return-popup)').forEach(button => {
            button.addEventListener('click', () => {
                returnButton.style.display = 'none';
            });
        });

    }, 100);
}



















// Toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const btn = document.getElementById('darkModeBtn');

    const darkModeOn = body.classList.toggle('dark-mode');

    // Save the current state to localStorage
    localStorage.setItem('darkMode', darkModeOn ? 'on' : 'off');

    // Update button text
    btn.textContent = darkModeOn ? '☀️ Day Mode' : '🌙 Dark Mode';
}
window.addEventListener('DOMContentLoaded', () => {
    // Auto-apply dark mode if saved
    const savedMode = localStorage.getItem('darkMode');
    const btn = document.getElementById('darkModeBtn');

    if (savedMode === 'on') {
        document.body.classList.add('dark-mode');
        if (btn) btn.textContent = '☀️ Day Mode';
    } else {
        if (btn) btn.textContent = '🌙 Dark Mode';
    }

    // (Font size code can stay here too if you're combining)
});



function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(page).classList.remove('hidden');

    // Scroll to top when navigating
    window.scrollTo(0, 0);
}


let lastVisitedVerse = null;





function cleanText(text) {
  return text
    .normalize("NFD")                         // Split accented characters
    .replace(/[\u0300-\u036f]/g, '')          // Remove accents
    .replace(/[\p{P}\p{S}\[\](){}<>]/gu, '')  // Remove punctuation and symbols
    .replace(/['’]/g, '')                     // Remove fancy quotes/apostrophes
    .toLowerCase()
    .replace(/\s+/g, ' ')                     // Normalize whitespace
    .trim();
}




function highlightMatch(query, originalText) {
  const searchWords = cleanText(query).split(' ').filter(w => w);
  if (searchWords.length === 0) return originalText;

  // Use regex to find all word-like parts (including accented letters)
  return originalText.replace(/[\p{L}\p{N}'’]+/gu, (word) => {
    const cleanedWord = cleanText(word);
    for (const searchWord of searchWords) {
      if (cleanedWord.includes(searchWord)) {
        return `<mark>${word}</mark>`;
      }
    }
    return word;
  });
}


function processChapters(chapterArrays, query, callback) {
  let bookIndex = 0;
  let results = [];

  function nextChunk() {
    const start = performance.now();
    while (bookIndex < chapterArrays.length && performance.now() - start < 15) {
      const bookArr = chapterArrays[bookIndex];
      bookArr.forEach(chap => {
        chap.content.forEach((text, idx) => {
          const cleanText = chap.cleaned ? chap.cleaned[idx] : normalizeText(text);
          if (cleanText.includes(query)) {
            results.push({ book: chap.book, chapter: chap.chapter, verse: idx + 1, text });
          }
        });
      });
      bookIndex++;
    }

    if (bookIndex < chapterArrays.length) {
      requestAnimationFrame(nextChunk);
    } else {
      callback(results);
    }
  }

  requestAnimationFrame(nextChunk);
}

function formatBookName(internalName) {
  const map = {
     'Genésis': 'Genesis',
    'Exodus': 'Exodus',
    'Levitikus': 'Levitikus',
    'Numeri': 'Numeri',
    'Deuteronómium': 'Deuteronómium',
    'Jehowshua': 'Jehowshua',
    'Rigters': 'Rigters',
    'Een_Shemuel': '1 Shemuel',
    'Twee_Shemuel': '2 Shemuel',
    'Een_Konings': '1 Konings',
    'Twee_Konings': '2 Konings',
    'Een_Kronieke': '1 Kronieke',
    'Twee_Kronieke': '2 Kronieke',
    'Opregte': 'Oprechte',
    'Een_Makkabeers': '1 Makkabeërs',
    'Twee_Makkabeers': '2 Makkabeërs',
    'Psalms': 'Psalms',
    'Spreuke_Van_Salomo': 'Spreuke',
    'Prediker': 'Prediker',
    'Hooglied_Van_Salomo': 'Hooglied Van Salomo',
    'Wyshied_Van_Salomo': 'Wysheid Van Salomo',
    'Odes_Van_Salomo': 'Odes Van Salomo',
    'Die_Wysheid_Van_Jehôwshua_Ben_Sirah': 'Wysheid Van Jehôwshua Ben Sirah',
    'Rut': 'Rut',
    'Judit': 'Judit',
    'Ester': 'Ester',
    'Tobias': 'Tobias',
    'Job': 'Job',
    'Henog': 'Henog',
    'Jôwel': 'Jôwel',
    'Amos': 'Amos',
    'Hoséa': 'Hoséa',
    'Miga': 'Miga',
    'Jeshajah': 'Jeshajah',
    'Nahum': 'Nahum',
    'Habakuk': 'Habakuk',
    'Sefanja': 'Sefanja',
    'Jeremia': 'Jeremia',
    'Klaagliedere_Van_Jeremia': 'Klaagliedere',
    'Barug': 'Barug',
    'Esegiël': 'Esegiël',
    'Daniël': 'Daniël',
    'Een_Esra': '1 Esra',
    'Twee_Esra': '2 Esra',
    'Esra': 'Esra',
    'Obadja': 'Obadja',
    'Haggai': 'Haggai',
    'Sagaria': 'Sagaria',
    'Nehemia': 'Nehemia',
    'Maleagi': 'Maleagi',
    'Jakobus': 'Jakobus',
    'Thomas': 'Thomas',
    'Lukas': 'Lukas',
    'Mattithjahûw': 'Mattithjahûw',
    'Markus': 'Markus',
    'Jehôwganan': 'Jehôwganan',
    'Petrus': 'Petrus',
    'Nikodémus_Deel_1': 'Nikodémus 1',
    'Nikodémus_Deel_2': 'Nikodémus 2',
    'Handelinge_Van_Die_Apostels': 'Handelinge',
    'Sendbriewe_Van_Abgarus_En_Jahwèshua': 'Sendbriewe Van Abgarus En Jahwèshua',
    'Hebreërs': 'Hebreërs',
    'Die_Brief_Van_Jakobus_Aan_Jisraeliete': 'Jakobus aan Israeliete',
    'Eerste_Brief_Van_Die_Apostel_Petrus': '1st Brief Van Petrus',
    'Tweede_Brief_Van_Die_Apostel_Petrus': '2de Brief Van Petrus',
    'Eerste_Brief_Van_Die_Apostel_Jehôwganan': '1st Brief Van Jehôwganan',
    'Tweede_Brief_Van_Die_Apostel_Jehôwganan': '2de Brief Van Jehôwganan',
    'Derde_Brief_Van_Die_Apostel_Jehôwganan': '3de Brief Van Jehôwganan',
    'Judas': 'Judas',
    'Openbaring_Van_Petrus': 'Openbaring van Petrus',
    'Openbaring_Van_Jahwèshua': 'Openbaring van Jahwèshua',
    'Jubileum': 'Jubileum'

  };
  return map[internalName] || internalName;
}


function searchBible() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';
  if (!query) return;

  const results = [];
  const cleanedQuery = cleanText(query);
  const queryWords = cleanedQuery.split(' ').filter(w => w);

  const books = [
    genésisChapters, exodusChapters, levitikusChapters, numeriChapters,
    deuteronómiumChapters, jehowshuaChapters, rigtersChapters, een_shemuelChapters,
    twee_shemuelChapters, een_koningsChapters, twee_koningsChapters, een_kroniekeChapters,
    twee_kroniekeChapters, opregteChapters, een_makkabeersChapters, twee_makkabeersChapters,
    psalmsChapters, spreuke_van_salomoChapters, predikerChapters, hooglied_van_salomoChapters,
    wyshied_van_salomoChapters, odes_van_salomoChapters, die_wysheid_van_jehôwshua_ben_sirahChapters,
    rutChapters, juditChapters, esterChapters, tobiasChapters, jobChapters, henogChapters,
    openbaring_van_henogChapters, jôwelChapters, jonaChapters, amosChapters, hoséaChapters,
    migaChapters, jeshajahChapters, nahumChapters, habakukChapters, sefanjaChapters,
    jeremiaChapters, klaagliedere_van_jeremiaChapters, barugChapters, esegiëlChapters,
    daniëlChapters, een_esraChapters, twee_esraChapters, esraChapters, obadjaChapters,
    haggaiChapters, sagariaChapters, nehemiaChapters, maleagiChapters, jakobusChapters,
    thomasChapters, lukasChapters, mattithjahûwChapters, markusChapters, jehôwgananChapters,
    petrusChapters, nikodémus_deel_1Chapters, nikodémus_deel_2Chapters, handelinge_van_die_apostelsChapters,
    sendbriewe_van_abgarus_en_jahwèshuaChapters, hebreërsChapters, die_brief_van_jakobus_aan_jisraelieteChapters,
    eerste_brief_van_die_apostel_petrusChapters, tweede_brief_van_die_apostel_petrusChapters,
    eerste_brief_van_die_apostel_jehôwgananChapters, tweede_brief_van_die_apostel_jehôwgananChapters,
    derde_brief_van_die_apostel_jehôwgananChapters, judasChapters, openbaring_van_petrusChapters,
    openbaring_van_jahwèshuaChapters, jubileumChapters
  ];

  books.forEach(bookArr => {
    bookArr.forEach(chap => {
      chap.content.forEach((text, idx) => {
        const cleanedVerse = cleanText(text);
        const matchAll = queryWords.every(qWord => cleanedVerse.includes(qWord));
        if (matchAll) {
          results.push({
            book: chap.book,
            chapter: chap.chapter,
            verse: idx + 1,
            text: highlightMatch(query, text),
            pageId: `${chap.book.toLowerCase()}_scriptur_chapter${chap.chapter}`
          });
        }
      });
    });
  });

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>Geen resultate gevind nie.</p>';
    return;
  }

  if (getViewMode() === 'flat') {
    // Flat list
    results.forEach(r => {
      const div = document.createElement('div');
      div.className = 'search-result';
      div.innerHTML = `
        <a href="#" onclick="goToVerse('${r.pageId}',${r.verse});return false">
          <strong>${formatBookName(r.book)} ${r.chapter}:${r.verse}</strong> – ${r.text}
        </a>`;
      resultsContainer.appendChild(div);
    });
  } else {
    // Accordion by book
    const grouped = results.reduce((acc, r) => {
      (acc[r.book] = acc[r.book] || []).push(r);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([book, items]) => {
      const btn = document.createElement('button');
      btn.textContent = `📖 ${formatBookName(book)} (${items.length})`;

      btn.className = 'accordion-btn';

      const panel = document.createElement('div');
      panel.className = 'accordion-panel hidden';

      btn.onclick = () => panel.classList.toggle('hidden');

      items.forEach(r => {
        const p = document.createElement('p');
        p.innerHTML = `
          <a href="#" onclick="goToVerse('${r.pageId}',${r.verse});return false">
            <strong>${formatBookName(book)} ${r.chapter}:${r.verse}</strong> – ${r.text}

          </a>`;
        panel.appendChild(p);
      });

      resultsContainer.appendChild(btn);
      resultsContainer.appendChild(panel);
    });
  }
}


let currentViewMode = 'flat';  // initial state

function toggleViewMode() {
  currentViewMode = currentViewMode === 'flat' ? 'accordion' : 'flat';
  const btn = document.getElementById('viewToggleBtn');
  btn.textContent = currentViewMode === 'flat'
    ? 'Search Results 📄 By Flat'
    : 'Search Results 📚 By Book';
  searchBible();
}


function getViewMode() {
  return currentViewMode;
}

// In your existing searchBible(), replace getViewMode() logic 
// so it reads the global currentViewMode variable.





let searchTimer;
const searchBar = document.getElementById('searchBar');

searchBar.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(searchBible, 1000);
});

















function toggleFontMenu() {
    const dropdown = document.getElementById('fontDropdown');
    dropdown.classList.toggle('hidden');
}



function changeFontSize(fontSize) {
  applyFontSize(fontSize);
  localStorage.setItem('fontSize', fontSize);
}

function applyFontSize(fontSize) {
  const targets = document.querySelectorAll(
    '.page, button, input, select, textarea, label, .button, .searchbar, .search-result, .sticky-header'
  );

  targets.forEach(element => {
    element.style.fontSize = fontSize;
  });
}

// Auto-apply saved font size when app loads
window.addEventListener('DOMContentLoaded', () => {
  const savedFontSize = localStorage.getItem('fontSize');
  if (savedFontSize) {
    applyFontSize(savedFontSize);
    const fontSizeSlider = document.getElementById('fontSizeRange');
    if (fontSizeSlider) {
      fontSizeSlider.value = parseInt(savedFontSize); // e.g. "16px" → 16
    }
  }
});

// Toggle Settings dropdown open/close
document.getElementById('settingsBtn').addEventListener('click', () => {
  const dropdown = document.getElementById('settingsDropdown');
  dropdown.classList.toggle('hidden');

  const btn = document.getElementById('settingsBtn');
  btn.textContent = dropdown.classList.contains('hidden')
    ? '⚙️ Settings ▼'
    : '⚙️ Settings ▲';
});
const dropdown = document.getElementById('settingsDropdown');
dropdown.classList.toggle('show');






























function toggleNotepad() {
    const noteBox = document.getElementById('notepadContainer');
    const toggleBtn = document.getElementById('toggleNoteBtn');

    if (noteBox.classList.contains('hidden')) {
        noteBox.classList.remove('hidden');
        toggleBtn.textContent = '❌ Close Note';
    } else {
        noteBox.classList.add('hidden');
        toggleBtn.textContent = '📔 Open Note';
    }
}

function saveNote() {
    const note = document.getElementById('notepad').value;
    localStorage.setItem('userNote', note);
    alert("Note saved!");

    // Auto-close the notepad
    document.getElementById('notepadContainer').classList.add('hidden');
    document.getElementById('toggleNoteBtn').textContent = '📔 Open Note';
}


// Load saved note when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('userNote');
    if (saved) {
        document.getElementById('notepad').value = saved;
    }
});



function showGenesisComment() {
    const comment = document.getElementById('genésisComment');
    comment.textContent = "📖 Die WET 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('genésis_chapterpage');
    }, 2000);
}

function showExodusComment() {
    const comment = document.getElementById('exodusComment');
    comment.textContent = "📖 Die WET 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('exodus_chapterpage');
    }, 2000);
}

function showLevitikusComment() {
    const comment = document.getElementById('levitikusComment');
    comment.textContent = "📖 Die WET 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('levitikus_chapterpage');
    }, 2000);
}

function showNumeriComment() {
    const comment = document.getElementById('numeriComment');
    comment.textContent = "📖 Die WET 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('numeri_chapterpage');
    }, 2000);
}

function showDeuteronómiumComment() {
    const comment = document.getElementById('deuteronómiumComment');
    comment.textContent = "📖 Die WET 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('deuteronómium_chapterpage');
    }, 2000);
}

function showJehowshuaComment() {
    const comment = document.getElementById('jehowshuaComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('jehowshua_chapterpage');
    }, 2000);
}

function showRigtersComment() {
    const comment = document.getElementById('rigtersComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('rigters_chapterpage');
    }, 2000);
}

function showEenShemuelComment() {
    const comment = document.getElementById('een_shemuelComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('een_shemuel_chapterpage');
    }, 2000);
}

function showTweeShemuelComment() {
    const comment = document.getElementById('twee_shemuelComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('twee_shemuel_chapterpage');
    }, 2000);
}

function showEenKoningsComment() {
    const comment = document.getElementById('een_koningsComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('een_konings_chapterpage');
    }, 2000);
}

function showTweeKoningsComment() {
    const comment = document.getElementById('twee_koningsComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('twee_konings_chapterpage');
    }, 2000);
}

function showEenKroniekeComment() {
    const comment = document.getElementById('een_kroniekeComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('een_kronieke_chapterpage');
    }, 2000);
}

function showTweeKroniekeComment() {
    const comment = document.getElementById('twee_kroniekeComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('twee_kronieke_chapterpage');
    }, 2000);
}

function showOpregteComment() {
    const comment = document.getElementById('opregteComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('opregte_chapterpage');
    }, 2000);
}

function showEenMakkabeersComment() {
    const comment = document.getElementById('een_makkabeersComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('een_makkabeers_chapterpage');
    }, 2000);
}

function showTweeMakkabeersComment() {
    const comment = document.getElementById('twee_makkabeersComment');
    comment.textContent = "📖 Die Geskiedenis 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('twee_makkabeers_chapterpage');
    }, 2000);
}

function showPsalmsComment() {
    const comment = document.getElementById('psalmsComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('psalms_chapterpage');
    }, 2000);
}

function showSpreukeVanSalomoComment() {
    const comment = document.getElementById('spreuke_van_salomoComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('spreuke_van_salomo_chapterpage');
    }, 2000);
}

function showPredikerComment() {
    const comment = document.getElementById('predikerComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('prediker_chapterpage');
    }, 2000);
}

function showHoogliedVanSalomoComment() {
    const comment = document.getElementById('hooglied_van_salomoComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('hooglied_van_salomo_chapterpage');
    }, 2000);
}

function showWyshiedVanSalomoComment() {
    const comment = document.getElementById('wyshied_van_salomoComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('wyshied_van_salomo_chapterpage');
    }, 2000);
}

function showOdesVanSalomoComment() {
    const comment = document.getElementById('odes_van_salomoComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('odes_van_salomo_chapterpage');
    }, 2000);
}

function showDieWysheidVanJehôwshuaBenSirahComment() {
    const comment = document.getElementById('die_wysheid_van_jehôwshua_ben_sirahComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('die_wysheid_van_jehôwshua_ben_sirah_chapterpage');
    }, 2000);
}

function showRutComment() {
    const comment = document.getElementById('rutComment');
    comment.textContent = "📖 Die Wysheid 📖";  
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('rut_chapterpage');
    }, 2000);
}   

function showJuditComment() {
    const comment = document.getElementById('juditComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('judit_chapterpage');
    }, 2000);
}

function showEsterComment() {
    const comment = document.getElementById('esterComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('ester_chapterpage');
    }, 2000);
}

function showTobiasComment() {
    const comment = document.getElementById('tobiasComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('tobias_chapterpage');
    }, 2000);
}

function showJobComment() {
    const comment = document.getElementById('jobComment');
    comment.textContent = "📖 Die Wysheid 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('job_chapterpage');
    }, 2000);
}

function showHenogComment() {
    const comment = document.getElementById('henogComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('henog_chapterpage');
    }, 2000);
}

function showOpenbaringVanHenogComment() {
    const comment = document.getElementById('openbaring_van_henogComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('openbaring_van_henog_chapterpage');
    }, 2000);
}

function showJôWElComment() {
    const comment = document.getElementById('jôwelComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('jôwel_chapterpage');
    }, 2000);
}
    


function showJonaComment() {
    const comment = document.getElementById('jonaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('jona_chapterpage');
    }, 2000);
}

function showAmosComment() {
    const comment = document.getElementById('amosComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('amos_chapterpage');
    }, 2000);
}


function showHoséaComment() {
    const comment = document.getElementById('hoséaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('hoséa_chapterpage');
    }, 2000);
}

function showMigaComment() {
    const comment = document.getElementById('migaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('miga_chapterpage');
    }, 2000);
}

function showJeshajahComment() {
    const comment = document.getElementById('jeshajahComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('jeshajah_chapterpage');
    }, 2000);
}

function showNahumComment() {
    const comment = document.getElementById('nahumComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('nahum_chapterpage');
    }, 2000);
}

function showHabakukComment() {
    const comment = document.getElementById('habakukComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('habakuk_chapterpage');
    }, 2000);
}

function showSefanjaComment() {
    const comment = document.getElementById('sefanjaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('sefanja_chapterpage');
    }, 2000);
}

function showJeremiaComment() {
    const comment = document.getElementById('jeremiaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('jeremia_chapterpage');
    }, 2000);
}

function showKlaagliedereVanJeremiaComment() {
    const comment = document.getElementById('klaagliedere_van_jeremiaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('klaagliedere_van_jeremia_chapterpage');
    }, 2000);
}

function showBarugComment() {
    const comment = document.getElementById('barugComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('barug_chapterpage');
    }, 2000);
}

function showEsegiëlComment() {
    const comment = document.getElementById('esegiëlComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('esegiël_chapterpage');
    }, 2000);
}

function showDaniëlComment() {
    const comment = document.getElementById('daniëlComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('daniël_chapterpage');
    }, 2000);
}

function showEenEsraComment() {
    const comment = document.getElementById('een_esraComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('een_esra_chapterpage');
    }, 2000);
}

function showTweeEsraComment() {
    const comment = document.getElementById('twee_esraComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('twee_esra_chapterpage');
    }, 2000);
}

function showEsraComment() {
    const comment = document.getElementById('esraComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('esra_chapterpage');
    }, 2000);
}

function showObadjaComment() {
    const comment = document.getElementById('obadjaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('obadja_chapterpage');
    }, 2000);
}

function showHaggaiComment() {
    const comment = document.getElementById('haggaiComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('haggai_chapterpage');
    }, 2000);
}

function showSagariaComment() {
    const comment = document.getElementById('sagariaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('sagaria_chapterpage');
    }, 2000);
}

function showNehemiaComment() {
    const comment = document.getElementById('nehemiaComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('nehemia_chapterpage');
    }, 2000);
}   
function showMaleagiComment() {
    const comment = document.getElementById('maleagiComment');
    comment.textContent = "📖 Die Profete 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('maleagi_chapterpage');
    }, 2000);
}

function showJakobusComment() {
    const comment = document.getElementById('jakobusComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('jakobus_chapterpage');
    }, 2000);
}

function showThomasComment() {
    const comment = document.getElementById('thomasComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('thomas_chapterpage');
    }, 2000);
}

function showLukasComment() {
    const comment = document.getElementById('lukasComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('lukas_chapterpage');
    }, 2000);
}

function showMattithjahûwComment() {
    const comment = document.getElementById('mattithjahûwComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('mattithjahûw_chapterpage');
    }, 2000);
}

function showMarkusComment() {
    const comment = document.getElementById('markusComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('markus_chapterpage');
    }, 2000);
}

function showJehôwgananComment() {
    const comment = document.getElementById('jehôwgananComment');
    comment.textContent = "📖 Die Boodskap 📖"; 
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('jehôwganan_chapterpage');
    }, 2000);
}

function showPetrusComment() {
    const comment = document.getElementById('petrusComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('petrus_chapterpage');
    }, 2000);
}

function showNikodémusDeel1Comment() {
    const comment = document.getElementById('nikodémus_deel_1Comment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('nikodémus_deel_1_chapterpage');
    }, 2000);
}

function showNikodémusDeel2Comment() {
    const comment = document.getElementById('nikodémus_deel_2Comment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('nikodémus_deel_2_chapterpage');
    }, 2000);
}

function showHandelingeVanDieApostelsComment() {
    const comment = document.getElementById('handelinge_van_die_apostelsComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('handelinge_van_die_apostels_chapterpage');
    }, 2000);
}

function showSendbrieweVanAbgarusEnJahwèshuaComment() {
    const comment = document.getElementById('sendbriewe_van_abgarus_en_jahwèshuaComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('sendbriewe_van_abgarus_en_jahwèshua_chapterpage');
    }, 2000);
}

function showHebreërsComment() {
    const comment = document.getElementById('hebreërsComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('hebreërs_chapterpage');
    }, 2000);
}

function showDieBriefVanJakobusAanJisraelieteComment() {
    const comment = document.getElementById('die_brief_van_jakobus_aan_jisraelieteComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('die_brief_van_jakobus_aan_jisraeliete_chapterpage');
    }, 2000);
}

function showEersteBriefVanDieApostelPetrusComment() {
    const comment = document.getElementById('eerste_brief_van_die_apostel_petrusComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('eerste_brief_van_die_apostel_petrus_chapterpage');
    }, 2000);
}

function showTweedeBriefVanDieApostelPetrusComment() {
    const comment = document.getElementById('tweede_brief_van_die_apostel_petrusComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('tweede_brief_van_die_apostel_petrus_chapterpage');
    }, 2000);
}

function showEersteBriefVanDieApostelJehôwgananComment() {
    const comment = document.getElementById('eerste_brief_van_die_apostel_jehôwgananComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('eerste_brief_van_die_apostel_jehôwganan_chapterpage');
    }, 2000);
}

function showTweedeBriefVanDieApostelJehôwgananComment() {
    const comment = document.getElementById('tweede_brief_van_die_apostel_jehôwgananComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('tweede_brief_van_die_apostel_jehôwganan_chapterpage');
    }, 2000);
}

function showDerdeBriefVanDieApostelJehôwgananComment() {
    const comment = document.getElementById('derde_brief_van_die_apostel_jehôwgananComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('derde_brief_van_die_apostel_jehôwganan_chapterpage');
    }, 2000);
}

function showJudasComment() {
    const comment = document.getElementById('judasComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('judas_chapterpage');
    }, 2000);
}

function showOpenbaringVanPetrusComment() {
    const comment = document.getElementById('openbaring_van_petrusComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('openbaring_van_petrus_chapterpage');
    }, 2000);
}

function showOpenbaringVanJahwèshuaComment() {
    const comment = document.getElementById('openbaring_van_jahwèshuaComment');
    comment.textContent = "📖 Die Boodskap 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('openbaring_van_jahwèshua_chapterpage');
    }, 2000);
}

function showJubileumComment() {
    const comment = document.getElementById('jubileumComment');
    comment.textContent = "📖 Jubileum 📖";
    comment.style.display = 'block';
    setTimeout(() => {
        comment.style.display = 'none';
        navigate('jubileum_chapterpage');
    }, 2000);
}





