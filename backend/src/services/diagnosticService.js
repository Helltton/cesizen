function computeScore(pointsArray) {
  return pointsArray.reduce((sum, p) => sum + p, 0);
}

function getInterpretation(score, configs) {
  return configs.find(c => score >= c.scoreMin && score <= c.scoreMax) || null;
}

function buildSnapshot(selectedIds, allEvents) {
  return allEvents
    .filter(e => selectedIds.includes(e.id))
    .map(e => ({ id: e.id, label: e.label, stressPoints: e.stressPoints }));
}

module.exports = { computeScore, getInterpretation, buildSnapshot };