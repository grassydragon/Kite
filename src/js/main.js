import * as THREE from "../../node_modules/three/build/three.module.js"
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import { GamepadInput } from "./gamepad-input.js"
import { KiteParameters } from "./kite/kite-parameters.js";
import { KiteSimulation } from "./kite/kite-simulation.js";
import { State } from "./state.js";
import { Mode, ModeNames } from "./mode.js"
import { Wind, WindNames } from "./wind.js"
import { Lines, LinesNames } from "./lines.js"
import { Tips } from "./tips.js"
import { LESSONS } from "./lessons.js"
import { Persistence } from "./persistence.js";

const HEIGHT = 1.5;

const N = 8;

let canvas;

let mainContainer;

let buttonsGrid;

let menuButton;
let restartButton;
let pauseButton;
let resumeButton;

let parametersGrid;

let windName;
let linesName;

let modeGrid;

let modeName;
let lessonName;

let directions;

let menuContainer;

let closeButton;

let menuButtonsGrid;

let freeFlightMenuButton;
let learningMenuButton;
let gamepadMenuButton;
let progressMenuButton;

let freeFlightMenuGrid;

let lightWindInput;
let moderateWindInput;
let strongWindInput;

let shortLinesInput;
let mediumLinesInput;
let longLinesInput;

let flyButton;

let learningMenuGrid;

let lessonsButtons = [];

let gamepadMenuGrid;

let leftStickYIndex;
let leftStickYDirection;

let setupLeftStickYButton;

let rightStickYIndex;
let rightStickYDirection;

let setupRightStickYButton;

let backButtonIndex;

let setupBackButtonButton;

let startButtonIndex;

let setupStartButtonButton;

let cancelButton;

let progressMenuGrid;

let unlockLessonsButton;
let resetProgressButton;

let renderer;

let scene;

let camera;

let cameraForward = new THREE.Vector3();
let cameraUp = new THREE.Vector3();

let skyTexture;
let grassTexture;
let arrowTexture;
let shadowTexture;

let arrow;

let shadow;

let kite;

let leftLineStart;
let leftLineEnd;

let rightLineStart;
let rightLineEnd;

let areaVertexShaderSource;
let areaFragmentShaderSource;
let area;

let clock = new THREE.Clock();

let state = State.TAKEOFF;

let previousState;

let gamepadInput;

let kiteParameters;

let kiteSimulation;

let start = 0;

let startButtonReleased;

let mode = Mode.FREE_FLIGHT;

let wind = Wind.MODERATE;

let lines = Lines.SHORT;

let lesson;
let lessonIndex;

let objective;
let objectiveIndex;

let progress = Persistence.progress;

THREE.DefaultLoadingManager.onLoad = onLoad;

THREE.DefaultLoadingManager.onError = onError;

load();

function load() {
    loadCubeTextures();
    loadTextures();
    loadModels();
    loadShaders();
}

function loadCubeTextures() {
    let loader = new THREE.CubeTextureLoader();

    loader.path = "res/img/sky/";

    loader.load(
        [
            "right.png", "left.png",
            "up.png", "down.png",
            "back.png", "front.png"
        ],
        (texture) => {
            configureTexture(texture, false);

            skyTexture = texture;
        }
    );
}

function loadTextures() {
    let loader = new THREE.TextureLoader();

    loader.path = "res/img/";

    loader.load(
        "grass.png",
        (texture) => {
            configureTexture(texture, false);

            grassTexture = texture;
        }
    );

    loader.load(
        "arrow.png",
        (texture) => {
            configureTexture(texture, true);

            arrowTexture = texture;
        }
    );

    loader.load(
        "shadow.png",
        (texture) => {
            configureTexture(texture, true);

            shadowTexture = texture;
        }
    );
}

function loadModels() {
    let loader = new GLTFLoader();

    loader.path = "res/gltf/";

    loader.load(
        "kite.glb",
        (gltf) => {
            kite = gltf.scene.getObjectByName("Kite");
        }
    );

    loader.load(
        "line.glb",
        (gltf) => {
            let line = gltf.scene.getObjectByName("Line");

            leftLineStart = line;
            leftLineEnd = line.clone();

            rightLineStart = line.clone();
            rightLineEnd = line.clone();
        }
    );
}

