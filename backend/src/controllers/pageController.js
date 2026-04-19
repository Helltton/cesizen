const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMenus = async (req, res) => {
  try {
    const menus = await prisma.menuItem.findMany({
      where: { isVisible: true, parentId: null },
      orderBy: { position: 'asc' },
      include: { children: true, page: { select: { title: true } } }
    });
    res.json(menus);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const menu = await prisma.menuItem.findUnique({
      where: { slug: req.params.slug },
      include: { page: true }
    });
    if (!menu?.page) return res.status(404).json({ error: 'Page introuvable' });
    res.json(menu.page);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { label, slug, position, parentId } = req.body;
    const menu = await prisma.menuItem.create({
      data: { label, slug, position, parentId }
    });
    res.status(201).json(menu);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { label, position, isVisible } = req.body;
    const menu = await prisma.menuItem.update({
      where: { id: req.params.id },
      data: { label, position, isVisible }
    });
    res.json(menu);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { title, content } = req.body;
    const page = await prisma.page.update({
      where: { id: req.params.id },
      data: { title, content, updatedById: req.user.id }
    });
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createPage = async (req, res) => {
  try {
    const { title, content, menuItemId } = req.body;
    const page = await prisma.page.create({
      data: { title, content, menuItemId, updatedById: req.user.id }
    });
    res.status(201).json(page);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};