const fs = require('fs');
const json = JSON.parse(fs.readFileSync('./ws.json', 'utf8'));
const rallies = json.details[0].rallies;

const flatten = arr => arr.reduce((a, e) => a.concat(...e), []);

const allStrokes = rallies => flatten(rallies.map(r => r.strokes));

const allHighback = (rallies) => {
    return allStrokes(rallies).filter(s => s.from === 'back-left' && s.hand === 'backhand');
};

const allRound = (rallies) => {
    return allStrokes(rallies).filter(s => s.from === 'back-left');
};


console.log(`${allHighback(rallies).length} /${allRound(rallies).length}`);
