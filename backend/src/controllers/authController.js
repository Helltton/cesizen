const { PrismaClient } = require('@prisma/client');
const { hashPassword, verifyPassword, generateToken, validateEmail } = require('../services/authService');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!validateEmail(email))
      return res.status(400).json({ error: 'Email invalide' });
    if (!password || password.length < 8)
      return res.status(400).json({ error: 'Mot de passe invalide' });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email déjà utilisé' });
    const user = await prisma.user.create({
      data: { email, passwordHash: await hashPassword(password), firstName, lastName }
    });
    res.status(201).json({ message: 'Compte créé', id: user.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });
    if (!user.isActive) return res.status(403).json({ error: 'Compte désactivé' });
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });
    res.json({ token: generateToken(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8)
      return res.status(400).json({ error: 'Mot de passe invalide' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    await prisma.user.update({
      where: { email },
      data: { passwordHash: await hashPassword(newPassword) }
    });
    res.json({ message: 'Mot de passe réinitialisé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};