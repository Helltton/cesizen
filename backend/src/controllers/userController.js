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

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8)
      return res.status(400).json({ error: 'Mot de passe trop court' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const { verifyPassword, hashPassword } = require('../services/authService');
    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Mot de passe actuel incorrect' });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: await hashPassword(newPassword) }
    });
    res.json({ message: 'Mot de passe modifié' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    await prisma.diagnosticResult.deleteMany({ where: { userId: req.user.id } });
    await prisma.user.delete({ where: { id: req.user.id } });
    res.json({ message: 'Compte supprimé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};