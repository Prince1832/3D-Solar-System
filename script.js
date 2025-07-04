const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.lookAt(0, 0, 7);

let currentTheme = 'dark';
let starsMaterial;

function setTheme(theme) {
    currentTheme = theme;
    document.body.classList.toggle('light', theme === 'light');


    if (stars) {
        stars.visible = theme !== 'light';
    }


    sun.material = new THREE.MeshBasicMaterial({
        map: sunTexture,
        color: 0xffffff,
        transparent: false
    });

    scene.background = new THREE.Color(theme === 'light' ? 0xf0f0f0 : 0x000000);
}


// Responsive camera position
function adjustCameraForScreen() {
    if (window.innerWidth <= 768) {
        camera.position.set(0, 8, 22);
    } else {
        camera.position.set(0, 8, 18);
    }
    camera.lookAt(0, 0, 7);
}
adjustCameraForScreen();

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("solarCanvas"),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Stars
function addStars(count = 1000) {
    const geometry = new THREE.BufferGeometry();
    starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });

    const vertices = [];
    for (let i = 0; i < count; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(200),
            THREE.MathUtils.randFloatSpread(200),
            THREE.MathUtils.randFloatSpread(200)
        );
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    stars = new THREE.Points(geometry, starsMaterial);
    scene.add(stars);
}
addStars();

// Textures
const textureLoader = new THREE.TextureLoader();
const texturePaths = {
    Mercury: 'textures/2k_mercury.jpg',
    // Venus: 'textures/2k_venus_atmosphere.jpg',
    Venus: 'textures/2k_venus_surface.jpg',
    Earth: 'textures/2k_earth_daymap.jpg',
    Mars: 'textures/2k_mars.jpg',
    Jupiter: 'textures/2k_jupiter.jpg',
    Saturn: 'textures/2k_saturn.jpg',
    Uranus: 'textures/2k_uranus.jpg',
    Neptune: 'textures/2k_neptune.jpg',
    Sun: 'textures/2k_sun.jpg'
};

const planetDetails = {
    Sun: { diameter: "1,392,700 km", distance: "0 km (Center)", speed: "0 km/s", rotation: "609.12 hrs", temp: "5505°C", moons: "-", desc: "The star that powers our solar system." },
    Mercury: { diameter: "4,879 km", distance: "57.9M km", speed: "47.4 km/s", rotation: "1407.6 hrs", temp: "167°C", moons: 0, desc: "Smallest planet, no moons." },
    Venus: { diameter: "12,104 km", distance: "108.2M km", speed: "35 km/s", rotation: "5832 hrs", temp: "464°C", moons: 0, desc: "Hottest planet, thick atmosphere." },
    Earth: { diameter: "12,742 km", distance: "149.6M km", speed: "29.78 km/s", rotation: "23.9 hrs", temp: "~15°C", moons: 1, desc: "Only planet known to support life." },
    Mars: { diameter: "6,779 km", distance: "227.9M km", speed: "24 km/s", rotation: "24.6 hrs", temp: "-65°C", moons: 2, desc: "Red planet with huge volcanoes." },
    Jupiter: { diameter: "139,820 km", distance: "778.5M km", speed: "13 km/s", rotation: "9.9 hrs", temp: "-110°C", moons: 92, desc: "Largest planet, gas giant." },
    Saturn: { diameter: "116,460 km", distance: "1.43B km", speed: "9.7 km/s", rotation: "10.7 hrs", temp: "-140°C", moons: 83, desc: "Famous for its rings." },
    Uranus: { diameter: "50,724 km", distance: "2.87B km", speed: "6.8 km/s", rotation: "17.2 hrs", temp: "-195°C", moons: 27, desc: "Rotates sideways, pale blue." },
    Neptune: { diameter: "49,244 km", distance: "4.5B km", speed: "5.4 km/s", rotation: "16.1 hrs", temp: "-200°C", moons: 14, desc: "Strongest winds in solar system." }
};

//Responsive Sun
const sunTexture = textureLoader.load(texturePaths.Sun);
const sunSize = window.innerWidth <= 768 ? 1.0 : 2;
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(sunSize, 32, 32),
    new THREE.MeshBasicMaterial({ map: sunTexture })
);
sun.name = "Sun";
scene.add(sun);
let sunRotationSpeed = 0.001;

// Planets
const basePlanetsData = [
    { name: 'Mercury', size: 0.35, distance: 3.5, speed: 0.012 },
    { name: 'Venus', size: 0.45, distance: 4.8, speed: 0.009 },
    { name: 'Earth', size: 0.5, distance: 6.3, speed: 0.007 },
    { name: 'Mars', size: 0.4, distance: 7.5, speed: 0.006 },
    { name: 'Jupiter', size: 0.9, distance: 9.5, speed: 0.004 },
    { name: 'Saturn', size: 0.8, distance: 11.0, speed: 0.003 },
    { name: 'Uranus', size: 0.65, distance: 12.5, speed: 0.002 },
    { name: 'Neptune', size: 0.6, distance: 13.8, speed: 0.0015 }
];

let planets = [];

let orbitScale = window.innerWidth < 400 ? 0.75 : 1;

