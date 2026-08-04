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
  'src/components/Badge.tsx',
  'src/components/Button.tsx',
  'src/components/Footer.tsx',
  'src/components/NavBar.tsx',
  'src/components/PublicationCard.tsx',
  'src/components/Section.tsx',
  'src/components/Timeline.tsx',
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
assert(css.includes('EB Garamond') && css.includes('JetBrains Mono'), 'global typography should use the zine serif/mono stack');
assert(card.includes('publication-art-card'), 'PublicationCard should identify the artistic browsing card surface');
assert(card.includes('aspect-[3/5]'), 'PublicationCard should use a vertical full-poster card ratio in browsing state');
assert(card.includes('poster-art-panel') && card.includes('absolute inset-0'), 'PublicationCard default layer should be a full-card artistic poster panel');
assert(card.includes('info-preview-panel'), 'PublicationCard hover layer should show paper preview and publication information');
assert(card.includes('paper-preview-panel'), 'PublicationCard hover layer should include a full paper preview region');
assert(card.includes('object-contain'), 'PublicationCard hover preview image should be fully visible with object-contain');
assert(card.includes('duration-700'), 'PublicationCard hover/focus layer transition should be slow enough to read');
assert(card.includes('duration: 0.46'), 'PublicationCard hover lift animation should be slower than the default quick motion');
assert(card.includes('group-hover:opacity-0') && card.includes('group-hover:opacity-100'), 'PublicationCard should crossfade full-card art to info and preview on hover');
assert(!card.includes('aspect-[3/2]'), 'PublicationCard should not use horizontal 3:2 card layout');
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
assert(publicationsPage.includes('<option value="preprint">Preprint</option>') && publicationsPage.includes('title="Preprints"'), 'Publications page should support preprint filtering and section display');
assert(pubs.includes('OpenVid++: A Large-scale High-quality Dataset for Text-to-video Generation'), 'Publications should include the OpenVid++ IJCV 2026 title from the PDF');
assert(pubs.includes('Kepan Nan, Tiehan Fan, Rui Xie, Penghao Zhou, Yilin Zhang, Xiang Li, Jian Yang, Zhenheng Yang, Xiaoming Liu, Ying Tai'), 'OpenVid++ authors should match the PDF order');
assert(pubs.includes('venue: "IJCV"') && pubs.includes('year: 2026'), 'OpenVid++ should be listed as IJCV 2026');
assert(pubs.includes('openvidPlusPlusPoster') && pubs.includes('@/assets/posters/openvid-plusplus.webp'), 'OpenVid++ should use the provided poster WebP for browsing art');
const openVidPlusPlusBlock = pubs.slice(pubs.indexOf('id: "nan2026openvidplusplus"'), pubs.indexOf('id: "zhao2026tca"'));
assert(!openVidPlusPlusBlock.includes('paperUrl:'), 'OpenVid++ should not add a direct paper URL before formal publication');
assert(!openVidPlusPlusBlock.includes('scholarUrl:'), 'OpenVid++ should not add a precise Scholar citation URL before formal publication');
assert(card.includes('scholarHref = item.scholarUrl ?? `https://scholar.google.com/scholar?q=${encodeURIComponent(item.title)}`'), 'PublicationCard should keep generic Scholar title search fallback');
assert(card.includes('poster.imageUrl'), 'PublicationCard should prefer provided poster images for default art browsing state');
assert(home.includes('Posters made with paper2humanist-poster'), 'Home selected papers should credit the poster generation skill');
assert(publicationsPage.includes('Posters made with paper2humanist-poster'), 'Publications page should credit the poster generation skill');

assert(card.includes('poster-catalog-caption'), 'PublicationCard default browsing state should include a catalog-style caption outside the poster image');
assert(card.includes('item.poster.shortTitle'), 'Catalog caption should expose the short paper title in browsing state');
assert(card.includes('item.venue} {item.year'), 'Catalog caption should expose venue and year in browsing state');

assert(pubs.includes('caption:'), 'Publication poster metadata should include a concise browsing caption');
assert(card.includes('item.poster.caption'), 'Catalog caption should show a concise paper topic in browsing state');
const cvPage = read('src/pages/CV.tsx');
assert(!cvPage.includes('title="Skills"') && !cvPage.includes('skills.map'), 'CV page should not render the low-value Skills section');
assert(card.includes('flex-1') && card.includes('border-t border-[var(--line)]'), 'Catalog caption should be separated from the poster image rather than overlaid on top of it');
assert(pubs.includes('poster:'), 'Publication records should include poster metadata for the zine cards');

assert(pubs.includes('Temporal and Cross-Modal Alignment for Enhanced Audiovisual Video Captioning'), 'Publications should include the ECCV 2026 TCA-Captioner title');
assert(pubs.includes('Chen Zhao, Jiajun Ma, Qilong Huang, Tiehan Fan, Hongyu Li, Zhuoliang Kang, Xiaoming Wei, Jian Yang, Ying Tai'), 'TCA-Captioner authors should be complete and in the verified order');
assert(pubs.includes('venue: "ECCV"') && pubs.includes('year: 2026'), 'TCA-Captioner should be listed as ECCV 2026');
assert(pubs.includes('tcaCaptioner') && pubs.includes('TCA-captioner.webp'), 'TCA-Captioner should import the compressed WebP browsing image');
assert(pubs.includes('https://arxiv.org/abs/2607.01667'), 'TCA-Captioner should include the arXiv paper URL');
assert(pubs.includes('citation_for_view=F11LXvYAAAAJ:UeHWp8X0CEIC'), 'TCA-Captioner should preserve the provided Google Scholar citation URL');
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
