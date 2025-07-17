  const updateUrl = "https://boekvanherinnering.github.io/bibleapp/update-message.json";
  const currentAppVersion = "1.5"; // This must match your app version


  
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







let menuWasForcedOpen = false;

const menuBtn = document.getElementById('menuToggleBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  const isOpen = menu.classList.contains('show');

  if (isOpen && menuWasForcedOpen) {
    // Allow toggle again after auto-open
    menuWasForcedOpen = false;
  }

  menu.classList.toggle('show');

  if (menu.classList.contains('show')) {
    menuBtn.textContent = '🔷 Menu';
    menuBtn.classList.add('open');
  } else {
    menuBtn.textContent = '🔷 Menu';
    menuBtn.classList.remove('open');
  }
});

function closeMenu() {
  const menu = document.getElementById("menu");
  menu.classList.remove("show"); // ✅ This will always close the menu
}


const bookNameMap = {
  'genesis': 'Genesis',
  'exodus': 'Exodus',
  'levitikus': 'Levitikus',
  'numeri': 'Numeri',
  'deuteronomium': 'Deuteronomium',
  'josua': 'Josua',
  'richters': 'Rigters',
  'rut': 'Rut',
  'een_samuel': '1 Samuel',
  'twee_samuel': '2 Samuel',
  'een_konings': '1 Konings',
  'twee_konings': '2 Konings',
  'een_kronieke': '1 Kronieke',
  'twee_kronieke': '2 Kronieke',
  'esra': 'Esra',
  'nehemia': 'Nehemia',
  'ester': 'Ester',
  'job': 'Job',
  'psalms': 'Psalms',
  'spreuke': 'Spreuke',
  'prediker': 'Prediker',
  'hooglied': 'Hooglied',
  'jesaja': 'Jesaja',
  'jeremia': 'Jeremia',
  'klaagliedere': 'Klaagliedere',
  'esegiel': 'Esegiël',
  'daniel': 'Daniël',
  'hosea': 'Hosea',
  'joel': 'Joël',
  'amos': 'Amos',
  'obadja': 'Obadja',
  'jonah': 'Jona',
  'miga': 'Miga',
  'nahum': 'Nahum',
  'habakuk': 'Habakuk',
  'sefanja': 'Sefanja',
  'haggaeus': 'Haggai',
  'sagaria': 'Sagaria',
  'maleagi': 'Maleagi',
  'matteus': 'Matteus',
  'markus': 'Markus',
  'lukas': 'Lukas',
  'johannes': 'Johannes',
  'handelinge': 'Handelinge',
  'romeine': 'Romeine',
  '1_korintiers': '1 Korintiërs',
  '2_korintiers': '2 Korintiërs',
  'galasiers': 'Galasiërs',
  'efesiers': 'Efesiërs',
  'filippense': 'Filippense',
  'kolossense': 'Kolossense',
  '1_tessalonisense': '1 Tessalonisense',
  '2_tessalonisense': '2 Tessalonisense',
  '1_timoteus': '1 Timoteus',
  '2_timoteus': '2 Timoteus',
  'titus': 'Titus',
  'filemon': 'Filemon',
  'hebreers': 'Hebreërs',
  'jakobus': 'Jakobus',
  '1_petrus': '1 Petrus',
  '2_petrus': '2 Petrus',
  '1_johannes': '1 Johannes',
  '2_johannes': '2 Johannes',
  '3_johannes': '3 Johannes',
  'judas': 'Judas',
  'openbaring': 'Openbaring',
  'een_makkabeers': '1 Makkabeërs',
  'twee_makkabeers': '2 Makkabeërs'
};







// ✅ Hold selected verse IDs
let selectedVerseIDs = [];

let lastTap = 0;

// ✅ Get selected text from selectedVerseIDs
function getSelectedVerses() {
  return selectedVerseIDs.map(id => {
    const el = document.getElementById(id.trim());
    return el ? el.textContent : '';
  }).filter(text => text).join('\n\n');
}

