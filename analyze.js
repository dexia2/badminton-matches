const fs = require('fs');
const _ = require('lodash');

const jsonDir = './wang_yamaguchi/ws.json';

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

// ラリーの吐き出し
const toRallyStats = rallies => rallies.map(r =>
                                            ({
                                                wonby: r.wonby,
                                                unforced: r.unforced,
                                                cause: r.cause,
                                                strokesCount: r.strokes.length,
                                                lastStroke: r.strokes[r.strokes.length -1]
                                            }));
