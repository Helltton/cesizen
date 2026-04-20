const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMenus = async (req, res) => {
  try {
    const menus = await prisma.menuItem.findMany({
      where: { isVisible: true, parentId: null },
      orderBy: { position: 'asc' },
      include: {
        page: { select: { title: true } },
        children: {
          where: { isVisible: true },
          orderBy: { position: 'asc' },
          include: { page: true }
        }
      }
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

    // Slugification de base
    let baseSlug = slug
      ? slug.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : label.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Vérifier si le slug existe déjà et le rendre unique
    let finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.menuItem.findUnique({ where: { slug: finalSlug } });
      if (!existing) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const menu = await prisma.menuItem.create({
      data: {
        label,
        slug: finalSlug,
        position: parseInt(position),
        parentId: parentId || null
      }
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

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await prisma.menuItem.findMany({
      where: { parentId: null },
      orderBy: { position: 'asc' },
      include: {
        page: true,
        children: {
          orderBy: { position: 'asc' },
          include: { page: true }
        }
      }
    });
    res.json(menus);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    await prisma.menuItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Menu supprimé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    await prisma.page.delete({ where: { id: req.params.id } });
    res.json({ message: 'Page supprimée' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};