function openVerseCardPreview() {
  if (selectedVerseIDs.length === 0) {
    alert("Please select at least one verse.");
    return;
  }

  const selectedElements = selectedVerseIDs.map(id => document.getElementById(id));
  const selectedText = selectedElements.map(el => el?.textContent.trim()).join(" ");
  const first = selectedVerseIDs[0] || "";
  const [book, chapter, verse] = first.split("_");

  const reference = selectedVerseIDs.length > 1
    ? `${book} ${chapter}:${selectedVerseIDs.map(id => id.split("_")[2]).join(", ")}`
    : `${book} ${chapter}:${verse}`;

  const previewData = {
    text: selectedText,
    reference: reference
  };

  const encoded = encodeURIComponent(JSON.stringify(previewData));
  
  // Open the GitHub-hosted verseCard page with data in query string
  window.open(`https://boekvanherinnering.github.io/bibleapp/preview.html?data=${encoded}`, "_blank");
}






// ✅ Clear selected
function clearSelectedVerses() {
  selectedVerseIDs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("multi-selected");
  });
  selectedVerseIDs = [];
  popup.dataset.verse = "";
  hidePopup();
}

// ✅ Create popup
const popup = document.createElement('div');
popup.className = 'popup-menu';
popup.innerHTML = `
  <button onclick="copyVerse()">📋 Copy</button>
    <button id="shareVerseBtn">🖼️ Preview & Share Verse</button>


  <button onclick="saveFavorite()">⭐ Add to Favorites</button>
  <button onclick="clearSelectedVerses()">🗑️ Clear All</button>
  <button onclick="hidePopup()" class="cancel-btn">❌ Cancel</button>
`;
document.body.appendChild(popup);

document.getElementById("shareVerseBtn").onclick = () => {
  if (selectedVerseIDs.length === 0) {
    alert("Please select at least one verse.");
    return;
  }

  // Group verses by book and chapter
  const versesByBookChapter = {};

  selectedVerseIDs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    const parts = id.split("_"); // e.g. ['een', 'konings', '1', '3']
    const bookKey = parts.slice(0, 2).join("_"); // 'een_konings'
    const chapter = parts[2];
    const verse = parts[3];

    if (!versesByBookChapter[bookKey]) versesByBookChapter[bookKey] = {};
    if (!versesByBookChapter[bookKey][chapter]) versesByBookChapter[bookKey][chapter] = [];

    versesByBookChapter[bookKey][chapter].push({
      verse,
      text: el.textContent.trim()
    });
  });

  // Build formatted preview text
  let previewText = "";
  let references = [];

  for (const bookKey in versesByBookChapter) {
    // Get readable book name from your HTML (like you did for favorites)
    const page = document.getElementById(`${bookKey}_scriptur_chapter1`); // use chapter 1 as reference
    let bookName = bookKey;
    if (page) {
      const h2 = page.querySelector("h2");
      if (h2) bookName = h2.textContent.split(" Hoofstuk")[0];
    }

    for (const chapter in versesByBookChapter[bookKey]) {
      previewText += `${bookName} Hoofstuk ${chapter}\n`;
      versesByBookChapter[bookKey][chapter]
        .sort((a, b) => a.verse - b.verse)
        .forEach(v => {
          previewText += `  ${v.verse}: ${v.text}\n`;
        });
      previewText += "\n";

      references.push(`${bookName} ${chapter}`);
    }
  }

  const referenceText = [...new Set(references)].join(", ");

  // Prepare data object
  const previewData = {
    text: previewText.trim(),
    reference: referenceText
  };

  const encoded = encodeURIComponent(JSON.stringify(previewData));
  window.open(`https://boekvanherinnering.github.io/bibleapp/preview.html?data=${encoded}`, "_blank");

  // Clear highlights & selections (optional)
  selectedVerseIDs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("multi-selected");
  });
  selectedVerseIDs = [];
};





// ✅ Show popup on tap or double-click
document.querySelectorAll('p[data-verse]').forEach(verse => {
  const id = verse.id;

  if (localStorage.getItem("favorite_" + id)) {
    verse.classList.add("favorite-highlight");
  }

  verse.addEventListener('touchend', function (e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    lastTap = currentTime;
    if (tapLength < 300 && tapLength > 0) showPopup(e, verse);
  });

  verse.addEventListener('dblclick', function (e) {
    showPopup(e, verse);
  });
});

