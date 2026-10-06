/**
 * SCIENCE LAB: The Lost Energy Core
 * Level 1: Chemistry Lab (Matter, Phase Transitions & Chemical Reactions)
 * 
 * Curriculum Alignment (Grades 6–10):
 * - States of matter (Solid, Liquid, Gas, Plasma) and thermal kinetic energy
 * - Acid-Base Neutralization & pH scale (Acids pH < 7, Bases pH > 7, Neutral pH = 7)
 * - Signs of chemical reactions vs physical changes
 * - Lavoisier's Law of Conservation of Mass & Balanced Chemical Equations
 */

import * as THREE from 'three';
import { BaseLevel } from './baseLevel.js';
import { getQuestion } from '../data/questions.js';
import { gameState } from '../state/gameState.js';
import { saveSystem } from '../state/saveSystem.js';

export class Level1Chemistry extends BaseLevel {
  constructor(uiManager) {
    super(1, "Chemistry Lab: Matter & Reactions", 0x3b82f6);
    this.uiManager = uiManager;

    this.spawnPoint = { x: 0, y: 0, z: 9, rotY: 0 };
    this.completedStations = { 1: false, 2: false, 3: false };

    this.initLevel();
  }

  initLevel() {
    // 1. Build laboratory room shell (28m x 28m x 6m) with blue neon theme
    this.buildLabRoom(28, 28, 6);

    // 2. Set active objective
    gameState.setObjective("Calibrate the Matter Phase Transition Cryo-Chamber at West Station 1.");

    // 3. Station 1: Matter Phase Transition Cryo-Chamber (West)
    this.createPhaseChamberStation();

    // 4. Station 2: Chemical Reaction & pH Neutralization Station (North)
    this.createReactionWorkbench();

    // 5. Station 3: Molecular Synthesizer & Conservation of Mass (East)
    this.createMolecularSynthesizer();

    // 6. Decorative Lab Props (Fume hood, Chemical Storage Cabinets)
    this.createLabDecorations();

    // 7. Interactive Airlock Door linking to Sector 2: Biology Lab
    this.createAirlockDoor(2, "Enter Sector 2: Biology Lab");
  }

  /**
   * Station 1: Matter Phase Transition Cryo-Chamber (West Table)
   */
  createPhaseChamberStation() {
    const table = this.createLabWorkbench(-7, 0, Math.PI / 2, 5, 2.0, 1.0);

    const cryoGroup = new THREE.Group();

    // Cryo Chamber Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.3, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.15;
    cryoGroup.add(base);

    // Transparent Glass Cryo Cylinder
    const glassGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.4, 24, 1, true);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      metalness: 0.2
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 0.95;
    cryoGroup.add(glass);

    // Floating Ice Crystal (Octahedron)
    const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = 0.95;
    cryoGroup.add(crystal);