function loadShaders() {
    let loader = new THREE.FileLoader();

    loader.path = "src/glsl/";

    loader.load(
        "area-vs.glsl",
        (source) => {
            areaVertexShaderSource = source;
        }
    );

    loader.load(
        "area-fs.glsl",
        (source) => {
            areaFragmentShaderSource = source;
        }
    );
}

function onLoad() {
    initialize();

    requestAnimationFrame(animate);
}

function onError(url) {
    console.error(`The file ${url} can't be loaded`);
}

function configureTexture(texture, alpha) {
    texture.encoding = THREE.sRGBEncoding;

    if (alpha) texture.format = THREE.RGBAFormat;
    else texture.format = THREE.RGBFormat;
}

function initialize() {
    initializeElements();

    initializeLearningMenu();

    initializeRenderer();

    initializeCamera();

    initializeScene();

    gamepadInput = new GamepadInput();

    gamepadInput.onSetupCompleted = () => {
        updateGamepadOutput();
        resetGamepadMenuButtons();
    };

    kiteParameters = new KiteParameters();

    kiteParameters.initialize(wind, lines);

    kiteSimulation = new KiteSimulation(kite, leftLineStart, leftLineEnd, rightLineStart, rightLineEnd, gamepadInput, kiteParameters, HEIGHT);

    updateParametersOutput();

    updateModeOutput();
}

function initializeElements() {
    canvas = document.getElementById("canvas");

    mainContainer = document.getElementById("main-container");

    buttonsGrid = document.getElementById("buttons-grid");

    menuButton = document.getElementById("menu-button");
    menuButton.addEventListener("click", openMenu);

    restartButton = document.getElementById("restart-button");
    restartButton.addEventListener("click", restart);

    pauseButton = document.getElementById("pause-button");
    pauseButton.addEventListener("click", pause);
    pauseButton.disabled = true;

    resumeButton = document.getElementById("resume-button");
    resumeButton.addEventListener("click", resume);
    resumeButton.disabled = true;

    directions = document.getElementById("directions");
    directions.innerText = Tips.TAKEOFF;

    parametersGrid = document.getElementById("parameters-grid");

    windName = document.getElementById("wind-name");
    linesName = document.getElementById("lines-name");

    modeGrid = document.getElementById("mode-grid");

    modeName = document.getElementById("mode-name");
    lessonName = document.getElementById("lesson-name");

    menuContainer = document.getElementById("menu-container");

    closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", closeMenu);

    menuButtonsGrid = document.getElementById("menu-buttons-grid");

    freeFlightMenuButton = document.getElementById("free-flight-menu-button");
    freeFlightMenuButton.addEventListener("click", openFreeFlightMenu);

    learningMenuButton = document.getElementById("learning-menu-button");
    learningMenuButton.addEventListener("click", openLearningMenu);

    gamepadMenuButton = document.getElementById("gamepad-menu-button");
    gamepadMenuButton.addEventListener("click", openGamepadMenu);

    progressMenuButton = document.getElementById("progress-menu-button");
    progressMenuButton.addEventListener("click", openProgressMenu);

    freeFlightMenuGrid = document.getElementById("free-flight-menu-grid");

    lightWindInput = document.getElementById("light-wind-input");
    moderateWindInput = document.getElementById("moderate-wind-input");
    strongWindInput = document.getElementById("strong-wind-input");

    shortLinesInput = document.getElementById("short-lines-input");
    mediumLinesInput = document.getElementById("medium-lines-input");
    longLinesInput = document.getElementById("long-lines-input");

    flyButton = document.getElementById("fly-button");
    flyButton.addEventListener(
        "click",
        () => {
            closeMenu();
            startFreeFlight();
        }
    );

    learningMenuGrid = document.getElementById("learning-menu-grid");

    gamepadMenuGrid = document.getElementById("gamepad-menu-grid");

    leftStickYIndex = document.getElementById("left-stick-y-index");
    leftStickYDirection = document.getElementById("left-stick-y-direction");

    setupLeftStickYButton = document.getElementById("setup-left-stick-y-button");
    setupLeftStickYButton.addEventListener("click", setupLeftStickY);

    rightStickYIndex = document.getElementById("right-stick-y-index");
    rightStickYDirection = document.getElementById("right-stick-y-direction");

    setupRightStickYButton = document.getElementById("setup-right-stick-y-button");
    setupRightStickYButton.addEventListener("click", setupRightStickY);

    backButtonIndex = document.getElementById("back-button-index");

    setupBackButtonButton = document.getElementById("setup-back-button-button");
    setupBackButtonButton.addEventListener("click", setupBackButton);

    startButtonIndex = document.getElementById("start-button-index");

    setupStartButtonButton = document.getElementById("setup-start-button-button");
    setupStartButtonButton.addEventListener("click", setupStartButton);

    cancelButton = document.getElementById("cancel-button");
    cancelButton.addEventListener("click", cancelSetup);
    cancelButton.disabled = true;

    progressMenuGrid = document.getElementById("progress-menu-grid");

    unlockLessonsButton = document.getElementById("unlock-lessons-button");
    unlockLessonsButton.addEventListener("click", unlockLessons);

    resetProgressButton = document.getElementById("reset-progress-button");
    resetProgressButton.addEventListener("click", resetProgress);
}

