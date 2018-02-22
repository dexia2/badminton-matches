const fs = require('fs');
const _ = require('lodash');

const jsonDir = './wang_yamaguchi/ws.json';

// json読み込み
const json = JSON.parse(fs.readFileSync(jsonDir, 'utf8'));
const rallies = json.details[0].rallies;
const csv = require('csv');

// 2点間の配球の相関性を考える
const addGroupFrom = (group, prevStroke) =>
      (prevStroke.to in group? group : (group[prevStroke.to] = {}, group));

const addGroupTo = (group, prevStroke, curStroke) => {
    if (curStroke.to in group[prevStroke.to]) {
        group[prevStroke.to][curStroke.to]++;
    } else {
        group[prevStroke.to][curStroke.to] = 1;
    }
    return group
};

const nextStrokeGroup = (rallies, player) => {
    const group = {};
    rallies.forEach(r => {
        const strokesBy = r.strokes.filter(s => s.stroker === player);
        let prevStroke = null;
        strokesBy.forEach(s => {
            if(prevStroke) {
                addGroupFrom(group, prevStroke);
                addGroupTo(group, prevStroke, s);
            }
            prevStroke = s;
        });
    });
    return group;
};

// ラリーのバランスを考える
const balanceScore = (rallies, player, balance) => {

    return rallies.filter(r => {
        const strokes = r.strokes.filter(s => s.stroker === player);
        return (strokes.filter(s => s.balance === balance).length / strokes.length) > 0.5;
    });

};

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
