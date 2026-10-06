/**
 * SCIENCE LAB: The Lost Energy Core
 * Level 2: Biology Lab (Life Systems, Photosynthesis, Cell Organelles & Human Anatomy)
 * 
 * Curriculum Alignment (Grades 6–10):
 * - Chloroplasts & Photosynthesis (6CO2 + 6H2O + Light -> C6H12O6 + 6O2)
 * - Plant vs Animal Cell structures (Chloroplasts, Cell Wall, Mitochondria, Nucleus)
 * - Cellular respiration & Mitochondria ATP synthesis
 * - Human Respiratory & Circulatory gas exchange (Alveoli & Capillaries)
 * - Anaerobic respiration & Lactic acid fermentation
 */

import * as THREE from 'three';
import { BaseLevel } from './baseLevel.js';
import { getQuestion } from '../data/questions.js';
import { gameState } from '../state/gameState.js';
import { saveSystem } from '../state/saveSystem.js';

export class Level2Biology extends BaseLevel {
  constructor(uiManager) {
    super(2, "Biology Lab: Life Systems", 0x10b981);
    this.uiManager = uiManager;

    this.spawnPoint = { x: 0, y: 0, z: 9, rotY: 0 };
    this.completedStations = { 1: false, 2: false, 3: false };

    this.initLevel();
  }

  initLevel() {
    // 1. Build room shell (28m x 28m x 6m) with vibrant green neon trims
    this.buildLabRoom(28, 28, 6);

    // 2. Set active HUD objective
    gameState.setObjective("Calibrate the Hydroponic Photosynthesis Pod at West Station 1.");

    // 3. Station 1: Hydroponic Photosynthesis Pod (West)
    this.createPhotosynthesisPod();

    // 4. Station 2: Holographic DNA Double Helix & Organelle Console (North)
    this.createDnaConsole();

    // 5. Station 3: Vital Systems & Organ Oxygenation Unit (East)
    this.createOrganScanner();

    // 6. Bio-dome Botanical Decorations (Greenhouse tubes, Bio-hazard tanks)
    this.createBioDecorations();

    // 7. Interactive Airlock Door linking to Sector 3: Physics Lab
    this.createAirlockDoor(3, "Enter Sector 3: Physics Lab");
  }

  /**
   * Station 1: Hydroponic Photosynthesis Incubator Pod (West Table)
   */
  createPhotosynthesisPod() {
    const table = this.createLabWorkbench(-7, 0, Math.PI / 2, 5, 2.0, 1.0);

    const podGroup = new THREE.Group();

    // Incubator Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.95, 0.25, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.12;
    podGroup.add(base);

    // Glass Dome
    const domeGeo = new THREE.SphereGeometry(0.7, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.25;
    podGroup.add(dome);

    // Glowing Specimen Plant Stem & Leaves
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6
    });

