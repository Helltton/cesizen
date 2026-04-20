const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../services/authService');
const prisma = new PrismaClient();

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { firstName, lastName },
      select: { id: true, email: true, firstName: true, lastName: true }
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true }
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email déjà utilisé' });
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        firstName,
        lastName,
        role: 'ADMIN'
      }
    });
    res.status(201).json({ message: 'Admin créé', id: user.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    res.json({ message: 'Compte désactivé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Compte supprimé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.reactivateUser = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: true }
    });
    res.json({ message: 'Compte réactivé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};