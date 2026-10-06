/**
 * SCIENCE LAB: The Lost Energy Core
 * Level 4: Earth Lab (Ecological Systems, Hydrologic Cycle, Atmosphere & Renewable Energy)
 * 
 * Curriculum Alignment (Grades 6–10):
 * - 4 Stages of the Water (Hydrologic) Cycle: Evaporation, Condensation, Precipitation, Runoff
 * - Greenhouse effect (CO2, Methane) and the Stratospheric Ozone (O3) layer
 * - Freshwater Eutrophication (Algal blooms & dissolved oxygen depletion from agricultural runoff)
 * - Renewable energy technologies: Photovoltaic (PV) semiconductor bandgap & Wind turbines
 */

import * as THREE from 'three';
import { BaseLevel } from './baseLevel.js';
import { getQuestion } from '../data/questions.js';
import { gameState } from '../state/gameState.js';
import { saveSystem } from '../state/saveSystem.js';

export class Level4Earth extends BaseLevel {
  constructor(uiManager) {
    super(4, "Earth Lab: Ecological Systems", 0x059669);
    this.uiManager = uiManager;

    this.spawnPoint = { x: 0, y: 0, z: 9, rotY: 0 };
    this.completedStations = { 1: false, 2: false, 3: false };

    this.initLevel();
  }

  initLevel() {
    // 1. Build laboratory room shell (28m x 28m x 6m) with emerald green sci-fi trims
    this.buildLabRoom(28, 28, 6);

    // 2. Set active HUD objective
    gameState.setObjective("Calibrate the Hydrologic Water Cycle Simulator at West Station 1.");

    // 3. Station 1: Hydrologic Water Cycle Simulator (West)
    this.createWaterCycleStation();

    // 4. Station 2: Atmospheric Scrubber & Ozone Layer Filter (North)
    this.createAtmosphereStation();

    // 5. Station 3: Renewable Solar PV & Wind Energy Station (East)
    this.createRenewableEnergyStation();

    // 6. Earth Eco-Lab Props (Terraforming terrarium dome, hydrological pipes)
    this.createEarthDecorations();

    // 7. Interactive Airlock Door linking to Sector 5: Energy Lab
    this.createAirlockDoor(5, "Enter Sector 5: Energy Lab");
  }