function initializeLearningMenu() {
    for (let i = 0; i < LESSONS.length; i++) {
        let button = document.createElement("button");

        button.type = "button";
        button.className = "button";

        button.addEventListener(
            "click",
            () => {
                closeMenu();
                startLesson(i);
            }
        );

        button.append(LESSONS[i].name);

        learningMenuGrid.append(button);

        lessonsButtons.push(button);
    }
}

function initializeRenderer() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}

function initializeCamera() {
    camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 200);

    camera.position.y = 2;
}

function initializeScene() {
    scene = new THREE.Scene();

    scene.background = skyTexture;

    //The ambient light

    let ambientLight = new THREE.AmbientLight("#ffffff", 0.2);

    scene.add(ambientLight);

    //The directional light

    let directionalLight = new THREE.DirectionalLight("#ffffff", 0.8);

    scene.add(directionalLight);

    //The ground

    let groundGeometry = new THREE.CircleBufferGeometry(200, 16);
    let groundMaterial = new THREE.MeshLambertMaterial({ map: grassTexture });
    let ground = new THREE.Mesh(groundGeometry, groundMaterial);

    ground.rotation.x = -Math.PI / 2;

    scene.add(ground);

    //The wind arrow

    let arrowGeometry = new THREE.PlaneBufferGeometry(0.1, 0.1);
    let arrowMaterial = new THREE.MeshBasicMaterial({
        map: arrowTexture,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);

    arrow.rotation.x = -Math.PI / 2;

    scene.add(arrow);

    //The kite shadow

    let shadowGeometry = new THREE.PlaneBufferGeometry(1, 1);
    let shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true
    });
    shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);

    shadow.position.y = 0.01;

    shadow.rotation.x = -Math.PI / 2;

    scene.add(shadow);

    //The kite and the kite lines

    scene.add(kite);

    scene.add(leftLineStart);
    scene.add(leftLineEnd);

    scene.add(rightLineStart);
    scene.add(rightLineEnd);

    //The highlighted area

    let areaVertices = new Float32Array(N * N * 3);

    let areaDistances = new Float32Array(N * N * 2);

    let areaIndices = [];

    for (let i = 0; i < N - 1; i++) {
        for (let j = 0; j < N - 1; j++) {
            let a = i * N + j;
            let b = i * N + j + 1;
            let c = (i + 1) * N + j;
            let d = (i + 1) * N + j + 1;

            areaIndices.push(a, c, b);
            areaIndices.push(b, c, d);
        }
    }

    let areaPositionAttribute = new THREE.BufferAttribute(areaVertices, 3);

    areaPositionAttribute.usage = THREE.DynamicDrawUsage;

    let areaDistanceAttribute = new THREE.BufferAttribute(areaDistances, 2);

    areaDistanceAttribute.usage = THREE.DynamicDrawUsage;

    let areaGeometry = new THREE.BufferGeometry();

    areaGeometry.setAttribute("position", areaPositionAttribute);
    areaGeometry.setAttribute("distance", areaDistanceAttribute);

    areaGeometry.setIndex(areaIndices);

    let areaMaterial = new THREE.RawShaderMaterial({
        vertexShader: areaVertexShaderSource,
        fragmentShader: areaFragmentShaderSource,
        uniforms: {
            color: { value: new THREE.Color("#ffff00").convertSRGBToLinear() },
            opacity: { value: 0.2 },
            edge: { value: 2 }
        },
        transparent: true
    });

    area = new THREE.Mesh(areaGeometry, areaMaterial);

    area.visible = false;

    scene.add(area);
}