    // Glowing Thermal Energy Rings
    const ringGeo = new THREE.TorusGeometry(0.5, 0.03, 12, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.95;
    cryoGroup.add(ring);

    // Top Cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.2, 16), baseMat);
    cap.position.y = 1.7;
    cryoGroup.add(cap);

    cryoGroup.position.set(-7, 1.08, 0);
    this.rootGroup.add(cryoGroup);

    // Animation
    this.animatedObjects.push({
      tick: (delta) => {
        crystal.rotation.y += delta * 0.9;
        crystal.rotation.x += delta * 0.4;
        ring.rotation.y += delta * 0.7;
        crystal.position.y = 0.95 + Math.sin(Date.now() * 0.003) * 0.08;
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 1: Calibrate Phase Transition Chamber",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'chemistry', 0);

        this.uiManager.showQuizModal({
          title: "STATION 1: MATTER & PHASE TRANSITIONS",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[1] = true;
            crystalMat.emissive.setHex(0x10b981); // Turn green on success
            crystalMat.color.setHex(0x34d399);
            gameState.setObjective("Phase calibrated! Proceed to North Station 2: Chemical Reaction & pH Neutralization.");
            this.uiManager.showToast("Station 1 Stabilized! Proceed to North Station 2.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 2: Chemical Reaction & pH Neutralization Station (North Table)
   */
  createReactionWorkbench() {
    const table = this.createLabWorkbench(0, -7, 0, 5.5, 2.0, 1.0);

    const benchProps = new THREE.Group();

    // 1. Test Tube Rack
    const rackBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.1, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 })
    );
    rackBase.position.set(-1.2, 0.05, 0);
    benchProps.add(rackBase);

    // 4 Test tubes with different pH indicator colors
    const colors = [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6]; // Acid (Red), Weak Acid (Amber), Neutral (Green), Base (Blue)
    const tubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });

    colors.forEach((col, idx) => {
      const tubeGroup = new THREE.Group();
      const glassTube = new THREE.Mesh(tubeGeo, tubeMat);
      glassTube.position.y = 0.25;
      tubeGroup.add(glassTube);

      const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.3, 12),
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.5 })
      );
      liquid.position.y = 0.18;
      tubeGroup.add(liquid);

      tubeGroup.position.set(-1.6 + idx * 0.25, 0.1, 0);
      benchProps.add(tubeGroup);
    });

    // 2. Erlenmeyer Flask with bubbling chemical reaction
    const flaskGroup = new THREE.Group();
    const flaskCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.6, 16, 1, true),
      tubeMat
    );
    flaskCone.position.y = 0.3;
    flaskGroup.add(flaskCone);

    const flaskNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.25, 16),
      tubeMat
    );
    flaskNeck.position.y = 0.65;
    flaskGroup.add(flaskNeck);

    const reactionLiquid = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.35, 16),
      new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x2563eb,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85
      })
    );
    reactionLiquid.position.y = 0.18;
    flaskGroup.add(reactionLiquid);

    flaskGroup.position.set(0.4, 0, 0);
    benchProps.add(flaskGroup);

    // 3. Bunsen Burner heating the reaction
    const burnerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 })
    );
    burnerBase.position.set(1.4, 0.04, 0);
    benchProps.add(burnerBase);

    const burnerPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 })
    );
    burnerPipe.position.set(1.4, 0.22, 0);
    benchProps.add(burnerPipe);

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.2, 12),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.4,
        transparent: true,
        opacity: 0.9
      })
    );
    flame.position.set(1.4, 0.5, 0);
    benchProps.add(flame);

    benchProps.position.set(0, 1.08, -7);
    this.rootGroup.add(benchProps);

    // Flame animation
    this.animatedObjects.push({
      tick: (delta) => {
        const s = 1 + Math.sin(Date.now() * 0.02) * 0.15;
        flame.scale.set(s, 1 + Math.cos(Date.now() * 0.025) * 0.1, s);
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 2: Run Chemical Neutralization Test",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'chemistry', 1);

        this.uiManager.showQuizModal({
          title: "STATION 2: CHEMICAL REACTIONS & pH",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[2] = true;
            reactionLiquid.material.color.setHex(0x10b981);
            reactionLiquid.material.emissive.setHex(0x059669);
            gameState.setObjective("Chemicals neutralized! Proceed to East Station 3: Molecular Synthesizer.");
            this.uiManager.showToast("Station 2 Neutralized! Proceed to East Station 3.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 3: Molecular Synthesizer & Conservation of Mass (East Table)
   */
  createMolecularSynthesizer() {
    const table = this.createLabWorkbench(7, 0, -Math.PI / 2, 5, 2.0, 1.0);

    const synthGroup = new THREE.Group();

    // Holographic Base Emitter
    const emitterGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.25, 6);
    const emitterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.position.y = 0.12;
    synthGroup.add(emitter);

    // Glowing Emitter Ring
    const emitterRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.04, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.9 })
    );
    emitterRing.rotation.x = Math.PI / 2;
    emitterRing.position.y = 0.26;
    synthGroup.add(emitterRing);

    // Floating Molecular Model: Water (H2O) / Methane Structure
    const moleculeGroup = new THREE.Group();

    // Central Atom (Oxygen - Red/Blue Sphere)
    const centralGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const centralMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.2
    });
    const centralAtom = new THREE.Mesh(centralGeo, centralMat);
    moleculeGroup.add(centralAtom);

    // Hydrogen Atoms (White Spheres) connected by bonds
    const hydrogenGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const hydrogenMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x93c5fd,
      emissiveIntensity: 0.4
    });

    const bondMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });

    const createBond = (angleOffset, distance = 0.5) => {
      const hAtom = new THREE.Mesh(hydrogenGeo, hydrogenMat);
      const px = Math.cos(angleOffset) * distance;
      const py = Math.sin(angleOffset) * distance;
      hAtom.position.set(px, py, 0);
      moleculeGroup.add(hAtom);

      const bondGeo = new THREE.CylinderGeometry(0.025, 0.025, distance, 8);
      const bond = new THREE.Mesh(bondGeo, bondMat);
      bond.position.set(px / 2, py / 2, 0);
      bond.rotation.z = angleOffset - Math.PI / 2;
      moleculeGroup.add(bond);
    };

    createBond(Math.PI * 0.3, 0.45);
    createBond(Math.PI * 0.8, 0.45);
    createBond(-Math.PI * 0.5, 0.45);

    moleculeGroup.position.y = 1.0;
    synthGroup.add(moleculeGroup);

    synthGroup.position.set(7, 1.08, 0);
    this.rootGroup.add(synthGroup);

    // Molecular rotation animation
    this.animatedObjects.push({
      tick: (delta) => {
        moleculeGroup.rotation.y += delta * 0.8;
        moleculeGroup.rotation.x += delta * 0.5;
        moleculeGroup.position.y = 1.0 + Math.sin(Date.now() * 0.003) * 0.06;
      }
    });

    // Register Interaction (Final Station for Sector 1)
    this.interactables.push({
      mesh: table,
      label: "Station 3: Verify Conservation of Mass",
      maxDistance: 3.8,
      onInteract: () => {
        this.uiManager.showQuizModal({
          title: "STATION 3: CONSERVATION OF MASS",
          question: "In any closed chemical reaction (e.g. 2H2 + O2 -> 2H2O), what must remain strictly equal before and after the reaction?",
          options: [
            { text: "The total mass and number of each type of atom", isCorrect: true },
            { text: "The total number of molecules", isCorrect: false },
            { text: "The total physical volume of the container", isCorrect: false },
            { text: "The total temperature in Celsius", isCorrect: false }
          ],
          explanation: "The Law of Conservation of Mass dictates that atoms cannot be created or destroyed in chemical reactions; they simply rearrange into new molecules.",
          onCorrect: () => {
            this.completedStations[3] = true;
            gameState.setObjective("Sector 1 Stabilized! Proceed to Sector 2: Biology Lab.");
            this.uiManager.showLevelCompleteModal({
              levelId: 1,
              title: "Chemistry Lab: Matter & Reactions",
              badgeId: "chem_badge",
              cardId: "card_conservation_mass",
              xpEarned: 150,
              coinsEarned: 30,
              stars: 3,
              onNextLevel: () => {
                gameState.setLevel(2);
              }
            });
          }
        });
      }
    });
  }

  /**
   * Decorative Laboratory Details: Fume hood & Storage Units
   */
  createLabDecorations() {
    // Chemical Storage Cabinet (South-East corner)
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.0, 1.0), cabinetMat);
    cabinet.position.set(10, 2.0, 10);
    this.rootGroup.add(cabinet);
    this.colliders.push(cabinet);

    // Hazard Stripes on cabinet
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.4 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.2, 1.02), hazardMat);
    stripe.position.set(10, 3.5, 10);
    this.rootGroup.add(stripe);

    // Gas Exhaust Pipe along ceiling
    const pipeGeo = new THREE.CylinderGeometry(0.18, 0.18, 26, 16);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const exhaustPipe = new THREE.Mesh(pipeGeo, pipeMat);
    exhaustPipe.rotation.z = Math.PI / 2;
    exhaustPipe.position.set(0, 5.2, -6);
    this.rootGroup.add(exhaustPipe);
  }
}
