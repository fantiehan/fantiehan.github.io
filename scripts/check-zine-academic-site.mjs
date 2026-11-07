import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), 'utf8');
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const css = read('src/index.css');
const card = read('src/components/PublicationCard.tsx');
const pubs = read('src/content/publications.ts');
const home = read('src/pages/Home.tsx');
const publicationsPage = read('src/pages/Publications.tsx');

const profile = read('src/content/profile.ts');
const cv = read('src/content/cv.ts');
assert(profile.includes('Ph.D. Student / Multimodal LLMs & Visual Generation'), 'Profile headline should reflect current Ph.D. status');
assert(profile.includes('starting in September 2026'), 'Profile intro should mention the September 2026 Ph.D. start');
assert(cv.includes('range: "2026 - Present"') && cv.includes('Ph.D., Nanjing University'), 'Education should include the NJU Ph.D. entry starting 2026');

assert(!cv.includes('Publications:'), 'Education entries should not include publication count summaries');
assert(!cv.includes('Research:'), 'Education entries should not repeat research-interest summaries');
assert(!cv.includes('×'), 'Education entries should not include venue count shorthand');
const filesToScan = [
  'src/index.css',
  'src/App.tsx',
  'src/components/Background.tsx',
  'src/components/Button.tsx',
  'src/components/Footer.tsx',
  'src/components/NavBar.tsx',
  'src/components/PublicationCard.tsx',
  'src/components/Section.tsx',
  'src/components/Timeline.tsx',
  'src/components/PenStroke.tsx',
  'src/components/PublicationRow.tsx',
  'src/components/NewsList.tsx',
  'src/components/PosterPlate.tsx',
  'src/components/NotesList.tsx',
  'src/components/ButterflyMark.tsx',
  'src/components/ScrollPencil.tsx',
  'src/components/Pencil.tsx',
  'src/components/Signature.tsx',
  'src/components/ButterflyFlight.tsx',
  'src/components/MarginVine.tsx',
  'src/components/TopPencil.tsx',
  'src/opening/opening.ts',
  'src/opening/snapshot.ts',
  'src/opening/table.ts',
  'src/opening/state.ts',
  'src/boot.tsx',
  'scripts/bake-opening-paper.mjs',
  'src/store/masthead.ts',
  'src/content/notes.ts',
  'src/pages/Note.tsx',
  'src/pages/Notes.tsx',
  'src/content/news.ts',
  'src/content/cv.ts',
  'src/content/profile.ts',
  'src/content/publications.ts',
  'src/pages/CV.tsx',
  'src/pages/Home.tsx',
  'src/pages/Publications.tsx',
];

