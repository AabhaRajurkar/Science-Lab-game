# 🔬 SCIENCE LAB: The Lost Energy Core
### 3D Educational Science Adventure Game (Grades 6–10)
*College Major Project • WebGL & Three.js*

---

## 🚀 Project Overview
**SCIENCE LAB: The Lost Energy Core** is an interactive 3D science adventure game built with **Three.js (WebGL)**, **Vanilla ES6 Modules**, **HTML5**, and **CSS3**. The player assumes the role of a Cadet Scientist in **Nova Science Laboratory** after the central Energy Core suffers a catastrophic containment failure. 

To restore power and prevent a total facility meltdown, students must navigate 3D laboratory sectors, complete hands-on scientific experiments, and solve curriculum-aligned science challenges spanning **Chemistry, Biology, Physics, Earth & Environmental Science, and Electricity**.

---

## 🎮 How to Run Locally

Because this project uses modern ES6 modules and Three.js from a CDN with no build step required:
1. **Option A (PowerShell Server):**
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 5500
   ```
   Open `http://localhost:5500` in your web browser.
2. **Option B (VS Code Live Server):**
   - Open the project folder in VS Code.
   - Right-click `index.html` and select **"Open with Live Server"**.
3. **Option C (Python):**
   ```bash
   python -m http.server 5500
   ```

---

## 🕹️ Controls Guide
- **W / A / S / D** or **Arrow Keys**: Move Scientist avatar
- **Spacebar**: Jump with gravitational physics
- **Mouse**: Look around (Pitch & Yaw)
- **E Key** or **Click Interaction Box**: Interact with lab terminals, beakers, instruments, and machines
- **V Key** or **Camera Button**: Smoothly toggle between **First-Person** and **Third-Person** perspectives
- **ESC Key** or **Pause Button**: Open Pause Menu & Settings
- **Touch / Mobile**: Virtual on-screen joystick (bottom-left) and action buttons (bottom-right).

---

## 🗺️ Complete Laboratory Sectors & Levels

| Sector | Title & Subject | 3D Interactive Equipment | Curriculum Topics Covered | Badge & Science Card |
| :---: | :--- | :--- | :--- | :--- |
| **0** | **Nova Lab: Orientation**<br>*(Fundamentals)* | Central Holographic Terminal, Glass Beaker, Bunsen Burner, Thermometer | Scientific method, lab instruments, temperature measurement | 🎖️ **Cadet Scientist**<br>📋 *The Scientific Method* |
| **1** | **Chemistry Lab**<br>*(Matter & Reactions)* | Phase Cryo-Chamber, Acid-Base Test Tube Rack, Rotating Molecular Bond Synthesizer | States of matter, phase shifts, pH neutralization ($7$), conservation of mass ($2\text{H}_2 + \text{O}_2 \rightarrow 2\text{H}_2\text{O}$) | 🧪 **Master Alchemist**<br>⚖️ *Conservation of Mass* |
| **2** | **Biology Lab**<br>*(Life Systems)* | Hydroponic Incubator Dome, 3D Rotating DNA Double Helix, Pulsing Heart & Lung Scanner | Chloroplasts & photosynthesis, cell organelles (mitochondria), respiratory gas exchange (alveoli) | 🌱 **Bio-Synthesizer**<br>☀️ *Photosynthesis Formula* |
| **3** | **Physics Lab**<br>*(Dynamics & Motion)* | Vacuum Gravitational Drop Tube, Magnetic Air Glider Track, Laser Refraction Optical Bench | Vacuum free-fall ($g = 9.8\text{ m/s}^2$), Newton's 2nd Law ($F = m \cdot a$), Snell's Law ($n_1 \sin\theta_1 = n_2 \sin\theta_2$) | ⚡ **Quantum Mechanic**<br>🏎️ *Newton's 2nd Law* |
| **4** | **Earth Lab**<br>*(Ecological Systems)* | 4-Stage Hydrologic Earth Globe, Stratospheric Ozone Column, Solar PV Array & Wind Turbine | Water cycle phases, greenhouse effect ($\text{CO}_2$), ozone shield ($\text{O}_3$), photovoltaics & eutrophication | 🛡️ **Earth Guardian**<br>🌧️ *The Hydrologic Cycle* |
| **5** | **Energy Lab**<br>*(Electricity & Circuits)* | Ohm's Law Breadboard, Series vs Parallel Switchboard, High-Voltage Tesla Transformers | Electrical conductors, Ohm's Law ($V = I \cdot R$), series vs parallel equivalent resistance, Power ($P = V \cdot I$) | 🔋 **Energy Engineer**<br>⚡ *Ohm's Law* |
| **6** | **The Energy Core**<br>*(Central Reactor)* | Central Tokamak Plasma Core, 5 Radial Sector Stabilizers, Master Ignition Command Terminal | Master science integration, reactor containment synchronization, Conservation of Total Energy ($E_i = E_f$) | 👑 **MASTER SCIENTIST**<br>🌌 *Conservation of Total Energy* |

