/**
 * SCIENCE LAB: The Lost Energy Core
 * Level 6: The Energy Core (Central Fusion Reactor - Master Science Integration)
 * 
 * The Grand Climax of Nova Science Laboratory:
 * - Central Tokamak Plasma Fusion Core with rotating magnetic confinement rings
 * - 5 Radial Sector Stabilizer Consoles (Chemistry, Biology, Physics, Earth, Energy)
 * - Master Ignition Sequence integrating all 5 science disciplines
 * - Law of Conservation of Total Energy (E_initial = E_final)
 * - Complete Victory Celebration & Master Scientist Badge
 */

import * as THREE from 'three';
import { BaseLevel } from './baseLevel.js';
import { getQuestion } from '../data/questions.js';
import { gameState } from '../state/gameState.js';
import { saveSystem } from '../state/saveSystem.js';

export class Level6Core extends BaseLevel {
  constructor(uiManager) {
    super(6, "The Energy Core: Central Reactor", 0xa855f7);
    this.uiManager = uiManager;

    this.spawnPoint = { x: 0, y: 0, z: 11, rotY: 0 };
    this.stabilizedConsoles = {
      chem: false,
      bio: false,
      phys: false,
      earth: false,
      energy: false
    };

    this.beams = [];
    this.coreMesh = null;
    this.isCoreRestored = false;

    this.initLevel();
  }

  initLevel() {
    // 1. Build massive central reactor chamber (32m x 32m x 7m) with neon purple theme
    this.buildLabRoom(32, 32, 7);

    // 2. Set active HUD objective
    gameState.setObjective("CRITICAL: Meltdown imminent! Synchronize all 5 Sector Consoles around the Core!");

    // 3. Central Tokamak Plasma Reactor Core
    this.createCentralReactorCore();

    // 4. Five Radial Stabilizer Consoles (Chem, Bio, Phys, Earth, Energy)
    this.createRadialStabilizerConsoles();

    // 5. Master Ignition Command Console (South)
    this.createMasterIgnitionConsole();

    // 6. Reactor Chamber Overhead Conduits & Plasma Injectors
    this.createReactorDecorations();

    // 7. Interactive Airlock Door linking back to Sector 0: Nova Lab Atrium
    this.createAirlockDoor(0, "Return to Sector 0: Nova Lab Atrium");
  }

