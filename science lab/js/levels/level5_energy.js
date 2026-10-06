/**
 * SCIENCE LAB: The Lost Energy Core
 * Level 5: Energy Lab (Electricity, Circuitry, Ohm's Law & Power Grids)
 * 
 * Curriculum Alignment (Grades 6–10):
 * - Electrical Conductors vs Insulators (Free electron mobility in copper/metals)
 * - Ohm's Law: V = I × R (Voltage = Current × Resistance; I = V / R)
 * - Series Circuits vs Parallel Circuits (Single path vs independent branch paths)
 * - Equivalent resistance in parallel: 1/Req = 1/R1 + 1/R2
 * - Electrical Power: P = V × I (Power measured in Watts)
 */

import * as THREE from 'three';
import { BaseLevel } from './baseLevel.js';
import { getQuestion } from '../data/questions.js';
import { gameState } from '../state/gameState.js';
import { saveSystem } from '../state/saveSystem.js';

export class Level5Energy extends BaseLevel {
  constructor(uiManager) {
    super(5, "Energy Lab: Electricity & Circuits", 0xeab308);
    this.uiManager = uiManager;

    this.spawnPoint = { x: 0, y: 0, z: 9, rotY: 0 };
    this.completedStations = { 1: false, 2: false, 3: false };

    this.initLevel();
  }

  initLevel() {
    // 1. Build room shell (28m x 28m x 6m) with electric yellow neon theme
    this.buildLabRoom(28, 28, 6);

    // 2. Set active HUD objective
    gameState.setObjective("Calibrate the Ohm's Law Circuit Test Bench at West Station 1.");

    // 3. Station 1: Ohm's Law Circuit Test Bench (West)
    this.createOhmsLawStation();

    // 4. Station 2: Series vs Parallel Circuit Switchboard (North)
    this.createCircuitSwitchboardStation();

    // 5. Station 3: Power Transformer & High-Voltage Tesla Coils (East)
    this.createTeslaTransformerStation();

    // 6. High-Voltage Lab Props (Electrical conduits, Capacitor bank)
    this.createEnergyDecorations();

    // 7. Interactive Airlock Door linking to Sector 6: Central Energy Reactor Core
    this.createAirlockDoor(6, "Enter Sector 6: Central Energy Reactor Core");
  }