function lessonCompleted() {
    return objectiveIndex === lesson.objectives.length;
}

function lastLesson() {
    return lessonIndex === LESSONS.length - 1;
}

function animate() {
    resize();

    let time = clock.getDelta();

    gamepadInput.update();

    if (state === State.TAKEOFF) {
        let leftStickY = gamepadInput.leftStickY;
        let rightStickY = gamepadInput.rightStickY;

        if (leftStickY < 0.1 && rightStickY < 0.1) {
            start = clock.elapsedTime;
        }
        else if (leftStickY >= 0.9 && rightStickY >= 0.9) {
            if (clock.elapsedTime - start <= 0.5) resume();
        }
    }
    else if (state === State.FLIGHT_PAUSED) {
        if (!gamepadInput.startButtonPressed) startButtonReleased = true;

        if (gamepadInput.backButtonPressed) {
            restart();
        }
        else if (startButtonReleased && gamepadInput.startButtonPressed) {
            startButtonReleased = false;

            resume();
        }
    }
    else if (state === State.FLIGHT_RESUMED) {
        if (!gamepadInput.startButtonPressed) startButtonReleased = true;

        if (gamepadInput.backButtonPressed) {
            restart();
        }
        else if (startButtonReleased && gamepadInput.startButtonPressed) {
            startButtonReleased = false;

            if (mode === Mode.LEARNING && lessonCompleted() && !lastLesson()) {
                startLesson(lessonIndex + 1);
            }
            else {
                pause();
            }
        }
        else {
            kiteSimulation.update(time);

            if (mode === Mode.LEARNING && !lessonCompleted()) {
                if ((!kiteSimulation.collidesWithGround && !objective.landing
                    || kiteSimulation.collidesWithGround && !kiteSimulation.crashed && objective.landing)
                    && objective.checkWindWindowPosition(kiteSimulation.h, kiteSimulation.v, kiteSimulation.t, kiteSimulation.turns)) {
                    objectiveIndex++;

                    if (!lessonCompleted()) {
                        objective = lesson.objectives[objectiveIndex];

                        directions.innerText = objective.text;
                    }
                    else {
                        if (!lastLesson()) {
                            if (lessonIndex === progress) {
                                progress++;
                                Persistence.progress = progress;
                            }

                            directions.innerText = Tips.CONTINUE;
                        }
                        else {
                            directions.innerText = Tips.ALL_LESSONS_COMPLETED;
                        }
                    }

                    updateArea();
                }
            }

            if (kiteSimulation.collidesWithGround) {
                state = State.LANDED;

                pauseButton.disabled = true;
                resumeButton.disabled = true;

                if (mode === Mode.FREE_FLIGHT || (mode === Mode.LEARNING && !lessonCompleted())) {
                    if (kiteSimulation.crashed) directions.innerText = Tips.RESTART_CRASHED;
                    else directions.innerText = Tips.RESTART_LANDED;
                }
            }
        }
    }
    else if (state === State.LANDED) {
        if (gamepadInput.backButtonPressed) {
            restart();
        }
        else if (gamepadInput.startButtonPressed) {
            if (mode === Mode.LEARNING && lessonCompleted() && !lastLesson()) {
                startLesson(lessonIndex + 1);
            }
        }
    }

    shadow.position.x = kite.position.x;
    shadow.position.z = kite.position.z;

    camera.lookAt(kite.position);

    camera.getWorldDirection(cameraForward);

    cameraUp.set(0, 1, 0);
    cameraUp.applyQuaternion(camera.quaternion);

    arrow.position.set(0, 2, 0);
    arrow.position.addScaledVector(cameraForward, 1);
    arrow.position.addScaledVector(cameraUp, -0.3);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

function resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);

        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
}

function restart() {
    state = State.TAKEOFF;

    if (mode === Mode.LEARNING) {
        objective = lesson.objectives[0];
        objectiveIndex = 0;
    }

    kiteSimulation.restart();

    pauseButton.disabled = true;
    resumeButton.disabled = true;

    directions.innerText = Tips.TAKEOFF;

    updateArea();
}

function pause() {
    state = State.FLIGHT_PAUSED;

    pauseButton.disabled = true;
    resumeButton.disabled = false;

    directions.innerText = Tips.RESTART_OR_RESUME;
}