assert(css.includes('--paper: #f4ecd8'), 'global CSS should use the zine aged-paper token --paper: #f4ecd8');
assert(css.includes('--paper-deep: #ece1c6'), 'global CSS should include the deeper paper token --paper-deep: #ece1c6');
assert(css.includes('paper-grain'), 'global CSS should expose a paper-grain texture utility');
assert(css.includes('Newsreader') && css.includes('Courier Prime'), 'global typography should use the Newsreader serif with Courier Prime typewriter labels');
assert(css.includes('.ink-link') && css.includes('--link:') && !/\.ink-link[^{]*\{[^}]*(text-decoration-line|background-image)/.test(css), 'Text links should be marked by ink colour and weight, without underlines');
assert(read('src/components/Section.tsx').includes('PenStroke'), 'Section titles keep their hand-drawn pen stroke');
assert(card.includes('publication-plate'), 'PublicationCard should render the poster as a mounted plate');
const plate = read('src/components/PosterPlate.tsx');
assert(!plate.includes('aspect-['), 'Poster plate should keep each poster\'s own proportions instead of a fixed mat');
assert(plate.includes('function Ledge') && card.includes('grid-rows-subgrid'), 'Selected posters should stand on a shared hand-drawn ledge with captions aligned');
assert(plate.includes('object-contain') && !plate.includes('object-cover'), 'Poster plate should never crop the poster or figure');
assert(!card.includes('group-hover:opacity'), 'PublicationCard should not hide paper information behind a hover state');
assert(card.includes('item.title') && card.includes('Authors'), 'PublicationCard should always show the full title and authors');
assert(!card.includes('Show figure'), 'PublicationCard should not have a separate figure button');
assert(card.includes('onPointerEnter') && card.includes('<PosterPlate'), 'Hovering a publication card should swap the poster for the main figure');
assert(plate.includes('onTouchEnd') && plate.includes('hover:none'), 'Poster plate should flip by tap or swipe on touch screens and show a side indicator');
assert(card.includes('item.poster.accent'), 'PublicationCard should still use per-paper accent color as the artistic anchor');
assert(pubs.includes('instancecapPoster') && pubs.includes('@/assets/posters/instancecap.webp'), 'InstanceCap should use the provided poster WebP for browsing art');
assert(pubs.includes('motionsightPoster') && pubs.includes('@/assets/posters/motionsight.webp'), 'MotionSight should use the provided poster WebP for browsing art');
assert(pubs.includes('openvidPoster') && pubs.includes('@/assets/posters/openvid.webp'), 'OpenVid should use the provided poster WebP for browsing art');


assert(pubs.includes('RoMeRL: Balancing Feedback Coverage and the Memory-Reward Trap in Self-Evolving Agent Memory via Reduced-Order Utility States'), 'Publications should include the RoMeRL arXiv title from the PDF');
assert(pubs.includes('Yi Yang, Zhennan Chen, Yihong Zhuang, Tiehan Fan, Yinan Chen, Jian Li, Jian Yang, Ying Tai'), 'RoMeRL authors should match the PDF order');
assert(pubs.includes('venue: "arXiv"') && pubs.includes('type: "preprint"'), 'RoMeRL should be listed as an arXiv preprint');
assert(pubs.includes('https://arxiv.org/abs/2608.02508'), 'RoMeRL should include the arXiv URL');
assert(pubs.includes('romerlPoster') && pubs.includes('@/assets/posters/romerl.webp'), 'RoMeRL should use the provided poster WebP for browsing art');
assert(pubs.includes('screenshotUrl: romerl'), 'RoMeRL should use the cropped framework figure as hover preview');
assert(publicationsPage.includes('value: "preprint"') && publicationsPage.includes('title: "Preprints"'), 'Publications page should support preprint filtering and section display');
assert(pubs.includes('OpenVid++: A Large-scale High-quality Dataset for Text-to-video Generation'), 'Publications should include the OpenVid++ IJCV 2026 title from the PDF');
assert(pubs.includes('Kepan Nan, Tiehan Fan, Rui Xie, Penghao Zhou, Yilin Zhang, Xiang Li, Jian Yang, Zhenheng Yang, Xiaoming Liu, Ying Tai'), 'OpenVid++ authors should match the PDF order');
assert(pubs.includes('venue: "IJCV"') && pubs.includes('year: 2026'), 'OpenVid++ should be listed as IJCV 2026');
assert(pubs.includes('openvidPlusPlusPoster') && pubs.includes('@/assets/posters/openvid-plusplus.webp'), 'OpenVid++ should use the provided poster WebP for browsing art');
const openVidPlusPlusBlock = pubs.slice(pubs.indexOf('id: "nan2026openvidplusplus"'), pubs.indexOf('id: "zhao2026tca"'));
assert(!openVidPlusPlusBlock.includes('paperUrl:'), 'OpenVid++ should not add a direct paper URL before formal publication');
assert(!openVidPlusPlusBlock.includes('scholarUrl:'), 'OpenVid++ should not add a precise Scholar citation URL before formal publication');
assert(read('src/utils/publication.ts').includes('item.scholarUrl ?? `https://scholar.google.com/scholar?q=${encodeURIComponent(item.title)}`'), 'Publications should keep generic Scholar title search fallback');
assert(plate.includes('poster.imageUrl'), 'Poster plate should show the provided poster image by default');
const footer = read('src/components/Footer.tsx');
assert(footer.includes('Posters made with') && footer.includes('paper2humanist-poster'), 'Footer should credit the poster generation skill on every page');

assert(card.includes('item.venue} {item.year'), 'Publication caption should expose venue and year');

assert(pubs.includes('caption:'), 'Publication poster metadata should include a concise browsing caption');
const cvPage = read('src/pages/CV.tsx');
assert(!cvPage.includes('title="Skills"') && !cvPage.includes('skills.map'), 'CV page should not render the low-value Skills section');
assert(pubs.includes('poster:'), 'Publication records should include poster metadata for the zine cards');

assert(pubs.includes('Temporal and Cross-Modal Alignment for Enhanced Audiovisual Video Captioning'), 'Publications should include the ECCV 2026 TCA-Captioner title');
assert(pubs.includes('Chen Zhao, Jiajun Ma, Qilong Huang, Tiehan Fan, Hongyu Li, Zhuoliang Kang, Xiaoming Wei, Jian Yang, Ying Tai'), 'TCA-Captioner authors should be complete and in the verified order');
assert(pubs.includes('venue: "ECCV"') && pubs.includes('year: 2026'), 'TCA-Captioner should be listed as ECCV 2026');
assert(pubs.includes('tcaCaptioner') && pubs.includes('TCA-captioner.webp'), 'TCA-Captioner should import the compressed WebP browsing image');
assert(pubs.includes('https://arxiv.org/abs/2607.01667'), 'TCA-Captioner should include the arXiv paper URL');
assert(pubs.includes('citation_for_view=F11LXvYAAAAJ:UeHWp8X0CEIC'), 'TCA-Captioner should preserve the provided Google Scholar citation URL');
const newsList = read('src/components/NewsList.tsx');
assert(home.includes('<NewsList') && newsList.includes('news-ledger'), 'Home page should show the dated News ledger');
assert(!newsList.includes('contributionTag'), 'News entries should not mention first or co-first authorship');
for (const name of ['InstanceCap', 'MotionSight', 'OpenVid-1M', 'UltraHR-100K', 'TCA-Captioner']) {
  assert(pubs.includes(`shortTitle: "${name}"`), `Short title should use the official paper name ${name}`);
}
assert(cv.includes('range: "Jul 2025 - Oct 2026"'), 'ByteDance internship should run Jul 2025 - Oct 2026');
const notesData = read('src/content/notes.ts');
assert(card.includes('item.poster.concept'), 'Selected cards should end with the quiet plate note');
const signatureFile = read('src/components/Signature.tsx');
assert(home.includes('profile.tagline') && home.includes('<Signature') && home.includes('sr-only'), 'Home should open with the signature as the headline, keeping the name as hidden h1 text');
assert((home.match(/<Signature/g) || []).length === 1 && signatureFile.includes('signature-ink'), 'The signature should appear once on Home');
assert(signatureFile.includes('STROKES') && signatureFile.includes('<Pencil'), 'The pencil should write the signature stroke by stroke');
const scrollPencil = read('src/components/ScrollPencil.tsx');
assert(scrollPencil.includes('site-footer') && scrollPencil.includes('ruleAtEnd') && scrollPencil.includes('<ButterflyFlight'), 'The margin line should reach the footer rule at the end of the page and end in a butterfly that flies home');
assert(read('src/components/NavBar.tsx').includes('data-butterfly-home'), 'The nav mark should be where the butterfly lands');
assert(css.includes('.rule-t') && css.includes('rule.png') && !footer.includes('border-t'), 'Page rules should be hand-inked rather than CSS borders');
assert(css.includes('.page-develop') && read('src/App.tsx').includes('page-develop'), 'New pages should develop in like the headpieces');
assert(read('src/components/NavBar.tsx').includes('layoutId="nav-stroke"'), 'The current page should be marked by one travelling pen stroke');
assert(read('src/components/NavBar.tsx').includes('ButterflyMark') && read('src/components/NavBar.tsx').includes('signatureVisible') && read('src/components/NavBar.tsx').includes('AnimatePresence'), 'The nav name should fade in whenever the home signature is off screen');
assert(read('src/App.tsx').includes('<ScrollPencil'), 'The pencil reading-progress line should be mounted on every page');
assert(home.includes('IntersectionObserver'), 'Home should report whether the signature is on screen');
assert(read('index.html').includes('og-image.jpg'), 'Share metadata should point at the raster og image');
assert(!publicationsPage.includes('hand-drawn'), 'Copy should not describe generated posters as hand-drawn');
assert(!footer.includes('Last updated'), 'Footer should not show a last-updated date');
assert(footer.includes('crumpled-paper') && footer.includes('selection-flower') && footer.includes('Matt') && footer.includes('Omerico'), 'Footer should credit the LeiBox components and their design references');
assert(read('src/pages/Note.tsx').includes('<MarginVine'), 'Notes should grow the margin vine beside selected text');
assert(read('src/App.tsx').includes('<TopPencil') && read('src/components/TopPencil.tsx').includes('xl:hidden'), 'Narrow screens should get the pencil along the nav rule');
assert(read('src/components/MarginVine.tsx').includes('COMPACT_SCALE') && !read('src/components/MarginVine.tsx').includes('min-width: 1100px'), 'The vine should also grow, smaller, on narrow screens');
assert(read('src/main.tsx').includes('playOpening') && read('src/main.tsx').includes('import("./boot")'), 'The opening should run in the entry chunk while the site loads separately');
assert(signatureFile.includes('openingDone'), 'The signature should wait for the opening to finish');
assert(read('src/opening/opening.ts').includes('printPage') && read('src/opening/opening.ts').includes('draftPage'), 'The opening sheet should carry the page itself from the start');
assert(read('src/opening/opening.ts').includes('drawTable') && read('src/opening/table.ts').includes('drawKnot'), 'The opening sheet should sit on a hand-drawn wooden table');
assert(read('src/opening/opening.ts').includes('hintMarkup') && read('src/opening/hintArt.ts').includes('HINT_ARROW'), 'The opening sheet should wait to be opened, with a hand-drawn hint');
assert((notesData.match(/slug: "/g) || []).length >= 3, 'Notes should include at least three pieces');
assert((notesData.match(/banner: banner/g) || []).length === (notesData.match(/slug: "/g) || []).length, 'Every note should have a headpiece banner');
assert(read('src/pages/Note.tsx').includes('Sidenote') && css.includes('.sidenote'), 'Notes should put sources and caveats in Tufte-style sidenotes');
assert(read('src/pages/Note.tsx').includes('columns-') && (pubs.match(/derivation:/g) || []).length === (pubs.match(/shortTitle:/g) || []).length, 'The posters note should show every poster with its derivation note');
assert(!read('src/App.tsx').includes('Plates'), 'There should be no separate Plates page duplicating Publications');
assert(home.includes('profile.intro.map'), 'Home page should render the full personal introduction from profile.intro');
assert(!home.includes('Why make papers feel like paper'), 'Home page should not include the added design-rationale essay');
assert(!home.includes('Personal academic website'), 'Home masthead should not include generic template labels');


assert(!home.includes('entries`}') && !publicationsPage.includes('entries`}'), 'Publication sections should not display paper counts as entries metadata');
assert(!publicationsPage.includes('Total:') && !publicationsPage.includes('records'), 'Publications page should not show total or records count badges');

for (const fillerMeta of ['academic path', 'current role', 'industry research', 'research identity', 'degrees and labs', 'email and scholar', 'compact list']) {
  assert(!home.includes(fillerMeta) && !cvPage.includes(fillerMeta) && !publicationsPage.includes(fillerMeta), `Section meta should not include low-value label: ${fillerMeta}`);
}
assert(!home.includes('Research note'), 'Home page should not include explanatory research-note filler');

for (const file of filesToScan) {
  const content = read(file);
  if (/[—–]/.test(content)) {
    failures.push(`${file} contains an em dash or separator en dash; use a regular hyphen instead`);
  }
}

if (failures.length) {
  console.error('Zine academic site checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Zine academic site checks passed.');