    const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.45, 8);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.45;
    podGroup.add(stem);

    // Leaves
    const leafGeo = new THREE.SphereGeometry(0.12, 8, 8);
    leafGeo.scale(1.8, 0.3, 0.8);
    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(leafGeo, stemMat);
      const angle = (i * Math.PI) / 2;
      leaf.position.set(Math.cos(angle) * 0.18, 0.4 + i * 0.08, Math.sin(angle) * 0.18);
      leaf.rotation.y = angle;
      leaf.rotation.z = 0.3;
      podGroup.add(leaf);
    }

    // Solar Grow Lamp Ring on Top
    const lampRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.03, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.2 })
    );
    lampRing.rotation.x = Math.PI / 2;
    lampRing.position.y = 0.95;
    podGroup.add(lampRing);

    podGroup.position.set(-7, 1.08, 0);
    this.rootGroup.add(podGroup);

    // Light pulse animation
    this.animatedObjects.push({
      tick: (delta) => {
        lampRing.material.emissiveIntensity = 1.0 + Math.sin(Date.now() * 0.004) * 0.3;
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 1: Restore Hydroponic Photosynthesis",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'biology', 0);

        this.uiManager.showQuizModal({
          title: "STATION 1: PHOTOSYNTHESIS & CHLOROPLASTS",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[1] = true;
            stemMat.emissive.setHex(0x34d399);
            gameState.setObjective("Photosynthesis restored! Proceed to North Station 2: DNA & Cell Terminal.");
            this.uiManager.showToast("Station 1 Restored! Oxygen synthesis active.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 2: Holographic DNA Double Helix & Organelle Terminal (North Table)
   */
  createDnaConsole() {
    const table = this.createLabWorkbench(0, -7, 0, 5.5, 2.0, 1.0);

    const dnaGroup = new THREE.Group();

    // Terminal Base Emitter
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.1, 0.25, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    base.position.y = 0.12;
    dnaGroup.add(base);

    // Glowing Emitter Ring
    const emitterRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.04, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.9 })
    );
    emitterRing.rotation.x = Math.PI / 2;
    emitterRing.position.y = 0.26;
    dnaGroup.add(emitterRing);

    // 3D Procedural DNA Double Helix
    const helixGroup = new THREE.Group();
    const numRungs = 14;
    const helixHeight = 1.6;
    const radius = 0.35;

    const nodeMatA = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x2563eb, emissiveIntensity: 0.8 }); // Adenine/Thymine
    const nodeMatB = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.8 }); // Guanine/Cytosine
    const barMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 });

    const sphereGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const rungGeo = new THREE.CylinderGeometry(0.015, 0.015, radius * 2, 8);

    for (let i = 0; i < numRungs; i++) {
      const progress = i / numRungs;
      const angle = progress * Math.PI * 3; // 1.5 full twists
      const y = (progress - 0.5) * helixHeight;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = -x1;
      const z2 = -z1;

      // Strand 1 node
      const node1 = new THREE.Mesh(sphereGeo, nodeMatA);
      node1.position.set(x1, y, z1);
      helixGroup.add(node1);

      // Strand 2 node
      const node2 = new THREE.Mesh(sphereGeo, nodeMatB);
      node2.position.set(x2, y, z2);
      helixGroup.add(node2);

      // Connecting base pair rung
      const rung = new THREE.Mesh(rungGeo, barMat);
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = angle;
      helixGroup.add(rung);
    }

    helixGroup.position.y = 1.1;
    dnaGroup.add(helixGroup);

    dnaGroup.position.set(0, 1.08, -7);
    this.rootGroup.add(dnaGroup);

    // Helix spinning animation
    this.animatedObjects.push({
      tick: (delta) => {
        helixGroup.rotation.y += delta * 0.9;
        helixGroup.position.y = 1.1 + Math.sin(Date.now() * 0.003) * 0.05;
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 2: Analyze DNA & Cellular Respiration",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'biology', 1);

        this.uiManager.showQuizModal({
          title: "STATION 2: CELL ORGANELLES & RESPIRATION",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[2] = true;
            nodeMatA.emissive.setHex(0x10b981);
            gameState.setObjective("Cell diagnostics complete! Proceed to East Station 3: Organ Oxygenation Unit.");
            this.uiManager.showToast("Station 2 Calibrated! Proceed to East Station 3.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 3: Vital Systems & Organ Oxygenation Unit (East Table)
   */
  createOrganScanner() {
    const table = this.createLabWorkbench(7, 0, -Math.PI / 2, 5, 2.0, 1.0);

    const scannerGroup = new THREE.Group();

    // Base console
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.2, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    base.position.y = 0.1;
    scannerGroup.add(base);

    // Holographic Human Heart & Lungs model
    const organHoloGroup = new THREE.Group();

    // Pulsing Heart (Red Octahedron)
    const heartGeo = new THREE.OctahedronGeometry(0.2, 0);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const heart = new THREE.Mesh(heartGeo, heartMat);
    heart.position.set(0, 0.65, 0);
    organHoloGroup.add(heart);

    // Lungs (Two blue/cyan ellipsoids)
    const lungGeo = new THREE.SphereGeometry(0.18, 12, 12);
    lungGeo.scale(0.8, 1.4, 0.7);
    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.65,
      wireframe: true
    });

    const leftLung = new THREE.Mesh(lungGeo, lungMat);
    leftLung.position.set(-0.25, 0.7, 0);
    organHoloGroup.add(leftLung);

    const rightLung = new THREE.Mesh(lungGeo, lungMat);
    rightLung.position.set(0.25, 0.7, 0);
    organHoloGroup.add(rightLung);

    scannerGroup.add(organHoloGroup);
    scannerGroup.position.set(7, 1.08, 0);
    this.rootGroup.add(scannerGroup);

    // Heartbeat pulse animation
    this.animatedObjects.push({
      tick: (delta) => {
        const beat = 1 + Math.sin(Date.now() * 0.008) * 0.2;
        heart.scale.set(beat, beat, beat);
        organHoloGroup.rotation.y += delta * 0.5;
      }
    });

    // Register Interaction (Final Station for Sector 2)
    this.interactables.push({
      mesh: table,
      label: "Station 3: Restore Organ Life-Support Oxygenation",
      maxDistance: 3.8,
      onInteract: () => {
        this.uiManager.showQuizModal({
          title: "STATION 3: HUMAN ORGAN SYSTEMS & GAS EXCHANGE",
          question: "Which microscopic structures in human lungs provide a huge surface area for oxygen to diffuse directly into bloodstream capillaries?",
          options: [
            { text: "Alveoli (Air Sacs)", isCorrect: true },
            { text: "Bronchial Cartilage", isCorrect: false },
            { text: "Esophagus Lining", isCorrect: false },
            { text: "Trachea Cilia", isCorrect: false }
          ],
          explanation: "Over 300 million tiny alveoli in human lungs enable rapid gas exchange of oxygen into bloodstream hemoglobin and release of carbon dioxide.",
          onCorrect: () => {
            this.completedStations[3] = true;
            gameState.setObjective("Sector 2 Stabilized! Proceed to Sector 3: Physics Lab.");
            this.uiManager.showLevelCompleteModal({
              levelId: 2,
              title: "Biology Lab: Life Systems",
              badgeId: "bio_badge",
              cardId: "card_photosynthesis",
              xpEarned: 150,
              coinsEarned: 30,
              stars: 3,
              onNextLevel: () => {
                gameState.setLevel(3);
              }
            });
          }
        });
      }
    });
  }

  /**
   * Decorative Botanical Tubes & Greenhouse Hydroponic Pods
   */
  createBioDecorations() {
    // Large Vertical Hydroponic Growth Column (South-East Corner)
    const columnGroup = new THREE.Group();
    const tubeGeo = new THREE.CylinderGeometry(0.6, 0.6, 5.0, 16, 1, true);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.y = 2.5;
    columnGroup.add(tube);

    // Inner Glowing Spore Core
    const coreGeo = new THREE.CylinderGeometry(0.2, 0.2, 4.8, 8);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.8
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 2.5;
    columnGroup.add(core);

    columnGroup.position.set(10, 0, 10);
    this.rootGroup.add(columnGroup);
    this.colliders.push(tube);
  }
}
