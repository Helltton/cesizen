const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {


  // ─── NETTOYAGE ────────────────────────────────────────────────────────────
  await prisma.diagnosticResult.deleteMany();
  await prisma.diagnosticConfig.deleteMany();
  await prisma.diagnosticEvent.deleteMany();
  await prisma.page.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.user.deleteMany();
  // ─── UTILISATEURS ────────────────────────────────────────────────────────

  const admin = await prisma.user.create({
    data: {
      email: 'admin@cesizen.fr',
      passwordHash: await bcrypt.hash('Admin1234!', 10),
      firstName: 'Admin',
      lastName: 'CESIZen',
      role: 'ADMIN',
    }
  });

  await prisma.user.create({
    data: {
      email: 'jean.dupont@cesizen.fr',
      passwordHash: await bcrypt.hash('User1234!', 10),
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'USER',
    }
  });

  await prisma.user.create({
    data: {
      email: 'marie.martin@cesizen.fr',
      passwordHash: await bcrypt.hash('User1234!', 10),
      firstName: 'Marie',
      lastName: 'Martin',
      role: 'USER',
    }
  });

  await prisma.user.create({
    data: {
      email: 'paul.bernard@cesizen.fr',
      passwordHash: await bcrypt.hash('User1234!', 10),
      firstName: 'Paul',
      lastName: 'Bernard',
      role: 'USER',
      isActive: false,
    }
  });

  // ─── MENUS ET PAGES ───────────────────────────────────────────────────────

  const menuPrevention = await prisma.menuItem.create({
    data: { label: 'Prévention', slug: 'prevention', position: 1 }
  });
  await prisma.page.create({
    data: {
      title: 'La prévention en santé mentale',
      content: `<h2>Pourquoi la prévention est essentielle</h2>
<p>La santé mentale est une composante fondamentale du bien-être global. La prévention permet d'agir avant l'apparition de troubles, en développant des ressources personnelles et en créant des environnements favorables.</p>
<h2>Les piliers de la prévention</h2>
<ul>
  <li>Reconnaître les signaux d'alerte</li>
  <li>Maintenir des liens sociaux de qualité</li>
  <li>Pratiquer une activité physique régulière</li>
  <li>Adopter une hygiène de sommeil saine</li>
</ul>`,
      menuItemId: menuPrevention.id,
      updatedById: admin.id,
    }
  });

  const menuComprendre = await prisma.menuItem.create({
    data: { label: 'Comprendre', slug: 'comprendre', position: 2 }
  });
  await prisma.page.create({
    data: {
      title: 'Comprendre la santé mentale',
      content: `<h2>Qu'est-ce que la santé mentale ?</h2>
<p>Selon l'OMS, la santé mentale est un état de bien-être dans lequel une personne peut se réaliser, surmonter les tensions normales de la vie, accomplir un travail productif et contribuer à la vie de sa communauté.</p>
<h2>Les troubles les plus fréquents</h2>
<p>La dépression, l'anxiété, le burn-out et le stress chronique touchent des millions de personnes en France. Ces troubles sont soignables et méritent la même attention que les maladies physiques.</p>
<h2>Briser les tabous</h2>
<p>Parler de sa santé mentale n'est pas un signe de faiblesse. C'est au contraire une démarche courageuse qui permet d'obtenir l'aide nécessaire.</p>`,
      menuItemId: menuComprendre.id,
      updatedById: admin.id,
    }
  });

  const menuStress = await prisma.menuItem.create({
    data: { label: 'Gérer le stress', slug: 'gerer-le-stress', position: 3 }
  });
  await prisma.page.create({
    data: {
      title: 'Techniques de gestion du stress',
      content: `<h2>Le stress, qu'est-ce que c'est ?</h2>
<p>Le stress est une réaction naturelle de l'organisme face à une situation perçue comme menaçante. En petite quantité, il peut être stimulant. Chronique, il devient dangereux pour la santé.</p>
<h2>Techniques efficaces</h2>
<ul>
  <li><strong>La respiration abdominale</strong> : inspire 4 secondes, bloque 4 secondes, expire 6 secondes.</li>
  <li><strong>La méditation de pleine conscience</strong> : 10 minutes par jour suffisent pour réduire l'anxiété.</li>
  <li><strong>L'activité physique</strong> : libère des endorphines et réduit le cortisol.</li>
  <li><strong>L'écriture expressive</strong> : coucher ses émotions sur papier aide à les réguler.</li>
</ul>`,
      menuItemId: menuStress.id,
      updatedById: admin.id,
    }
  });

  const menuRessources = await prisma.menuItem.create({
    data: { label: 'Ressources', slug: 'ressources', position: 4 }
  });
  await prisma.page.create({
    data: {
      title: 'Ressources et contacts utiles',
      content: `<h2>Lignes d'écoute</h2>
<ul>
  <li><strong>Numéro national de prévention du suicide</strong> : 3114 (24h/24, 7j/7)</li>
  <li><strong>SOS Amitié</strong> : 09 72 39 40 50</li>
  <li><strong>Croix-Rouge Écoute</strong> : 0800 858 858</li>
</ul>
<h2>Trouver un professionnel</h2>
<p>Le site <strong>Doctolib</strong> permet de trouver un psychologue ou psychiatre près de chez vous. Le dispositif MonSoutienPsy permet de bénéficier de 12 séances remboursées par an.</p>`,
      menuItemId: menuRessources.id,
      updatedById: admin.id,
    }
  });

  // ─── ÉVÉNEMENTS DIAGNOSTICS ───────────────────────────────────────────────

  const events = [
    { label: 'Décès du conjoint ou d\'un enfant', stressPoints: 100 },
    { label: 'Divorce', stressPoints: 73 },
    { label: 'Séparation conjugale', stressPoints: 65 },
    { label: 'Décès d\'un proche (famille)', stressPoints: 63 },
    { label: 'Maladie ou blessure personnelle grave', stressPoints: 53 },
    { label: 'Mariage', stressPoints: 50 },
    { label: 'Perte d\'emploi', stressPoints: 47 },
    { label: 'Réconciliation conjugale', stressPoints: 45 },
    { label: 'Retraite', stressPoints: 45 },
    { label: 'Maladie grave d\'un membre de la famille', stressPoints: 44 },
    { label: 'Grossesse', stressPoints: 40 },
    { label: 'Difficultés sexuelles', stressPoints: 39 },
    { label: 'Naissance ou adoption d\'un enfant', stressPoints: 39 },
    { label: 'Changement professionnel important', stressPoints: 39 },
    { label: 'Changement de situation financière', stressPoints: 38 },
    { label: 'Décès d\'un ami proche', stressPoints: 37 },
    { label: 'Changement de type de travail', stressPoints: 36 },
    { label: 'Conflits conjugaux fréquents', stressPoints: 35 },
    { label: 'Emprunt ou dette importante', stressPoints: 31 },
    { label: 'Saisie d\'un bien (maison, voiture)', stressPoints: 30 },
    { label: 'Changement de responsabilités au travail', stressPoints: 29 },
    { label: 'Départ d\'un enfant du foyer', stressPoints: 29 },
    { label: 'Problèmes avec la belle-famille', stressPoints: 29 },
    { label: 'Succès personnel exceptionnel', stressPoints: 28 },
    { label: 'Début ou fin d\'activité professionnelle du conjoint', stressPoints: 26 },
    { label: 'Début ou fin de scolarité', stressPoints: 26 },
    { label: 'Changement des conditions de vie', stressPoints: 25 },
    { label: 'Changement d\'habitudes personnelles', stressPoints: 24 },
    { label: 'Difficultés avec un supérieur hiérarchique', stressPoints: 23 },
    { label: 'Changement des horaires ou conditions de travail', stressPoints: 20 },
    { label: 'Déménagement', stressPoints: 20 },
    { label: 'Changement d\'établissement scolaire', stressPoints: 20 },
    { label: 'Changement d\'activités de loisirs', stressPoints: 19 },
    { label: 'Changement d\'activités religieuses', stressPoints: 19 },
    { label: 'Changement d\'activités sociales', stressPoints: 18 },
    { label: 'Petit emprunt ou dette mineure', stressPoints: 17 },
    { label: 'Changement dans les habitudes de sommeil', stressPoints: 16 },
    { label: 'Changement du nombre de réunions de famille', stressPoints: 15 },
    { label: 'Changement des habitudes alimentaires', stressPoints: 15 },
    { label: 'Vacances', stressPoints: 13 },
    { label: 'Fêtes de fin d\'année', stressPoints: 12 },
    { label: 'Infraction mineure à la loi', stressPoints: 11 },
  ];

  for (const e of events) {
    await prisma.diagnosticEvent.create({
      data: { ...e, createdById: admin.id }
    });
  }

  // ─── CONFIG RÉSULTATS DIAGNOSTIC ─────────────────────────────────────────

  await prisma.diagnosticConfig.createMany({
    data: [
      {
        resultLabel: 'Faible risque',
        scoreMin: 0,
        scoreMax: 149,
        description: 'Votre niveau de stress est faible. Continuez à prendre soin de vous avec des activités relaxantes et un bon équilibre de vie.',
        updatedById: admin.id,
      },
      {
        resultLabel: 'Risque modéré',
        scoreMin: 150,
        scoreMax: 299,
        description: 'Vous êtes dans une période de stress modéré. Faites attention à votre équilibre, pratiquez des techniques de relaxation et n\'hésitez pas à en parler à un proche.',
        updatedById: admin.id,
      },
      {
        resultLabel: 'Risque élevé',
        scoreMin: 300,
        scoreMax: 9999,
        description: 'Votre niveau de stress est élevé. Il est fortement recommandé de consulter un professionnel de santé mentale. Vous n\'êtes pas seul(e).',
        updatedById: admin.id,
      },
    ]
  });

  console.log('Seed terminé avec succès !');
  console.log('Comptes disponibles :');
  console.log('  Admin : admin@cesizen.fr / Admin1234!');
  console.log('  User  : jean.dupont@cesizen.fr / User1234!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());