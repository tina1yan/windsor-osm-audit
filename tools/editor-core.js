const MUTABLE = ['crossing','crossing:markings','crossing:signals','flashing_lights','crossing:island','crossing:signed'];
const canonical = tags => JSON.stringify(Object.entries(tags||{}).sort(([a],[b])=>a.localeCompare(b)));
const xmlEscape = v => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
function validateDecision(base,d,live){
 if(!d || d.approved!==true)throw Error('Individual approval is missing.');
 if(!d.reviewer?.trim()||!d.evidence?.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(d.observed||''))throw Error('Reviewer, observation date and evidence are required.');
 if(!['survey','permitted_imagery','other_approved'].includes(d.sourceType)||d.permission!==true||d.sameArm!==true||d.context!==true)throw Error('Source permission, exact road arm and connected way review must be confirmed.');
 if(!d.patch||typeof d.patch!=='object'||Array.isArray(d.patch)||!Object.keys(d.patch).length)throw Error('No tag changes specified.');
 for(const [k,v]of Object.entries(d.patch)){if(!MUTABLE.includes(k))throw Error('Unsupported tag change: '+k);if(v!==null&&(typeof v!=='string'||!v.trim()||v.length>255||/[\x00-\x1f]/.test(v)))throw Error('Invalid tag value: '+k);}
 if(!live||live.type!=='node'||live.visible===false||live.id!==base.id||live.version!==base.version||live.lat!==base.lat||live.lon!==base.lon||canonical(live.tags)!==canonical(base.tags))throw Error('OSM object changed or is missing. Re-review current data in JOSM.');
 const tags={...live.tags};for(const [k,v]of Object.entries(d.patch)){if(v===null)delete tags[k];else tags[k]=v;}
 if(canonical(tags)===canonical(live.tags))throw Error('No effective change.');
 if(tags.highway!=='crossing')throw Error('Not an existing crossing node.');
 if(tags.crossing==='unmarked'&&tags['crossing:markings']&&!['no','unknown'].includes(tags['crossing:markings']))throw Error('Unmarked/markings contradiction remains.');
 if(tags.crossing==='traffic_signals'&&tags['crossing:signals']==='no')throw Error('Signal contradiction remains.');
 if(tags.crossing==='uncontrolled'&&tags['crossing:signals']==='yes')throw Error('Uncontrolled/signal contradiction remains.');
 return {...live,tags};
}
function nodeXML(n,action=false){return '<node id="'+n.id+'" version="'+n.version+'" lat="'+n.lat+'" lon="'+n.lon+'"'+(action?' action="modify"':'')+'>\n'+Object.entries(n.tags||{}).map(([k,v])=>'  <tag k="'+xmlEscape(k)+'" v="'+xmlEscape(v)+'"/>').join('\n')+'\n</node>';}
function serializeChanges(nodes,format){
 if(!nodes.length)throw Error('No approved modifications.');
 if(new Set(nodes.map(n=>n.id)).size!==nodes.length)throw Error('Duplicate node in batch.');
 if(nodes.some(n=>n.type!=='node'||!Number.isSafeInteger(n.id)||n.id<=0||!Number.isInteger(n.version)||n.version<1||!Number.isFinite(n.lat)||!Number.isFinite(n.lon)))throw Error('Invalid OSM object metadata.');
 if(format==='osm')return '<?xml version="1.0" encoding="UTF-8"?>\n<osm version="0.6" generator="Windsor reviewed tag editor">\n'+nodes.map(n=>nodeXML(n,true)).join('\n')+'\n</osm>\n';
 if(format==='osc')return '<?xml version="1.0" encoding="UTF-8"?>\n<osmChange version="0.6" generator="Windsor reviewed tag editor">\n<modify>\n'+nodes.map(n=>nodeXML(n)).join('\n')+'\n</modify>\n</osmChange>\n';
 throw Error('Unsupported format.');
}