function createPlanets(scale = 1) {
    basePlanetsData.forEach(data => {
        textureLoader.load(texturePaths[data.name], (texture) => {
            let orbitX = data.distance * scale;


            if (data.name === 'Mercury' && scale < 1) {
                orbitX = 2.8;
            } else if (scale < 1) {
                orbitX -= 2;
            }

            const ringGeometry = new THREE.RingGeometry(orbitX - 0.01, orbitX + 0.01, 128);
            const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            scene.add(ring);

            const orbitGroup = new THREE.Object3D();
            scene.add(orbitGroup);

            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(data.size, 32, 32),
                new THREE.MeshStandardMaterial({ map: texture })
            );
            mesh.name = data.name;
            mesh.position.x = orbitX;
            orbitGroup.add(mesh);


            if (data.name === 'Saturn') {
                const ringInnerRadius = data.size * 1.2;
                const ringOuterRadius = data.size * 2.2;
                const ringGeometry = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xd4af37,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                });
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                ringMesh.rotation.x = Math.PI / 2;
                ringMesh.position.x = orbitX;
                orbitGroup.add(ringMesh);
            }


            planets.push({ ...data, mesh, orbit: orbitGroup, angle: 0 });
        });
    });
}

createPlanets(orbitScale);

// Control Panel 
const controlPanel = document.getElementById("controlPanel");

function createSlider(labelText, initialValue, onChange) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0.000";
    input.max = "0.05";
    input.step = "0.001";
    input.value = initialValue;
    input.addEventListener("input", (e) => onChange(parseFloat(e.target.value)));
    controlPanel.appendChild(label);
    controlPanel.appendChild(input);
}
createSlider("Sun Rotation", sunRotationSpeed, v => sunRotationSpeed = v);
basePlanetsData.forEach(p => createSlider(`${p.name} Speed`, p.speed, v => {
    const planet = planets.find(pl => pl.name === p.name);
    if (planet) planet.speed = v;
}));

// Tooltip aur Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById("tooltip");
window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Camera controls
let isPaused = false;
let hoverPaused = false;
let cameraOriginalPos = camera.position.clone();
let cameraTargetPos = null;
let cameraLerpAlpha = 0;
let clickedPlanet = null;
let returning = false;

document.getElementById("pauseBtn").addEventListener("click", () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
});

window.addEventListener("click", () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([sun, ...planets.map(p => p.mesh)]);
    if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const planetPos = new THREE.Vector3();
        mesh.getWorldPosition(planetPos);
        const dir = planetPos.clone().sub(camera.position).normalize();
        cameraTargetPos = planetPos.clone().addScaledVector(dir, -2.5);
        clickedPlanet = mesh;
        cameraLerpAlpha = 0;
        returning = false;
        isPaused = true;

        setTimeout(() => {
            cameraTargetPos = cameraOriginalPos.clone();
            returning = true;
            cameraLerpAlpha = 0;
            isPaused = false;
        }, 4000);
    }
});

// Animate
function animate() {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([sun, ...planets.map(p => p.mesh)]);
    if (intersects.length > 0) {
        hoverPaused = true;
        const hit = intersects[0].object;
        const name = hit.name || "Sun";
        const worldPos = new THREE.Vector3();
        hit.getWorldPosition(worldPos);
        worldPos.project(camera);

        const x = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (1 - (worldPos.y * 0.5 + 0.5)) * window.innerHeight;

        const details = planetDetails[name];
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 90}px`;
        tooltip.style.display = "block";
        tooltip.innerHTML = `
      <strong>${name}</strong><br/>
      Diameter: ${details.diameter}<br/>
      Distance: ${details.distance}<br/>
      Orbital Speed: ${details.speed}<br/>
      Rotation: ${details.rotation}<br/>
      Temperature: ${details.temp}<br/>
      Moons: ${details.moons}<br/>
      <i>${details.desc}</i>
    `;
    } else {
        hoverPaused = false;
        tooltip.style.display = "none";
    }

    if (!isPaused && !hoverPaused) {
        sun.rotation.y += sunRotationSpeed;
        planets.forEach(p => {
            p.angle += p.speed;
            p.orbit.rotation.y = p.angle;
            p.mesh.rotation.y += 0.01;
        });
    }

    if (cameraTargetPos) {
        cameraLerpAlpha += 0.02;
        if (cameraLerpAlpha > 1) cameraLerpAlpha = 1;
        camera.position.lerp(cameraTargetPos, cameraLerpAlpha);

        if (clickedPlanet && !returning) {
            const lookAt = new THREE.Vector3();
            clickedPlanet.getWorldPosition(lookAt);
            camera.lookAt(lookAt);
        } else {
            camera.lookAt(0, 0, 7);
        }

        if (cameraLerpAlpha >= 1 && returning) {
            cameraTargetPos = null;
            clickedPlanet = null;
        }
    }

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener("resize", () => {
    adjustCameraForScreen();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// UI buttons
document.getElementById("togglePanelBtn").addEventListener("click", () => {
    controlPanel.classList.toggle("hidden");
    controlPanel.classList.toggle("show");
});
document.getElementById("themeToggle").addEventListener("click", () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
});

// Hamburger menu
hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

// Close panel
if (closePanelBtn) {
    closePanelBtn.addEventListener("click", () => {
        controlPanel.classList.remove("show");
        controlPanel.classList.add("hidden");
    })

}