---

## 📂 Project Architecture & File Structure

```
science lab/
├── index.html                    # Main HTML5 entrypoint with Three.js r160 CDN import map & UI overlay hierarchy
├── css/
│   ├── main.css                  # Core sci-fi design system, color tokens, typography, glassmorphism, animations
│   └── ui.css                    # HUD panels, interaction prompts, reticle crosshairs, modals, mobile joystick, toasts
├── js/
│   ├── main.js                   # Application coordinator & game bootstrap
│   ├── state/
│   │   ├── gameState.js          # Runtime game state manager & event bus
│   │   └── saveSystem.js         # Persistent localStorage manager (Profile, Grade, Stars, XP, Coins, Badges, Cards)
│   ├── core/
│   │   ├── sceneManager.js       # Three.js WebGLRenderer, PerspectiveCamera, dynamic lights, clock loop, disposal
│   │   ├── player.js             # 3D Scientist character avatar, custom physics (gravity/jump), WASD & touch controls
│   │   ├── cameraManager.js      # First-person and Third-person camera view controller with smooth interpolation
│   │   ├── interaction.js        # Raycaster, proximity detection, mesh highlighting, and "Press E" HUD prompts
│   │   └── audio.js              # Web Audio API procedural sound synthesizer (zero external audio dependencies)
│   ├── data/
│   │   ├── questions.js          # Data-driven question bank organized by Grade (6 to 10) with "Why" explanations
│   │   └── labData.js            # Laboratory configurations, theme colors, story briefings, badges, science cards
│   ├── ui/
│   │   └── uiManager.js          # UI manager for HUD updates, quiz popups, pause menu, toasts, mobile joystick
│   └── levels/
│       ├── baseLevel.js          # Base 3D room generator, wall collisions, workbench builders, GPU memory disposal
│       ├── level0_tutorial.js    # Interactive Level 0 Atrium with 3D instruments, hologram terminal, tutorial mission
│       ├── level1_chem.js        # Chemistry Lab (Matter & Reactions)
│       ├── level2_bio.js         # Biology Lab (Life Systems)
│       ├── level3_phys.js        # Physics Lab (Dynamics & Motion)
│       ├── level4_earth.js       # Earth Lab (Ecological Systems)
│       ├── level5_energy.js      # Energy Lab (Circuits & Ohm's Law)
│       └── level6_core.js        # Final Level (Energy Core Reactor Boss)
├── push-to-github.ps1            # Automated GitHub synchronization script
├── serve.ps1                     # Lightweight PowerShell HTTP web server
└── README.md
```

---

## 🎓 Viva Voce & Technical Exam Concepts

### 1. WebGL & Three.js Rendering Pipeline
- **Scene Graph:** Tree hierarchy where transformation matrices (position, rotation, scale) propagate from parent Groups down to child meshes.
- **Perspective Camera:** Simulates human eye optics using field of view (FOV), aspect ratio, near, and far clipping planes.
- **Shader Materials:** `MeshStandardMaterial` implements physically-based rendering (PBR) calculating roughness, metalness, and emissive radiance in real-time fragment shaders.

### 2. Raycasting & Object Picking
- `THREE.Raycaster` projects an origin ray along camera/crosshair normalized device coordinates ($-1$ to $+1$) to calculate polygon intersection distances and trigger proximity highlights.

### 3. GPU Memory Management & Resource Disposal
- WebGL requires explicit disposal of allocated GPU vertex and index buffers. `baseLevel.js` recursively invokes `.dispose()` on all geometries and materials during sector transitions to eliminate memory leaks.

### 4. Zero-Dependency Procedural Audio Synthesizer
- Built on the browser's native **Web Audio API** (`AudioContext`, `OscillatorNode`, `GainNode`), synthesizing sine, triangle, and sawtooth waves with exponential decay envelopes.