// ✅ Show popup function (selects verse)
function showPopup(e, verseElement) {
  const id = verseElement.id;

  if (!selectedVerseIDs.includes(id)) {
    selectedVerseIDs.push(id);
    verseElement.classList.add("multi-selected");
  }

  popup.dataset.verse = selectedVerseIDs.join(",");
  popup.classList.add("show");
}

function hidePopup() {
  popup.classList.remove("show");
}

document.addEventListener('click', function (e) {
  if (!popup.contains(e.target)) hidePopup();
});

// ✅ Copy to clipboard
function copyVerse() {
  const text = getSelectedVerses();
  navigator.clipboard.writeText(text);
  alert("Verse copied!");
  hidePopup();
}


















// function saveFavorite
function saveFavorite() {
  const verseIDs = Array.from(document.querySelectorAll('.multi-selected')).map(el => el.id);

  verseIDs.forEach(verseID => {
    localStorage.setItem("favorite_" + verseID, "true");

    const verseElem = document.getElementById(verseID);
    if (verseElem) {
      verseElem.classList.remove("multi-selected");
      verseElem.classList.add("favorite-highlight");
      if (verseID.startsWith("genésis") || 
      verseID.startsWith("exodus") || 
      verseID.startsWith("levitikus") || 
      verseID.startsWith("numeri") || 
      verseID.startsWith("deuteronómium")) {
      verseElem.classList.add("torah-highlight");
      } else if (verseID.startsWith("jehowshua")||
      verseID.startsWith("rigters")||
      verseID.startsWith("een_shemuel")||
      verseID.startsWith("twee_shemuel")||
      verseID.startsWith("een_konings")||
      verseID.startsWith("twee_konings")||
      verseID.startsWith("een_kronieke")||
      verseID.startsWith("twee_kronieke")||
      verseID.startsWith("opregte")||
      verseID.startsWith("een_makkabeers")||
      verseID.startsWith("twee_makkabeers")) {
      verseElem.classList.add("prophet-highlight");
      } else if (verseID.startsWith("psalms")||
      verseID.startsWith("spreuke_van_salomo")||
      verseID.startsWith("prediker")||
      verseID.startsWith("hooglied_van_salomo")||
      verseID.startsWith("wyshied_van_salomo")||
      verseID.startsWith("odes_van_salomo")||
      verseID.startsWith("die_wysheid_van_jehôwshua_ben_sirah")||
      verseID.startsWith("rut")||
      verseID.startsWith("judit")||
      verseID.startsWith("ester")||
      verseID.startsWith("tobias")||
      verseID.startsWith("job")) {
      verseElem.classList.add("writing-highlight");
      } else if (verseID.startsWith("henog")||
      verseID.startsWith("jôwel")||
      verseID.startsWith("amos")||
      verseID.startsWith("hoséa")||
      verseID.startsWith("miga")||
      verseID.startsWith("jeshajah")||
      verseID.startsWith("nahum")||
      verseID.startsWith("habakuk")||
      verseID.startsWith("sefanja")||
      verseID.startsWith("jeremia")||
      verseID.startsWith("klaagliedere_van_jeremia")||
      verseID.startsWith("barug")||
      verseID.startsWith("esegiël")||
      verseID.startsWith("jeremia")||
      verseID.startsWith("klaagliedere_van_jeremia")||
      verseID.startsWith("barug")||
      verseID.startsWith("esegiël")||
      verseID.startsWith("daniël")||
      verseID.startsWith("een_esra")||
      verseID.startsWith("twee_esra")||
      verseID.startsWith("esra")||
      verseID.startsWith("obadja")||
      verseID.startsWith("haggai")||
      verseID.startsWith("sagaria")||
      verseID.startsWith("nehemia")||
      verseID.startsWith("maleagi")) {
      verseElem.classList.add("gospel-highlight");
      } else if (verseID.startsWith("jakobus")||
      verseID.startsWith("thomas")||
      verseID.startsWith("lukas")||
      verseID.startsWith("mattithjahûw")||
      verseID.startsWith("markus")||
      verseID.startsWith("jehôwganan")||
      verseID.startsWith("petrus")||
      verseID.startsWith("nikodémus_deel_1")||
      verseID.startsWith("nikodémus_deel_2")||
      verseID.startsWith("handelinge_van_die_apostels")||
      verseID.startsWith("sendbriewe_van_abgarus_en_jahwèshua")||
      verseID.startsWith("hebreërs")||
      verseID.startsWith("die_brief_van_jakobus_aan_jisraeliete")||
      verseID.startsWith("eerste_brief_van_die_apostel_petrus")||
      verseID.startsWith("tweede_brief_van_die_apostel_petrus")||
      verseID.startsWith("eerste_brief_van_die_apostel_jehôwganan")||
      verseID.startsWith("tweede_brief_van_die_apostel_jehôwganan")||
      verseID.startsWith("derde_brief_van_die_apostel_jehôwganan")||
      verseID.startsWith("judas")||
      verseID.startsWith("openbaring_van_petrus")||
      verseID.startsWith("openbaring_van_jahwèshua")||
      verseID.startsWith("jubileum")) {
      verseElem.classList.add("letter-highlight");
      }
    }
  });

  popup.dataset.verse = '';
  hidePopup();

  const lastID = verseIDs[verseIDs.length - 1];
  const verseElem = document.getElementById(lastID);
  if (!verseElem) return;

  const versePage = verseElem.closest('.page');
  if (versePage) {
    localStorage.setItem('lastVersePage', versePage.id);
    localStorage.setItem('lastVerseScrollY', verseElem.offsetTop);
  }

  const page = document.getElementById("favoritesPage");
  const button = document.getElementById("favoritesBtn");
  page.style.display = "block";
  button.innerText = "🔙 Close Favorites";
  showFavoritesPage();

  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

  const oldBtn = document.querySelector('.return-favorite-btn');
  if (oldBtn) oldBtn.remove();

  const returnBtn = document.createElement('button');
  returnBtn.className = 'return-favorite-btn';
  returnBtn.textContent = '↩️ Return to Verse';
  returnBtn.style.position = 'fixed';
  returnBtn.style.bottom = '5px';
  returnBtn.style.right = 'center';
  returnBtn.style.width = '100px';
  returnBtn.style.padding = '3px';
  returnBtn.style.zIndex = '999';
  returnBtn.style.borderRadius = '10px';
  returnBtn.style.background = '#007BFF';
  returnBtn.style.color = '#fff';
  returnBtn.style.border = 'none';
  returnBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  returnBtn.onclick = () => {
    const pageId = localStorage.getItem('lastVersePage');
    const scrollY = localStorage.getItem('lastVerseScrollY');
    if (pageId) {
      navigate(pageId);
      setTimeout(() => {
        window.scrollTo({ top: parseInt(scrollY), behavior: 'smooth' });
      }, 200);
    }
    returnBtn.remove();
  };

  document.body.appendChild(returnBtn);

  setTimeout(() => {
    document.querySelectorAll('button').forEach(btn => {
      if (btn !== returnBtn) {
        btn.addEventListener('click', () => {
          returnBtn.remove();
        }, { once: true });
      }
    });
  }, 100);

  document.getElementById("homepage").classList.remove('hidden');

  setTimeout(() => {
    const favList = document.getElementById("favoritesList");
    verseIDs.forEach(verseID => {
      const newItem = favList.querySelector(`[data-id="${verseID}"]`);
      if (newItem) {
        newItem.scrollIntoView({ behavior: "smooth", block: "center" });
        newItem.classList.add("temp-highlight");

        setTimeout(() => {
          newItem.classList.add("fade-out");
        }, 4000);

        setTimeout(() => {
          newItem.classList.remove("temp-highlight", "fade-out");
        }, 6000);
      }
    });
  }, 200);

  if (!menu.classList.contains("show")) {
    menu.classList.add("show");
    menuBtn.textContent = '🔷 Menu';
    menuBtn.classList.add('open');
    menuWasForcedOpen = true;
  }
}