  /**
   * Central Tokamak Plasma Fusion Reactor Core
   */
  createCentralReactorCore() {
    const reactorGroup = new THREE.Group();

    // Massive Reactor Base Pedestal (Stepped Cylinders)
    const base1 = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.8, 0.6, 24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 })
    );
    base1.position.y = 0.3;
    base1.castShadow = true;
    reactorGroup.add(base1);
    this.colliders.push(base1);

    const base2 = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 })
    );
    base2.position.y = 0.8;
    reactorGroup.add(base2);

    // Glowing Tokamak Confinement Torus Base
    const torusBase = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.18, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.9 })
    );
    torusBase.rotation.x = Math.PI / 2;
    torusBase.position.y = 1.1;
    reactorGroup.add(torusBase);

    // Central Pulsing Plasma Energy Core Sphere
    const coreGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.1
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.coreMesh.position.y = 2.8;
    reactorGroup.add(this.coreMesh);

    // Magnetic Confinement Ring 1 (Horizontal)
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.05, 16, 32), ring1Mat);
    ring1.position.y = 2.8;
    reactorGroup.add(ring1);

    // Magnetic Confinement Ring 2 (Vertical X)
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.8
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.05, 16, 32), ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 2.8;
    reactorGroup.add(ring2);

    // Magnetic Confinement Ring 3 (Diagonal)
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8
    });
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.05, 16, 32), ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    ring3.position.y = 2.8;
    reactorGroup.add(ring3);

    // Top Magnetic Cap
    const topCap = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 1.8, 0.5, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 })
    );
    topCap.position.y = 4.8;
    reactorGroup.add(topCap);

    reactorGroup.position.set(0, 0, 0);
    this.rootGroup.add(reactorGroup);

    // Core Animation loop
    this.animatedObjects.push({
      tick: (delta) => {
        // Confinement rings spinning on 3 axes
        ring1.rotation.z += delta * 0.9;
        ring2.rotation.y += delta * 0.7;
        ring3.rotation.x += delta * 0.8;

        // Plasma core breathing pulse
        if (this.isCoreRestored) {
          const pulse = 1 + Math.sin(Date.now() * 0.006) * 0.15;
          this.coreMesh.scale.set(pulse, pulse, pulse);
          this.coreMesh.material.emissiveIntensity = 1.8 + Math.sin(Date.now() * 0.008) * 0.5;
        } else {
          // Warning unstable flicker
          const flicker = 1 + Math.sin(Date.now() * 0.015) * 0.08;
          this.coreMesh.scale.set(flicker, flicker, flicker);
          this.coreMesh.material.emissiveIntensity = 1.0 + Math.sin(Date.now() * 0.02) * 0.4;
        }
      }
    });
  }

  /**
   * Five Radial Sector Stabilizer Consoles positioned around the central reactor
   */
  createRadialStabilizerConsoles() {
    const stations = [
      {
        key: 'chem',
        title: "Sector 1: Chemistry Containment Matrix",
        subject: 'chemistry',
        angle: (Math.PI * 2 * 0) / 5 - Math.PI / 2, // North-West
        color: 0x3b82f6,
        colorHex: '#3b82f6',
        icon: '🧪'
      },
      {
        key: 'bio',
        title: "Sector 2: Biology Life-Support Matrix",
        subject: 'biology',
        angle: (Math.PI * 2 * 1) / 5 - Math.PI / 2, // North-East
        color: 0x10b981,
        colorHex: '#10b981',
        icon: '🌱'
      },
      {
        key: 'phys',
        title: "Sector 3: Physics Inertial Dampeners",
        subject: 'physics',
        angle: (Math.PI * 2 * 2) / 5 - Math.PI / 2, // East
        color: 0xf59e0b,
        colorHex: '#f59e0b',
        icon: '⚡'
      },
      {
        key: 'earth',
        title: "Sector 4: Earth Hydrological Dissipator",
        subject: 'earth',
        angle: (Math.PI * 2 * 3) / 5 - Math.PI / 2, // South-West
        color: 0x059669,
        colorHex: '#059669',
        icon: '🛡️'
      },
      {
        key: 'energy',
        title: "Sector 5: Energy Superconducting Grid",
        subject: 'energy',
        angle: (Math.PI * 2 * 4) / 5 - Math.PI / 2, // South-East
        color: 0xeab308,
        colorHex: '#eab308',
        icon: '🔋'
      }
    ];

    const distance = 8.0; // Distance from center

    stations.forEach((st) => {
      const posX = Math.cos(st.angle) * distance;
      const posZ = Math.sin(st.angle) * distance;

      const consoleGroup = new THREE.Group();

      // Console Stand Pedestal
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.9, 0.9, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
      );
      stand.position.y = 0.45;
      stand.castShadow = true;
      consoleGroup.add(stand);
      this.colliders.push(stand);

      // Angled Command Screen
      const screenMat = new THREE.MeshStandardMaterial({
        color: st.color,
        emissive: 0x0f172a,
        emissiveIntensity: 0.3
      });
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.08), screenMat);
      screen.rotation.x = -Math.PI / 4;
      screen.position.set(0, 0.95, 0);
      consoleGroup.add(screen);

      // Floating Holo Orb Indicator
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xef4444, // Red = Warning Unstabilized
        emissive: 0xdc2626,
        emissiveIntensity: 0.8
      });
      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), orbMat);
      orb.position.set(0, 1.5, 0);
      consoleGroup.add(orb);

      // Energy Laser Beam pointing to Central Core
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0xef4444, // Red warning beam initially
        emissive: 0xdc2626,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.5
      });
      const beamGeo = new THREE.CylinderGeometry(0.03, 0.03, distance - 2.5, 8);
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.rotation.z = Math.PI / 2;
      beam.rotation.y = -st.angle + Math.PI / 2;
      beam.position.set(posX / 2, 2.8, posZ / 2);
      this.rootGroup.add(beam);

      this.beams.push({ key: st.key, beam, beamMat, orbMat, screenMat, color: st.color });

      consoleGroup.position.set(posX, 0, posZ);
      consoleGroup.rotation.y = -st.angle - Math.PI / 2;
      this.rootGroup.add(consoleGroup);

      // Orb hover animation
      this.animatedObjects.push({
        tick: (delta) => {
          orb.rotation.y += delta * 1.2;
          orb.position.y = 1.5 + Math.sin(Date.now() * 0.004) * 0.06;
        }
      });

      // Register Interaction
      this.interactables.push({
        mesh: consoleGroup,
        label: `Stabilize ${st.title}`,
        maxDistance: 3.5,
        onInteract: () => {
          if (this.stabilizedConsoles[st.key]) {
            this.uiManager.showToast(`✅ ${st.title} is already synchronized!`, "info");
            return;
          }

          const grade = saveSystem.data.profile.grade || 8;
          const qData = getQuestion(grade, st.subject, 0);

          this.uiManager.showQuizModal({
            title: `CORE CONTAINMENT: ${st.title.toUpperCase()}`,
            question: qData.question,
            options: qData.options,
            explanation: qData.explanation,
            onCorrect: () => {
              this.stabilizedConsoles[st.key] = true;
              orbMat.color.setHex(st.color);
              orbMat.emissive.setHex(st.color);
              beamMat.color.setHex(st.color);
              beamMat.emissive.setHex(st.color);
              beamMat.opacity = 0.95;
              beamMat.emissiveIntensity = 1.5;
              screenMat.emissive.setHex(st.color);
              screenMat.emissiveIntensity = 0.9;

              this.checkContainmentStatus();
            }
          });
        }
      });
    });
  }

  /**
   * Check how many sector consoles have been stabilized
   */
  checkContainmentStatus() {
    const total = Object.keys(this.stabilizedConsoles).length;
    const count = Object.values(this.stabilizedConsoles).filter(Boolean).length;

    this.uiManager.showToast(`Stabilized Consoles: ${count} / ${total}`, "success");

    if (count < total) {
      gameState.setObjective(`Synchronize remaining Sector Consoles (${count}/${total}) around the Reactor Core!`);
    } else {
      // All 5 Stabilized!
      gameState.setObjective("All 5 Sectors Synchronized! Initiate Master Core Ignition at South Command Console!");
      this.uiManager.showToast("⚡ ALL SECTORS LOCKED! Proceed to Master Ignition Console.", "success");

      // Turn central core glowing golden/cyan
      if (this.coreMesh) {
        this.coreMesh.material.color.setHex(0x38bdf8);
        this.coreMesh.material.emissive.setHex(0x0284c7);
      }
    }
  }

  /**
   * Master Ignition Command Console (South entrance)
   */
  createMasterIgnitionConsole() {
    const table = this.createLabWorkbench(0, 8, Math.PI, 4.5, 1.8, 1.0);

    const consoleHolo = new THREE.Group();

    // Master Ignition Holographic Core Crystal
    const crystalGeo = new THREE.DodecahedronGeometry(0.35);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 0.9,
      wireframe: true
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(0, 0.4, 0);
    consoleHolo.add(crystal);

    consoleHolo.position.set(0, 1.08, 8);
    this.rootGroup.add(consoleHolo);

    this.animatedObjects.push({
      tick: (delta) => {
        crystal.rotation.y += delta * 1.5;
        crystal.rotation.x += delta * 0.8;
      }
    });

    // Register Master Ignition Interaction
    this.interactables.push({
      mesh: table,
      label: "MASTER IGNITION: Restore Nova Energy Core",
      maxDistance: 3.8,
      onInteract: () => {
        const count = Object.values(this.stabilizedConsoles).filter(Boolean).length;
        if (count < 5) {
          this.uiManager.showToast(`⚠️ Containment incomplete! Synchronize all 5 consoles first (${count}/5).`, "warn");
          return;
        }

        // Final Climax Challenge: Conservation of Total Energy
        this.uiManager.showQuizModal({
          title: "⚛️ MASTER CORE IGNITION: TOTAL ENERGY CONSERVATION",
          question: "To initiate the reactor ignition cycle: Which fundamental universal law states that the total energy of an isolated system remains constant over time?",
          options: [
            { text: "Law of Conservation of Total Energy", isCorrect: true },
            { text: "Law of Universal Gravitational Decay", isCorrect: false },
            { text: "Thermal Radiation Dissipation Law", isCorrect: false },
            { text: "Hooke's Harmonic Spring Principle", isCorrect: false }
          ],
          explanation: "The Law of Conservation of Energy dictates that energy can neither be created nor destroyed—only converted between thermal, electrical, nuclear, and kinetic forms.",
          onCorrect: () => {
            this.isCoreRestored = true;
            this.coreMesh.material.color.setHex(0xfacc15);
            this.coreMesh.material.emissive.setHex(0xeab308);
            this.coreMesh.material.emissiveIntensity = 2.0;

            gameState.setObjective("NOVA SCIENCE LAB RESTORED! Power grid operational at 100% capacity!");

            // Trigger Grand Victory Celebration
            this.uiManager.showLevelCompleteModal({
              levelId: 6,
              title: "The Energy Core: Central Reactor",
              badgeId: "master_scientist_badge",
              cardId: "card_energy_conservation",
              xpEarned: 500,
              coinsEarned: 100,
              stars: 3,
              onNextLevel: () => {
                this.uiManager.openMainMenu();
                this.uiManager.showSubView('badges');
              }
            });
          }
        });
      }
    });
  }

  /**
   * Decorative High-Power Overhead Conduits
   */
  createReactorDecorations() {
    // 4 Overhead Power Conduits spanning across ceiling to the central reactor
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.9 });

    [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((rot) => {
      const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 14, 16), pipeMat);
      conduit.rotation.z = Math.PI / 2;
      conduit.rotation.y = rot;
      conduit.position.set(Math.cos(rot) * 7, 5.8, Math.sin(rot) * 7);
      this.rootGroup.add(conduit);

      const glowLine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 14, 8), glowMat);
      glowLine.rotation.z = Math.PI / 2;
      glowLine.rotation.y = rot;
      glowLine.position.set(Math.cos(rot) * 7, 5.7, Math.sin(rot) * 7);
      this.rootGroup.add(glowLine);
    });
  }
}