function resume() {
    state = State.FLIGHT_RESUMED;

    pauseButton.disabled = false;
    resumeButton.disabled = true;

    if (mode === Mode.FREE_FLIGHT) {
        directions.innerText = Tips.RESTART_OR_PAUSE;
    }
    else if (mode === Mode.LEARNING) {
        if (!lessonCompleted()) directions.innerText = objective.text;
        else {
            if (!lastLesson()) directions.innerText = Tips.CONTINUE;
            else directions.innerText = Tips.ALL_LESSONS_COMPLETED;
        }
    }
}

function updateArea() {
    if (mode === Mode.LEARNING && !lessonCompleted() && objective.hAvailable && objective.vAvailable) {
        let areaPositionAttribute = area.geometry.getAttribute("position");
        let areaDistanceAttribute = area.geometry.getAttribute("distance");

        let areaVertices = areaPositionAttribute.array;
        let areaDistances = areaDistanceAttribute.array;

        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                let index = i * N + j;

                let h = THREE.MathUtils.lerp(objective.minH, objective.maxH, j / (N - 1));
                let v = THREE.MathUtils.lerp(objective.maxV, objective.minV, i / (N - 1));

                areaDistances[index * 2] = (objective.maxH - objective.minH) / 2 - Math.abs(h - (objective.maxH + objective.minH) / 2);
                areaDistances[index * 2 + 1] = (objective.maxV - objective.minV) / 2 - Math.abs(v - (objective.maxV + objective.minV) / 2);

                h = THREE.MathUtils.degToRad(h);
                v = THREE.MathUtils.degToRad(v);

                let l = lines + 1;
                let p = l * Math.cos(v);

                let y = l * Math.sin(v) + HEIGHT;
                let x = p * Math.sin(h);
                let z = -p * Math.cos(h);

                areaVertices[index * 3] = x;
                areaVertices[index * 3 + 1] = y;
                areaVertices[index * 3 + 2] = z;
            }
        }

        areaPositionAttribute.needsUpdate = true;

        areaDistanceAttribute.needsUpdate = true;

        area.geometry.computeBoundingSphere();

        area.visible = true;
    }
    else {
        area.visible = false;
    }
}

function updateParametersOutput() {
    windName.innerText = WindNames.get(wind);
    linesName.innerText = LinesNames.get(lines);
}

function updateModeOutput() {
    modeName.innerText = ModeNames.get(mode);

    if (mode === Mode.FREE_FLIGHT) lessonName.innerText = "N/A";
    else if (mode === Mode.LEARNING) lessonName.innerText = lesson.name;
}

function updateGamepadOutput() {
    leftStickYIndex.innerText = gamepadInput.leftStickYIndex;

    if (gamepadInput.leftStickYDirection === 1) leftStickYDirection.innerText = "Normal";
    else leftStickYDirection.innerText = "Reverse";

    rightStickYIndex.innerText = gamepadInput.rightStickYIndex;

    if (gamepadInput.rightStickYDirection === 1) rightStickYDirection.innerText = "Normal";
    else rightStickYDirection.innerText = "Reverse";

    backButtonIndex.innerText = gamepadInput.backButtonIndex;

    startButtonIndex.innerText = gamepadInput.startButtonIndex;
}

function openMenu() {
    previousState = state;

    hideBlockElement(mainContainer);

    showBlockElement(menuContainer);

    openFreeFlightMenu();
}

function closeMenu() {
    if (previousState === State.FLIGHT_RESUMED) pause();
    else state = previousState;

    showBlockElement(mainContainer);

    hideBlockElement(menuContainer);

    cancelSetup();
}

function openFreeFlightMenu() {
    state = State.MENU_FREE_FLIGHT;

    freeFlightMenuButton.disabled = true;
    learningMenuButton.disabled = false;
    gamepadMenuButton.disabled = false;
    progressMenuButton.disabled = false;

    showGridElement(freeFlightMenuGrid);
    hideGridElement(learningMenuGrid);
    hideGridElement(gamepadMenuGrid);
    hideGridElement(progressMenuGrid);

    cancelSetup();

    if (wind === Wind.LIGHT) lightWindInput.checked = true;
    else if (wind === Wind.MODERATE) moderateWindInput.checked = true;
    else if (wind === Wind.STRONG) strongWindInput.checked = true;

    if (lines === Lines.SHORT) shortLinesInput.checked = true;
    else if (lines === Lines.MEDIUM) mediumLinesInput.checked = true;
    else if (lines === Lines.LONG) longLinesInput.checked = true;
}

