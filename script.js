const sourceMarkers = [
  'Homepage / Introduction','Section 1 - Why Greece Is Vulnerable','Section 2 - Earthquakes:','Section 3 - Tsunamis','Section 4 - Volcanic Hazards','Section 5 - Wildfires','Section 6 - Flooding','Section 7 - Heat Waves, Drought, Water Scarcity, and Sea-Level Rise',"Section 8 - Greece's Disaster Response Capabilities",'Section 9 - Social, Political, and Economic Factors','Section 10 - Recommendations','Conclusion','Images and Visual Aids to Add to the Website','APA References - Professional Sources Only'
];
const normalize = s => s.replace(/â€™/g,'’').replace(/â€“/g,'–').replace(/ï‚·/g,'').replace(/\r/g,'').trim();
const sections = {};
function splitSource(text){
  const clean=normalize(text);
  const locate=(m,from=0)=>m==='Conclusion'?clean.indexOf('\nConclusion\n',from)+1:clean.indexOf(m,from);
  sourceMarkers.forEach((m,i)=>{const start=locate(m);if(start<0)return;const next=i+1<sourceMarkers.length?locate(sourceMarkers[i+1],start+1):clean.length;sections[m]=clean.slice(start+m.length,next<0?clean.length:next).trim();});
}
function sectionCopy(marker){
  let value=sections[marker]||'';
  if(marker==='Homepage / Introduction')value=value.split('Suggested homepage visuals')[0];
  if(marker==='Section 1 - Why Greece Is Vulnerable')value=value.split('Hazard ranking for Greece')[0];
  return value;
}
function paragraphs(text){
  const joined=text.split('\n').map(x=>x.trim()).filter(Boolean).join(' ');
  const starts=['The central argument','The coastline','Greece also','Finally,','The World Bank','Greece’s earthquake','A major recent','Research after','Greece has a strong','Analysis:','Website facts','Greece’s tsunami','The most important historical','More recent research','Santorini is','The main volcanic','Nisyros','The 2023','The European Commission’s','Copernicus Sentinel','Storm Daniel','The European Commission explains','The EEA/Climate','Sea-level rise','Greece also uses','Greece’s monitoring','However,','Social factors:','Political factors:','Economic factors:','Geographic inequality:','Conclusion for this section:','Flooding should','The most important conclusion'];
  let out=joined;starts.forEach(s=>{out=out.replaceAll(' '+s,'\n'+s)});
  return out.split('\n').filter(Boolean).map(p=>`<p class="${p.startsWith('Analysis:')?'analysis':''}">${p.startsWith('Analysis:')?'<strong>Analysis</strong> '+p.slice(9):p}</p>`).join('');
}
const ranking=[
['Earthquakes','Very High','Frequent seismicity and potential for rare high-impact events.','Aegean islands, western Greece, Athens region, Crete, Ionian islands'],
['Wildfires','Very High','Hot dry summers, drought, wind, vegetation, expanding fire seasons.','Attica, Peloponnese, Evia, Rhodes, Crete, northern Greece'],
['Flooding','High','Short intense rainfall, steep terrain, urban drainage limits, floodplain exposure.','Thessaly, Attica, coastal valleys, urban areas'],
['Heat waves / drought','High','Mediterranean warming, water scarcity, public-health impacts.','Urban areas, agricultural plains, islands'],
['Tsunamis','Moderate but high consequence','Rare but possible from submarine earthquakes or landslides.','Aegean islands, Crete, Dodecanese, Cyclades, coastal ports'],
['Volcanoes','Moderate but high consequence','Active volcanic arc; low frequency but serious local impacts.','Santorini, Kolumbo area, Nisyros, Milos, Methana'],
['Sea-level rise','Moderate to High','Slow-onset risk to coasts, beaches, ports, tourism, wetlands.','Low-lying coasts, islands, ports, tourism zones']
];
const hazards=[
  {n:'02',title:'Earthquakes',marker:'Section 2 - Earthquakes:',image:'samos-earthquake.jpg',alt:'Search-and-rescue work after the 2020 Aegean Sea earthquake',credit:'Oğulcan Bakiler / Voice of America, public domain.',page:'https://commons.wikimedia.org/wiki/File:2020_Aegean_Sea_earthquake_search_and_rescue_efforts_2.jpg'},
  {n:'03',title:'Tsunamis',marker:'Section 3 - Tsunamis',image:'tsunami-route.jpg',alt:'A tsunami evacuation route sign',credit:'DimiTalen, CC0. Illustrative evacuation signage.',page:'https://commons.wikimedia.org/wiki/File:Tsunami_evacuation_route_sign_on_the_road,_Kamakura,_2016.jpg'},
  {n:'04',title:'Volcanic hazards',marker:'Section 4 - Volcanic Hazards',image:'santorini-caldera.jpg',alt:'Layered volcanic caldera wall at Akrotiri, Santorini',credit:'Dietmar Rabich, CC BY-SA 4.0.',page:'https://commons.wikimedia.org/wiki/File:Santorin_(GR),_Akrotiri,_Caldera_--_2017_--_3007.jpg'},
  {n:'05',title:'Wildfires',marker:'Section 5 - Wildfires',image:'alexandroupolis-wildfire.jpg',alt:'Copernicus satellite view of the 2023 Alexandroupolis wildfire',credit:'European Union, Copernicus Sentinel-2 imagery.',page:'https://commons.wikimedia.org/wiki/File:The_wildfire_in_the_Northeast_Greece,_one_of_the_largest_ever_recorded_in_Europe_(Copernicus_2023-08-26).webp'},
  {n:'06',title:'Flooding',marker:'Section 6 - Flooding',image:'storm-daniel.jpg',alt:'Flooded plains near Palamas, Thessaly after Storm Daniel',credit:'Makis Theodorou, CC BY-SA 3.0.',page:'https://commons.wikimedia.org/wiki/File:Greece_Storm_Daniel_DJI_0188.jpg'},
  {n:'07',title:'Heat, drought & coasts',marker:'Section 7 - Heat Waves, Drought, Water Scarcity, and Sea-Level Rise',image:'southern-europe-heat.jpg',alt:'ESA land-surface temperature map of southern Europe',credit:'European Space Agency, CC BY-SA 3.0 IGO.',page:'https://commons.wikimedia.org/wiki/File:Sweltering_southern_Europe_ESA382392.jpg'}
];
function render(){
  document.querySelectorAll('[data-source]').forEach(el=>el.innerHTML=paragraphs(sectionCopy(el.dataset.source)));
  document.querySelector('#ranking-body').innerHTML=ranking.map(r=>`<tr><td>${r[0]}</td><td><span class="risk">${r[1]}</span></td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');
  document.querySelector('#hazard-cards').innerHTML=hazards.map(h=>`<a class="hazard-card" href="#${h.title.toLowerCase().replace(/[^a-z]+/g,'-')}"><span>${h.n} · Hazard</span><h3>${h.title}</h3></a>`).join('');
  document.querySelector('#hazard-sections').innerHTML=hazards.map(h=>`<section class="section hazard-detail" id="${h.title.toLowerCase().replace(/[^a-z]+/g,'-')}"><div class="section-heading"><p class="kicker">${h.n} · Hazard analysis</p><h2>${h.title}</h2></div><div class="prose">${paragraphs(sections[h.marker]||'')}</div><figure class="source-image"><img src="images/${h.image}" alt="${h.alt}"><figcaption><strong>${h.alt}</strong>${h.credit} <a href="${h.page}">View source</a></figcaption></figure></section>`).join('');
  renderRecommendations();renderReferences();
}
function renderRecommendations(){
  const text=(sections['Section 10 - Recommendations']||'').split('\n').map(x=>x.trim()).filter(Boolean).join(' ');
  const re=/(\d)\. ([^\d]+?)(?=\s\d\. |$)/g;let m,items=[];while((m=re.exec(text))!==null)items.push(m[2]);
  document.querySelector('#recommendation-list').innerHTML=items.map(x=>{const parts=x.match(/^(.+?)(?= Greece | More | Every | Tourists | Heat | Satellite )([\s\S]*)$/);return `<article class="recommendation"><div><h3>${parts?parts[1]:x}</h3><p>${parts?parts[2]:''}</p></div></article>`}).join('');
}
function renderReferences(){
  let text=sections['APA References - Professional Sources Only']||'';
  let lines=text.split('\n').map(x=>x.trim()).filter(Boolean);let refs=[];
  lines.forEach(line=>{if(/^(Copernicus|European|Global|Leclerc|Mavroulis|Ministry|National|Okal|Smithsonian|UNESCO|United States)/.test(line))refs.push(line);else if(refs.length)refs[refs.length-1]+=' '+line;});
  refs.push('United States Geological Survey. (2020). M 7.0 - 13 km NNE of Neon Karlovasion, Greece');
  document.querySelector('#references-list').innerHTML=refs.map(r=>`<p class="reference">${r}</p>`).join('');
}
if(window.SOURCE_TEXT){splitSource(window.SOURCE_TEXT);render()}else{document.querySelector('#main').insertAdjacentHTML('afterbegin','<p class="load-error">Project content could not be loaded.</p>')}
const button=document.querySelector('.menu-button'),nav=document.querySelector('#site-nav');button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});nav.addEventListener('click',()=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false')});