  /**
   * Station 1: Hydrologic Water Cycle Biosphere Simulator (West Table)
   */
  createWaterCycleStation() {
    const table = this.createLabWorkbench(-7, 0, Math.PI / 2, 5, 2.0, 1.0);

    const globeGroup = new THREE.Group();

    // Base console pedestal
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 1.0, 0.25, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    base.position.y = 0.12;
    globeGroup.add(base);

    // 3D Miniature Earth / Biosphere Globe
    const earthGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Ocean blue
      roughness: 0.4,
      metalness: 0.1
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.y = 1.0;
    globeGroup.add(earthMesh);

    // Green Continental Landmasses
    const landGeo = new THREE.SphereGeometry(0.555, 16, 16);
    const landMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.6,
      wireframe: true
    });
    const landMesh = new THREE.Mesh(landGeo, landMat);
    landMesh.position.y = 1.0;
    globeGroup.add(landMesh);

    // Swirling Atmospheric Cloud Ring (Condensation)
    const cloudRingGeo = new THREE.TorusGeometry(0.75, 0.05, 12, 32);
    const cloudRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xe0f2fe,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.8
    });
    const cloudRing = new THREE.Mesh(cloudRingGeo, cloudRingMat);
    cloudRing.rotation.x = Math.PI / 2.3;
    cloudRing.position.y = 1.0;
    globeGroup.add(cloudRing);

    globeGroup.position.set(-7, 1.08, 0);
    this.rootGroup.add(globeGroup);

    // Globe rotation animation
    this.animatedObjects.push({
      tick: (delta) => {
        earthMesh.rotation.y += delta * 0.4;
        landMesh.rotation.y += delta * 0.4;
        cloudRing.rotation.z += delta * 0.6;
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 1: Restore 4-Stage Hydrologic Water Cycle",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'earth', 0);

        this.uiManager.showQuizModal({
          title: "STATION 1: THE HYDROLOGIC WATER CYCLE",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[1] = true;
            cloudRingMat.emissive.setHex(0x00f0ff);
            gameState.setObjective("Water cycle restored! Proceed to North Station 2: Atmospheric Ozone Scrubber.");
            this.uiManager.showToast("Station 1 Restored! Hydrological cycle flowing.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 2: Atmospheric Scrubber & Ozone Layer Filter (North Table)
   */
  createAtmosphereStation() {
    const table = this.createLabWorkbench(0, -7, 0, 5.5, 2.0, 1.0);

    const atmoGroup = new THREE.Group();

    // Base column mount
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.1, 0.25, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    base.position.y = 0.12;
    atmoGroup.add(base);

    // Layer 1: Troposphere Cylinder (Bottom, Weather & Clouds)
    const tropo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.5, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
    );
    tropo.position.y = 0.5;
    atmoGroup.add(tropo);

    // Layer 2: Stratosphere & O3 Ozone Shield (Middle, Glowing Cyan/Blue)
    const ozoneMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x047857,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.6
    });
    const strato = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.5, 24, 1, true),
      ozoneMat
    );
    strato.position.y = 1.05;
    atmoGroup.add(strato);

    // Layer 3: Mesosphere & Thermosphere (Top)
    const meso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.5, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x818cf8, transparent: true, opacity: 0.35 })
    );
    meso.position.y = 1.6;
    atmoGroup.add(meso);

    // Top Solar UV Emitter Dome
    const topCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.68, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.5 })
    );
    topCap.position.y = 1.85;
    atmoGroup.add(topCap);

    atmoGroup.position.set(0, 1.08, -7);
    this.rootGroup.add(atmoGroup);

    // Ozone pulse animation
    this.animatedObjects.push({
      tick: (delta) => {
        ozoneMat.emissiveIntensity = 0.7 + Math.sin(Date.now() * 0.003) * 0.25;
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 2: Filter Greenhouse Gases & Replenish Ozone",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'earth', 1);

        this.uiManager.showQuizModal({
          title: "STATION 2: ATMOSPHERIC LAYERS & GREENHOUSE GASES",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[2] = true;
            ozoneMat.emissive.setHex(0x10b981);
            gameState.setObjective("Atmosphere stabilized! Proceed to East Station 3: Renewable Energy & Water Treatment.");
            this.uiManager.showToast("Station 2 Purified! Ozone layer shield active.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 3: Renewable Solar PV & Wind Energy Station (East Table)
   */
  createRenewableEnergyStation() {
    const table = this.createLabWorkbench(7, 0, -Math.PI / 2, 5, 2.0, 1.0);

    const renewGroup = new THREE.Group();

    // 1. Photovoltaic Solar Panel Array (Angled Blue Silicon Grid)
    const panelGroup = new THREE.Group();
    const panelBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.06, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    panelGroup.add(panelBase);

    // Glowing blue silicon cells
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      emissive: 0x2563eb,
      emissiveIntensity: 0.6,
      metalness: 0.6,
      roughness: 0.2
    });
    const panelCells = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.07, 0.85), cellMat);
    panelCells.position.y = 0.02;
    panelGroup.add(panelCells);

    panelGroup.rotation.x = -Math.PI / 6; // 30-degree solar tilt
    panelGroup.position.set(-1.0, 0.35, 0);
    renewGroup.add(panelGroup);

    // 2. Miniature Clean Wind Turbine
    const turbineGroup = new THREE.Group();
    const towerGeo = new THREE.CylinderGeometry(0.04, 0.07, 1.4, 12);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 0.7;
    turbineGroup.add(tower);

    // Nacelle (Generator hub)
    const nacelle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.22, 12),
      new THREE.MeshStandardMaterial({ color: 0x059669, emissive: 0x047857, emissiveIntensity: 0.4 })
    );
    nacelle.rotation.x = Math.PI / 2;
    nacelle.position.set(0, 1.4, 0.05);
    turbineGroup.add(nacelle);

    // Rotor with 3 aerodynamic blades
    const rotorGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.04, 0.6, 0.015);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      const angle = (i * Math.PI * 2) / 3;
      blade.position.set(Math.sin(angle) * 0.3, Math.cos(angle) * 0.3, 0);
      blade.rotation.z = -angle;
      rotorGroup.add(blade);
    }

    rotorGroup.position.set(0, 1.4, 0.18);
    turbineGroup.add(rotorGroup);

    turbineGroup.position.set(1.0, 0, 0);
    renewGroup.add(turbineGroup);

    renewGroup.position.set(7, 1.08, 0);
    this.rootGroup.add(renewGroup);

    // Wind turbine rotation animation
    this.animatedObjects.push({
      tick: (delta) => {
        rotorGroup.rotation.z += delta * 4.0;
      }
    });

    // Register Interaction (Final Station for Sector 4)
    this.interactables.push({
      mesh: table,
      label: "Station 3: Activate Photovoltaics & Water Treatment",
      maxDistance: 3.8,
      onInteract: () => {
        this.uiManager.showQuizModal({
          title: "STATION 3: RENEWABLE ENERGY & ECOSYSTEMS",
          question: "Which renewable energy mechanism converts solar photons directly into electricity via semiconductor electron excitations?",
          options: [
            { text: "Photovoltaic (PV) Effect", isCorrect: true },
            { text: "Geothermal Steam Boiler", isCorrect: false },
            { text: "Piezoelectric Compression", isCorrect: false },
            { text: "Hydroelectric Gravity Dam", isCorrect: false }
          ],
          explanation: "In photovoltaic solar cells, incident photons excite electrons across the silicon semiconductor bandgap, generating clean electric current without greenhouse emissions.",
          onCorrect: () => {
            this.completedStations[3] = true;
            cellMat.emissive.setHex(0x10b981);
            gameState.setObjective("Sector 4 Stabilized! Proceed to Sector 5: Energy & Electrical Grid Lab.");
            this.uiManager.showLevelCompleteModal({
              levelId: 4,
              title: "Earth Lab: Ecological Systems",
              badgeId: "earth_badge",
              cardId: "card_hydrologic_cycle",
              xpEarned: 150,
              coinsEarned: 30,
              stars: 3,
              onNextLevel: () => {
                gameState.setLevel(5);
              }
            });
          }
        });
      }
    });
  }

  /**
   * Decorative Terraforming Dome & Hydrological Filters
   */
  createEarthDecorations() {
    // Terraforming Bio-dome (South-East Corner)
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x047857,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.45,
      wireframe: true
    });
    const terrarium = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), domeMat);
    terrarium.position.set(10, 0, 10);
    this.rootGroup.add(terrarium);
    this.colliders.push(terrarium);
  }
}
