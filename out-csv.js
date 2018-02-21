const fs = require('fs');

const jsonDir = './ws.json';
const strokesFileName = 'strokes.csv';
const ralliesFileName = 'rallies.csv';

// json読み込み
const json = JSON.parse(fs.readFileSync(jsonDir, 'utf8'));
const rallies = json.details[0].rallies;
const csv = require('csv');

// ストロークの吐き出し
const flatten = arr => arr.reduce((a, e) => a.concat(...e), []);
const toStrokesStats = strokes => {
    let index = 1;
    return strokes.map(s => Object.assign({}, s, {index: index++}))};
const allStrokes = rallies => flatten(rallies.map(r => toStrokesStats(r.strokes)));

csv.stringify(allStrokes(rallies), { header: true}, (err, output) => {
    fs.writeFileSync(strokesFileName, output, 'utf8');
});

// ラリーの吐き出し
const toRallyStats = rallies => rallies.map(r =>
                                            ({
                                                wonby: r.wonby,
                                                unforced: r.unforced,
                                                cause: r.cause,
                                                strokesCount: r.strokes.length,
                                                lastStroke: r.strokes[r.strokes.length -1]
                                            }));
csv.stringify(toRallyStats(rallies), { header: true}, (err, output) => {
    fs.writeFileSync(ralliesFileName, output, 'utf8');
});