  /**
   * Station 1: Ohm's Law Circuit Test Bench (West Table)
   */
  createOhmsLawStation() {
    const table = this.createLabWorkbench(-7, 0, Math.PI / 2, 5, 2.0, 1.0);

    const circuitGroup = new THREE.Group();

    // Breadboard Base
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.1, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    board.position.y = 0.05;
    circuitGroup.add(board);

    // 1. Battery Power Pack (Left side)
    const battery = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.4, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6 })
    );
    battery.position.set(-1.1, 0.25, 0);
    circuitGroup.add(battery);

    // 2. Variable Resistor Ceramic Coil (Center)
    const resistor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.9, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.3 })
    );
    resistor.rotation.z = Math.PI / 2;
    resistor.position.set(-0.1, 0.25, 0);
    circuitGroup.add(resistor);

    // 3. Analog Dial Voltmeter / Ammeter (Center-Rear)
    const meter = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.5, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
    );
    meter.position.set(-0.1, 0.55, -0.4);
    circuitGroup.add(meter);

    // 4. Glowing Light Bulb (Right side)
    const bulbGlass = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xeab308,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.85
      })
    );
    bulbGlass.position.set(1.0, 0.32, 0);
    circuitGroup.add(bulbGlass);

    // Copper Traces connecting the loop
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.2 });
    const trace = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.04), copperMat);
    trace.position.set(0, 0.11, 0.45);
    circuitGroup.add(trace);

    circuitGroup.position.set(-7, 1.08, 0);
    this.rootGroup.add(circuitGroup);

    // Bulb glow pulse animation
    this.animatedObjects.push({
      tick: (delta) => {
        bulbGlass.material.emissiveIntensity = 1.0 + Math.sin(Date.now() * 0.006) * 0.3;
      }
    });

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 1: Tune Ohm's Law Circuit (V = I × R)",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'energy', 0);

        this.uiManager.showQuizModal({
          title: "STATION 1: OHM'S LAW & CONDUCTORS",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[1] = true;
            bulbGlass.material.color.setHex(0x34d399);
            bulbGlass.material.emissive.setHex(0x10b981);
            gameState.setObjective("Ohm's Law calibrated! Proceed to North Station 2: Series vs Parallel Switchboard.");
            this.uiManager.showToast("Station 1 Calibrated! Circuit current stabilized.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 2: Series vs Parallel Circuit Switchboard (North Table)
   */
  createCircuitSwitchboardStation() {
    const table = this.createLabWorkbench(0, -7, 0, 5.5, 2.0, 1.0);

    const switchGroup = new THREE.Group();

    // Switchboard Panel
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.12, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 })
    );
    panel.position.y = 0.06;
    switchGroup.add(panel);

    // Dual Twin Bulbs
    const bulbMat1 = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xeab308, emissiveIntensity: 1.0 });
    const bulbMat2 = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xeab308, emissiveIntensity: 1.0 });

    const bulb1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), bulbMat1);
    bulb1.position.set(-0.8, 0.28, 0);
    switchGroup.add(bulb1);

    const bulb2 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), bulbMat2);
    bulb2.position.set(0.8, 0.28, 0);
    switchGroup.add(bulb2);

    // Knife Switches (Brass)
    const switchMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
    const sw1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.08), switchMat);
    sw1.rotation.z = -0.4;
    sw1.position.set(-1.4, 0.2, 0.3);
    switchGroup.add(sw1);

    const sw2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.08), switchMat);
    sw2.rotation.z = -0.4;
    sw2.position.set(1.4, 0.2, 0.3);
    switchGroup.add(sw2);

    switchGroup.position.set(0, 1.08, -7);
    this.rootGroup.add(switchGroup);

    // Register Interaction
    this.interactables.push({
      mesh: table,
      label: "Station 2: Configure Series & Parallel Loops",
      maxDistance: 3.8,
      onInteract: () => {
        const grade = saveSystem.data.profile.grade || 8;
        const qData = getQuestion(grade, 'energy', 1);

        this.uiManager.showQuizModal({
          title: "STATION 2: SERIES VS PARALLEL CIRCUITS",
          question: qData.question,
          options: qData.options,
          explanation: qData.explanation,
          onCorrect: () => {
            this.completedStations[2] = true;
            bulbMat1.emissive.setHex(0x10b981);
            bulbMat2.emissive.setHex(0x10b981);
            gameState.setObjective("Switchboard verified! Proceed to East Station 3: Tesla Power Transformers.");
            this.uiManager.showToast("Station 2 Configured! Parallel branch circuits active.", "success");
          }
        });
      }
    });
  }

  /**
   * Station 3: Power Transformer & High-Voltage Tesla Coils (East Table)
   */
  createTeslaTransformerStation() {
    const table = this.createLabWorkbench(7, 0, -Math.PI / 2, 5, 2.0, 1.0);

    const teslaGroup = new THREE.Group();

    // Twin Tesla Coils
    const createCoil = (xPos) => {
      const coilSub = new THREE.Group();

      // Base
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.45, 0.15, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 })
      );
      base.position.y = 0.08;
      coilSub.add(base);

      // Primary Copper Coil (Cylinder)
      const primary = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.2 })
      );
      primary.position.y = 0.5;
      coilSub.add(primary);

      // Top Toroid Terminal (Ionization Emitter)
      const toroid = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.08, 16, 24),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xeab308,
          emissiveIntensity: 0.9,
          metalness: 0.9
        })
      );
      toroid.rotation.x = Math.PI / 2;
      toroid.position.y = 0.95;
      coilSub.add(toroid);

      coilSub.position.set(xPos, 0, 0);
      return { group: coilSub, toroid };
    };

    const coil1 = createCoil(-0.8);
    const coil2 = createCoil(0.8);
    teslaGroup.add(coil1.group);
    teslaGroup.add(coil2.group);

    // Glowing Electric Arc between toroids
    const arcMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.85
    });
    const arc = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8), arcMat);
    arc.rotation.z = Math.PI / 2;
    arc.position.set(0, 0.95, 0);
    teslaGroup.add(arc);

    teslaGroup.position.set(7, 1.08, 0);
    this.rootGroup.add(teslaGroup);

    // Electric arcing spark jitter
    this.animatedObjects.push({
      tick: (delta) => {
        arc.scale.set(
          1 + Math.sin(Date.now() * 0.04) * 0.3,
          1,
          1 + Math.cos(Date.now() * 0.05) * 0.3
        );
        arcMat.emissiveIntensity = 1.2 + Math.sin(Date.now() * 0.02) * 0.5;
      }
    });

    // Register Interaction (Final Station for Sector 5)
    this.interactables.push({
      mesh: table,
      label: "Station 3: Charge High-Voltage Tesla Transformers",
      maxDistance: 3.8,
      onInteract: () => {
        this.uiManager.showQuizModal({
          title: "STATION 3: ELECTRIC POWER & TRANSFORMERS",
          question: "Which formula calculates the rate of Electrical Power (P) transferred in a circuit, measured in Watts?",
          options: [
            { text: "P = V × I  (Voltage × Current)", isCorrect: true },
            { text: "P = V / I  (Voltage ÷ Current)", isCorrect: false },
            { text: "P = I × R  (Current × Resistance)", isCorrect: false },
            { text: "P = m × g × h", isCorrect: false }
          ],
          explanation: "Electric Power (Watts) equals Voltage (Volts) multiplied by Current (Amperes), representing the energy dissipation or transmission rate.",
          onCorrect: () => {
            this.completedStations[3] = true;
            arcMat.emissive.setHex(0x10b981);
            gameState.setObjective("All 5 Sectors Stabilized! Proceed to Sector 6: Central Energy Reactor Core!");
            this.uiManager.showLevelCompleteModal({
              levelId: 5,
              title: "Energy Lab: Electricity & Circuitry",
              badgeId: "energy_badge",
              cardId: "card_ohms_law",
              xpEarned: 150,
              coinsEarned: 30,
              stars: 3,
              onNextLevel: () => {
                gameState.setLevel(6);
              }
            });
          }
        });
      }
    });
  }

  /**
   * Decorative High-Voltage Capacitors & Busbars
   */
  createEnergyDecorations() {
    // High-Voltage Capacitor Rack (South-East Corner)
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const capRack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.8, 1.0), capMat);
    capRack.position.set(10, 1.9, 10);
    this.rootGroup.add(capRack);
    this.colliders.push(capRack);

    // Glowing Power Bars
    const barMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.8 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.15, 1.02), barMat);
    bar.position.set(10, 3.2, 10);
    this.rootGroup.add(bar);
  }
}
