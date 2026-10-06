/**
 * SCIENCE LAB: The Lost Energy Core
 * Level 3: Physics Lab (Dynamics, Gravitational Acceleration, Newton's Laws & Optics)
 * 
 * Curriculum Alignment (Grades 6–10):
 * - Push/Pull forces & inertia
 * - Galileo's Universal Gravitational Acceleration in vacuum (g ≈ 9.8 m/s²)
 * - Newton's Second Law of Motion: F = m × a (Force = Mass × Acceleration)
 * - Kinetic Energy calculation: KE = 0.5 × m × v²
 * - Snell's Law of Optical Refraction: n1 sin θ1 = n2 sin θ2 (Bending of light across media)
 */

import * as THREE from 'three';
import { BaseLevel } from './baseLevel.js';
import { getQuestion } from '../data/questions.js';
import { gameState } from '../state/gameState.js';
import { saveSystem } from '../state/saveSystem.js';

export class Level3Physics extends BaseLevel {
  constructor(uiManager) {
    super(3, "Physics Lab: Dynamics & Motion", 0xf59e0b);
    this.uiManager = uiManager;

    this.spawnPoint = { x: 0, y: 0, z: 9, rotY: 0 };
    this.completedStations = { 1: false, 2: false, 3: false };

    this.initLevel();
  }

  initLevel() {
    // 1. Build laboratory room shell (28m x 28m x 6m) with amber/gold neon trims
    this.buildLabRoom(28, 28, 6);

    // 2. Set active HUD objective
    gameState.setObjective("Calibrate the Gravitational Vacuum Drop Chamber at West Station 1.");

    // 3. Station 1: Gravitational Acceleration Vacuum Chamber (West)
    this.createVacuumChamberStation();

    // 4. Station 2: Newtonian Dynamics & F=m*a Acceleration Track (North)
    this.createDynamicsTrackStation();

    // 5. Station 3: Optical Laser Refraction & Snell's Law Bench (East)
    this.createOpticsBenchStation();

    // 6. Physics Lab Props (Magnetic pulse coils, Particle accelerator beam)
    this.createPhysicsDecorations();

    // 7. Interactive Airlock Door linking to Sector 4: Earth Lab
    this.createAirlockDoor(4, "Enter Sector 4: Earth Lab");
  }

  /**
   * Station 1: Gravitational Vacuum Drop Chamber (West Table)
   */
  createVacuumChamberStation() {
    const table = this.createLabWorkbench(-7, 0, Math.PI / 2, 5, 2.0, 1.0);

    const vacuumGroup = new THREE.Group();

    // Base pedestal
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.95, 0.25, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.12;
    vacuumGroup.add(base);

    // Tall Transparent Vacuum Tube
    const tubeGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.2, 24, 1, true);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.2
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.y = 1.35;
    vacuumGroup.add(tube);

