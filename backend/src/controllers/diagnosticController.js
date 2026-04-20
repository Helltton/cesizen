const { PrismaClient } = require('@prisma/client');
const { computeScore, getInterpretation, buildSnapshot } = require('../services/diagnosticService');
const prisma = new PrismaClient();

exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.diagnosticEvent.findMany({
      where: { isActive: true },
      orderBy: { stressPoints: 'desc' }
    });
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.submit = async (req, res) => {
  try {
    const { selectedEventIds } = req.body;
    if (!selectedEventIds?.length)
      return res.status(400).json({ error: 'Aucun événement sélectionné' });

    const allEvents = await prisma.diagnosticEvent.findMany({ where: { isActive: true } });
    const configs = await prisma.diagnosticConfig.findMany();
    const snapshot = buildSnapshot(selectedEventIds, allEvents);
    const score = computeScore(snapshot.map(e => e.stressPoints));
    const config = getInterpretation(score, configs);

    const result = await prisma.diagnosticResult.create({
      data: {
        totalScore: score,
        interpretation: config?.resultLabel || 'Non défini',
        selectedEventIds: snapshot,
        userId: req.user?.id || null,
      }
    });

    res.status(201).json({
      score,
      interpretation: config,
      resultId: result.id
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getResult = async (req, res) => {
  try {
    const result = await prisma.diagnosticResult.findUnique({
      where: { id: req.params.id }
    });
    if (!result) return res.status(404).json({ error: 'Résultat introuvable' });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { label, stressPoints } = req.body;
    const event = await prisma.diagnosticEvent.create({
      data: { label, stressPoints, createdById: req.user.id }
    });
    res.status(201).json(event);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { label, stressPoints } = req.body;
    const event = await prisma.diagnosticEvent.update({
      where: { id: req.params.id },
      data: { label, stressPoints }
    });
    res.json(event);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deactivateEvent = async (req, res) => {
  try {
    await prisma.diagnosticEvent.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    res.json({ message: 'Événement désactivé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getConfigs = async (req, res) => {
  try {
    const configs = await prisma.diagnosticConfig.findMany({
      orderBy: { scoreMin: 'asc' }
    });
    res.json(configs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { resultLabel, scoreMin, scoreMax, description } = req.body;
    const config = await prisma.diagnosticConfig.update({
      where: { id: req.params.id },
      data: { resultLabel, scoreMin, scoreMax, description, updatedById: req.user.id }
    });
    res.json(config);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createConfig = async (req, res) => {
  try {
    const { resultLabel, scoreMin, scoreMax, description } = req.body;
    const config = await prisma.diagnosticConfig.create({
      data: { resultLabel, scoreMin, scoreMax, description, updatedById: req.user.id }
    });
    res.status(201).json(config);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await prisma.diagnosticEvent.findMany({
      orderBy: { stressPoints: 'desc' }
    });
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.activateEvent = async (req, res) => {
  try {
    await prisma.diagnosticEvent.update({
      where: { id: req.params.id },
      data: { isActive: true }
    });
    res.json({ message: 'Événement réactivé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const results = await prisma.diagnosticResult.findMany({
      where: { userId: req.user.id },
      orderBy: { takenAt: 'desc' }
    });
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteConfig = async (req, res) => {
  try {
    await prisma.diagnosticConfig.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tranche supprimée' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};