function toggleFavoritesPage() {
  const page = document.getElementById("favoritesPage");
  const button = document.getElementById("favoritesBtn");

  if (page.style.display === "block") {
    page.style.display = "none";
    button.innerText = "⭐ View Favorites";
  } else {
    page.style.display = "block";
    button.innerText = "🔙 Close Favorites";
    showFavoritesPage();
  }
}

function showFavoritesPage() {
  const list = document.getElementById("favoritesList");
  list.innerHTML = "";

  const keys = Object.keys(localStorage)
    .filter(k => k.startsWith("favorite_"))
    .sort();

  if (keys.length === 0) {
    list.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  keys.forEach(key => {
    const id = key.replace("favorite_", "");
    const verseElem = document.getElementById(id);
    if (!verseElem) return;

    const text = verseElem.textContent;
    const noteKey = "note_" + id;
    const note = localStorage.getItem(noteKey) || "";

    const verseParts = id.split("_"); // ['een', 'konings', '1', '3']
    const bookPrefix = `${verseParts[0]}_${verseParts[1]}`; // een_konings
    const chapterNum = verseParts[2]; // 1
    const verseNum = verseParts[3]; // 3

    const pageId = `${bookPrefix}_scriptur_chapter${chapterNum}`;
    const pageElement = document.getElementById(pageId);

    let readableTitle = id;
if (pageElement) {
  const h2 = pageElement.querySelector("h2");
  if (h2) {
    // Prefer h2 if available
    readableTitle = h2.textContent + " " + verseParts[2];
  } else {
    // Or fallback to book name map
    const bookKey = verseParts[0]; // e.g. 'een_konings'
    const bookName = bookNameMap[bookKey] || bookKey;
    readableTitle = bookName + " " + verseParts[1] + ":" + verseParts[2];
  }
}


    const item = document.createElement("div");
    item.className = "favorite-item";
    item.dataset.id = id;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => {
      deleteFavorite(id);
      location.reload();
    };

    const content = document.createElement("div");
    content.innerHTML = `
      <strong>${readableTitle}</strong><br>
      <p>${text}</p>
      <textarea placeholder="Add a note..." style="width:100%;border-radius:5px;"
        oninput="debouncedSaveNote('${id}', this.value)">${note}</textarea>
    `;

    item.appendChild(deleteBtn);
    item.appendChild(content);
    list.appendChild(item);
  });
}


function deleteFavorite(id) {
  localStorage.removeItem("favorite_" + id);
  localStorage.removeItem("note_" + id);
  showFavoritesPage();

  const verseElem = document.getElementById(id);
  if (verseElem) {
    verseElem.classList.remove(
      "favorite-highlight",
      "torah-highlight",
      "prophet-highlight",
      "writing-highlight",
      "gospel-highlight",
      "letter-highlight"
    );
  }

  // Refresh page immediately
  location.reload();
}



function hideFavoritesPage() {
  document.getElementById("favoritesPage").style.display = "none";
  document.getElementById("favoritesBtn").innerText = "⭐ View Favorites";

  const lastPageId = localStorage.getItem("lastVersePage");
  if (lastPageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const lastPage = document.getElementById(lastPageId);
    if (lastPage) lastPage.classList.remove('hidden');
  }
}

const debounceTimers = {};
function debouncedSaveNote(id, text) {
  if (debounceTimers[id]) clearTimeout(debounceTimers[id]);
  debounceTimers[id] = setTimeout(() => {
    localStorage.setItem("note_" + id, text);
  }, 500);
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





document.addEventListener("DOMContentLoaded", () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("favorite_"));

  keys.forEach(key => {
    const id = key.replace("favorite_", "");
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.add("favorite-highlight");

    // Add correct category highlight
    if (id.startsWith("genésis") || id.startsWith("exodus") || id.startsWith("levitikus") || id.startsWith("numeri") || id.startsWith("deuteronómium")) {
      el.classList.add("torah-highlight");
    } else if (id.startsWith("jeshajah") || id.startsWith("jeremia") || id.startsWith("esegiël")) {
      el.classList.add("prophet-highlight");
    } else if (id.startsWith("psalms") || id.startsWith("spreuke") || id.startsWith("prediker")) {
      el.classList.add("writing-highlight");
    } else if (id.startsWith("mattithjahûw") || id.startsWith("markus") || id.startsWith("lukas") || id.startsWith("jehôwganan")) {
      el.classList.add("gospel-highlight");
    } else if (id.startsWith("jakobus") || id.startsWith("petrus") || id.startsWith("hebreërs")) {
      el.classList.add("letter-highlight");
    }
  });
});