    // Top Cap with Vacuum Pump Valve
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.2, 16), baseMat);
    topCap.position.y = 2.55;
    vacuumGroup.add(topCap);

    // Heavy Anvil (Cube) suspended inside
    const anvilGeo = new THREE.BoxGeometry(0.18, 0.15, 0.18);
    const anvilMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    const anvil = new THREE.Mesh(anvilGeo, anvilMat);
    anvil.position.set(-0.2, 2.0, 0);
    vacuumGroup.add(anvil);

    // Light Feather (Flat capsule) suspended inside
    const featherGeo = new THREE.ConeGeometry(0.08, 0.35, 8);
    const featherMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const feather = new THREE.Mesh(featherGeo, featherMat);
    feather.position.set(0.2, 2.0, 0);
    feather.rotation.z = 0.4;
    vacuumGroup.add(feather);

    // Glowing Vacuum Gravitational Field Lines
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.025, 12, 24), ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 1.0;
    vacuumGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.025, 12, 24), ringMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 1.8;
    vacuumGroup.add(ring2);

    vacuumGroup.position.set(-7, 1.08, 0);
    this.rootGroup.add(vacuumGroup);

    // Animated Free-fall Drop simulation
    let dropTime = 0;
    this.animatedObjects.push({
      tick: (delta) => {
        dropTime += delta * 1.5;
        // Periodic drop cycle: fall from y=2.2 down to y=0.4 then reset
        const progress = (Math.sin(dropTime) + 1) / 2; // 0 to 1
        const yPos = 0.4 + (progress * progress) * 1.8; // Quadratic acceleration
        anvil.position.y = yPos;
        feather.position.y = yPos;
        feather.rotation.y += delta * 0.8;
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 1: Test Vacuum Gravitational Acceleration",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'physics', 0);

        this.uiManager.showQuizModal({
          title: "STATION 1: VACUUM GRAVITY & FREE-FALL",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[1] = true;
            ringMat.emissive.setHex(0x10b981);
            gameState.setObjective("Vacuum calibrated! Proceed to North Station 2: Newton's F=m*a Dynamics Track.");
            this.uiManager.showToast("Station 1 Calibrated! Gravity field stabilized.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 2: Newtonian Dynamics & Force-Mass-Acceleration Track (North Table)
   */
  createDynamicsTrackStation() {
    const table = this.createLabWorkbench(0, -7, 0, 5.5, 2.0, 1.0);

    const trackGroup = new THREE.Group();

    // 1. Magnetic Linear Air Track
    const trackBed = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.12, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
    );
    trackBed.position.y = 0.06;
    trackGroup.add(trackBed);

    // Glowing center magnetic rail
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.03, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.9 })
    );
    rail.position.y = 0.13;
    trackGroup.add(rail);

    // End Stop Bumpers
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
    const leftBumper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.45), bumperMat);
    leftBumper.position.set(-2.0, 0.2, 0);
    trackGroup.add(leftBumper);

    const rightBumper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.45), bumperMat);
    rightBumper.position.set(2.0, 0.2, 0);
    trackGroup.add(rightBumper);

    // 2. Glider Cart with digital speed display
    const cartGroup = new THREE.Group();
    const cartBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.18, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 })
    );
    cartBody.position.y = 0.12;
    cartGroup.add(cartBody);

    // Mass weights on cart
    const weightGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 12);
    const weightMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
    const weight1 = new THREE.Mesh(weightGeo, weightMat);
    weight1.position.set(-0.15, 0.26, 0);
    cartGroup.add(weight1);

    const weight2 = new THREE.Mesh(weightGeo, weightMat);
    weight2.position.set(0.15, 0.26, 0);
    cartGroup.add(weight2);

    trackGroup.add(cartGroup);

    trackGroup.position.set(0, 1.08, -7);
    this.rootGroup.add(trackGroup);

    // Glider sliding animation (Harmonic oscillation)
    this.animatedObjects.push({
      tick: (delta) => {
        cartGroup.position.x = Math.sin(Date.now() * 0.003) * 1.6;
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 2: Tune F = m × a Dynamic Acceleration Track",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'physics', 1);

        this.uiManager.showQuizModal({
          title: "STATION 2: NEWTONIAN DYNAMICS (F = m × a)",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[2] = true;
            rail.material.emissive.setHex(0x10b981);
            gameState.setObjective("Dynamics calibrated! Proceed to East Station 3: Optical Laser Refraction.");
            this.uiManager.showToast("Station 2 Calibrated! Acceleration vectors locked.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 3: Optical Laser Refraction & Snell's Law Bench (East Table)
   */
  createOpticsBenchStation() {
    const table = this.createLabWorkbench(7, 0, -Math.PI / 2, 5, 2.0, 1.0);

    const opticsGroup = new THREE.Group();

    // Optical Bench Base Rail
    const baseRail = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    baseRail.position.y = 0.05;
    opticsGroup.add(baseRail);

    // Laser Emitter (Left side)
    const emitter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.14, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 })
    );
    emitter.rotation.z = Math.PI / 2;
    emitter.position.set(-1.4, 0.35, 0);
    opticsGroup.add(emitter);

    // Optical Triangular Prism in center
    const prismGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 3);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      roughness: 0.05,
      metalness: 0.1
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(0, 0.35, 0);
    opticsGroup.add(prism);

    // Glowing Laser Beam Segment 1: Emitter -> Prism (Amber Beam)
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.9
    });
    const beam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8), beamMat);
    beam1.rotation.z = Math.PI / 2;
    beam1.position.set(-0.7, 0.35, 0);
    opticsGroup.add(beam1);

    // Glowing Refracted Laser Beam Segment 2: Prism -> Sensor (Bent Angle)
    const beam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8), beamMat);
    beam2.rotation.z = Math.PI / 2 - 0.35; // Snell refraction bend
    beam2.position.set(0.7, 0.22, 0);
    opticsGroup.add(beam2);

    // Optical Sensor Collector (Right side)
    const sensor = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
    );
    sensor.position.set(1.4, 0.12, 0);
    opticsGroup.add(sensor);

    opticsGroup.position.set(7, 1.08, 0);
    this.rootGroup.add(opticsGroup);

    // Prism subtle shimmer
    this.animatedObjects.push({
      tick: (delta) => {
        prism.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
      }
    });

    // Register Interaction (Final Station for Sector 3)
    this.interactables.push({
      mesh: table,
      label: "Station 3: Align Laser Refraction & Snell's Law",
      maxDistance: 3.8,
      onInteract: () => {
        this.uiManager.showQuizModal({
          title: "STATION 3: OPTICAL REFRACTION & SNELL'S LAW",
          question: "When a laser beam travels from air into a dense optical prism (higher refractive index n), what occurs to the light wave?",
          options: [
            { text: "It slows down and refracts towards the normal line", isCorrect: true },
            { text: "It speeds up and refracts away from the normal line", isCorrect: false },
            { text: "Its wavelength increases and frequency doubles", isCorrect: false },
            { text: "It stops completely and converts into mass", isCorrect: false }
          ],
          explanation: "By Snell's Law (n1 sin θ1 = n2 sin θ2), light travels slower in denser media, causing the wavefront to bend towards the normal.",
          onCorrect: () => {
            this.completedStations[3] = true;
            beamMat.emissive.setHex(0x10b981);
            beamMat.color.setHex(0x34d399);
            gameState.setObjective("Sector 3 Stabilized! Proceed to Sector 4: Earth & Ecological Lab.");
            this.uiManager.showLevelCompleteModal({
              levelId: 3,
              title: "Physics Lab: Dynamics & Motion",
              badgeId: "phys_badge",
              cardId: "card_newton_second",
              xpEarned: 150,
              coinsEarned: 30,
              stars: 3,
              onNextLevel: () => {
                gameState.setLevel(4);
              }
            });
          }
        });
      }
    });
  }

  /**
   * Decorative Physics Lab Coils & Accelerator Conduits
   */
  createPhysicsDecorations() {
    // Gravitational Accelerator Ring Arch (South-East Corner)
    const archGroup = new THREE.Group();
    const torusGeo = new THREE.TorusGeometry(1.8, 0.15, 16, 32);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      metalness: 0.8
    });
    const arch = new THREE.Mesh(torusGeo, archMat);
    arch.position.y = 2.5;
    archGroup.add(arch);

    archGroup.position.set(10, 0, 10);
    this.rootGroup.add(archGroup);
    this.colliders.push(arch);

    this.animatedObjects.push({
      tick: (delta) => {
        arch.rotation.y += delta * 0.4;
      }
    });
  }
}