function openLearningMenu() {
    state = State.MENU_LEARNING;

    freeFlightMenuButton.disabled = false;
    learningMenuButton.disabled = true;
    gamepadMenuButton.disabled = false;
    progressMenuButton.disabled = false;

    hideGridElement(freeFlightMenuGrid);
    showGridElement(learningMenuGrid);
    hideGridElement(gamepadMenuGrid);
    hideGridElement(progressMenuGrid);

    cancelSetup();

    for (let i = 0; i < LESSONS.length; i++) {
        lessonsButtons[i].disabled = i > progress;
    }
}

function openGamepadMenu() {
    state = State.MENU_GAMEPAD;

    freeFlightMenuButton.disabled = false;
    learningMenuButton.disabled = false;
    gamepadMenuButton.disabled = true;
    progressMenuButton.disabled = false;

    hideGridElement(freeFlightMenuGrid);
    hideGridElement(learningMenuGrid);
    showGridElement(gamepadMenuGrid);
    hideGridElement(progressMenuGrid);

    updateGamepadOutput();
}

function openProgressMenu() {
    state = State.MENU_PROGRESS;

    freeFlightMenuButton.disabled = false;
    learningMenuButton.disabled = false;
    gamepadMenuButton.disabled = false;
    progressMenuButton.disabled = true;

    hideGridElement(freeFlightMenuGrid);
    hideGridElement(learningMenuGrid);
    hideGridElement(gamepadMenuGrid);
    showGridElement(progressMenuGrid);

    cancelSetup();

    unlockLessonsButton.disabled = progress === LESSONS.length - 1;
    resetProgressButton.disabled = progress === 0;
}

function hideBlockElement(element) {
    element.style.display = "none";
}

function showBlockElement(element) {
    element.style.display = "block";
}

function hideGridElement(element) {
    element.style.display = "none";
}

function showGridElement(element) {
    element.style.display = "grid";
}

function resetGamepadMenuButtons() {
    setupLeftStickYButton.disabled = false;
    setupRightStickYButton.disabled = false;
    setupBackButtonButton.disabled = false;
    setupStartButtonButton.disabled = false;
    cancelButton.disabled = true;
}

function startFreeFlight() {
    mode = Mode.FREE_FLIGHT;

    if (lightWindInput.checked) wind = Wind.LIGHT;
    else if (moderateWindInput.checked) wind = Wind.MODERATE;
    else if (strongWindInput.checked) wind = Wind.STRONG;

    if (shortLinesInput.checked) lines = Lines.SHORT;
    else if (mediumLinesInput.checked) lines = Lines.MEDIUM;
    else if (longLinesInput.checked) lines = Lines.LONG;

    updateParametersOutput();
    updateModeOutput();

    kiteParameters.initialize(wind, lines);

    restart();
}

function startLesson(index) {
    mode = Mode.LEARNING;

    lesson = LESSONS[index];
    lessonIndex = index;

    objective = lesson.objectives[0];
    objectiveIndex = 0;

    wind = Wind.MODERATE;
    lines = Lines.SHORT;

    updateParametersOutput();
    updateModeOutput();

    kiteParameters.initialize(wind, lines);

    restart();
}

function setupLeftStickY() {
    setupLeftStickYButton.disabled = true;
    cancelButton.disabled = false;

    gamepadInput.setupLeftStickY();
}

function setupRightStickY() {
    setupRightStickYButton.disabled = true;
    cancelButton.disabled = false;

    gamepadInput.setupRightStickY();
}

function setupBackButton() {
    setupBackButtonButton.disabled = true;
    cancelButton.disabled = false;

    gamepadInput.setupBackButton();
}

function setupStartButton() {
    setupStartButtonButton.disabled = true;
    cancelButton.disabled = false;

    gamepadInput.setupStartButton();
}

function cancelSetup() {
    resetGamepadMenuButtons();

    gamepadInput.cancelSetup();
}

function unlockLessons() {
    progress = LESSONS.length - 1;
    Persistence.progress = progress;

    unlockLessonsButton.disabled = true;
    resetProgressButton.disabled = false;
}

function resetProgress() {
    progress = 0;
    Persistence.progress = progress;

    unlockLessonsButton.disabled = false;
    resetProgressButton.disabled = true;
}
