"use client";

import { useEffect, useRef, useState, useCallback } from "react"; 
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";
import * as htmlToImage from "html-to-image";
import classNames from "classnames";
import './css/smooothPoster.css';
import CircleModel from './CircleModel';
import { useGLTF } from '@react-three/drei';

gsap.registerPlugin(Draggable, InertiaPlugin);

const gradients = [
  "--gradient-macha", "--gradient-orange-crush", "--gradient-lipstick",
  "--gradient-purple-haze", "--gradient-skyfall", "--gradient-emerald-city", "--gradient-summer-fair"
];

const circleColors = [
  "--color-shockingly-green", "--color-surface-white", "--color-pink",
  "--color-shockingly-pink", "--color-orangey", "--color-lilac",
  "--color-lt-green", "--color-blue"
];

const letterColors = [
  "--grey-dark", "--light", "--green", "--green-dark", "--green-light",
  "--blue", "--purple", "--red", "--orange"
];

const modelList = [
  '/3DObj/arm_chair__furniture.glb',
  '/3DObj/sofa-xanh1.glb',
  '/3DObj/victorian_sofa.glb',
  '/3DObj/wardrobe.glb',
];

modelList.forEach((path) => useGLTF.preload(path));

export default function SmooothPoster() {
  const [currentModel, setCurrentModel] = useState(modelList[0]);

  const posterRef = useRef();
  const logoRef = useRef();
  const circleRef = useRef();
  const stickerRef = useRef();
  const smooothRef = useRef();
  const smooothContainerRef = useRef();
  const controlsRef = useRef();
  const pauseBtnRef = useRef();
  const rerollBtnRef = useRef();
  const screenshotBtnRef = useRef();
  const [paused, setPaused] = useState(false);

  const randomizeVisuals = useCallback(() => {
    if (!posterRef.current || !circleRef.current || !smooothRef.current || !stickerRef.current) return;

    const getCSSVarValue = (varName) =>
      getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Background, circle, letter color
    posterRef.current.style.background = getComputedStyle(posterRef.current)
      .getPropertyValue(getRandomItem(gradients)).trim();
    circleRef.current.style.backgroundColor = getCSSVarValue(getRandomItem(circleColors));
    smooothRef.current.style.color = getCSSVarValue(getRandomItem(letterColors));

    // Model reroll logic (prevent repeat)
    let newModel = currentModel;
    while (newModel === currentModel && modelList.length > 1) {
      newModel = getRandomItem(modelList);
    }
    setCurrentModel(newModel);

    // Flair
    const validFlairs = Array.from({ length: 35 }, (_, i) => i + 1).filter(i => ![5, 9, 24, 27].includes(i));
    const flairNumber = getRandomItem(validFlairs);
    const flairClass = flairNumber === 1 ? "flair" : `flair--${flairNumber}`;
    stickerRef.current.className = classNames("sticker", flairClass);
  }, [currentModel]);

  useEffect(() => {
    const initialRotationOffset = -36.25;
    const letterPos = [0, 15.25, 30.25, 42.25, 54.25, 64.25, 73.5];
    const shapes = gsap.utils.toArray(".letter");
    const wrapRotation = gsap.utils.wrap(-90, 90);
    const progressWrap = gsap.utils.wrap(0, 1);
    const proxy = document.createElement("div");

    let dragDistancePerRotation = gsap.utils.mapRange(0, 2000, 500, 4500)(window.innerWidth);
    let startProgress;

    const spin = gsap.fromTo(shapes, {
      rotationY: (i) => letterPos[i] + initialRotationOffset
    }, {
      rotationY: `-=${360}`,
      modifiers: {
        rotationY: (val) => wrapRotation(parseFloat(val)) + "deg"
      },
      duration: 10,
      ease: "none",
      repeat: -1
    });

    const updateRotation = function () {
      const p = startProgress + (this.startX - this.x) / dragDistancePerRotation;
      spin.progress(progressWrap(p));
    };

    Draggable.create(proxy, {
      trigger: smooothRef.current,
      type: "x",
      inertia: true,
      allowNativeTouchScrolling: true,
      onPress() {
        gsap.killTweensOf(spin);
        spin.timeScale(0);
        startProgress = spin.progress();
      },
      onDrag: updateRotation,
      onThrowUpdate: updateRotation,
      onRelease() {
        gsap.to(spin, { timeScale: 1, duration: 1 });
      },
      onThrowComplete() {
        gsap.to(spin, { timeScale: 1, duration: 1 });
      }
    });

    const adjustRadius = () => {
      const radius = Math.min(window.innerWidth * 0.5, 650, window.innerHeight * 0.43);
      gsap.set(shapes, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        transformOrigin: `50% 50% ${-radius}px`
      });
    };

    adjustRadius();
    window.addEventListener("resize", () => {
      adjustRadius();
      dragDistancePerRotation = gsap.utils.mapRange(0, 2000, 500, 4500)(window.innerWidth);
    });

    randomizeVisuals();

    if (rerollBtnRef.current) {
      rerollBtnRef.current.onclick = randomizeVisuals;
    }

    pauseBtnRef.current.addEventListener("click", () => {
      setPaused((prev) => {
        if (prev) {
          spin.resume();
        } else {
          spin.pause();
        }
        return !prev;
      });
    });

    screenshotBtnRef.current.addEventListener("click", () => {
      pauseBtnRef.current.click();
      const el = posterRef.current;
      controlsRef.current.style.display = "none";
      smooothContainerRef.current.style.display = "none";
      Object.assign(logoRef.current.style, {
        width: "300px",
        maxWidth: "none",
        top: "auto",
        bottom: "7%"
      });
      Object.assign(el.style, {
        width: "1290px",
        height: "2796px"
      });
      Object.assign(stickerRef.current.style, {
        width: "484px",
        height: "484px",
        maxWidth: "none",
        maxHeight: "none"
      });
      Object.assign(circleRef.current.style, {
        width: "968px",
        height: "968px",
        maxWidth: "none",
        maxHeight: "none"
      });

      htmlToImage.toPng(el).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "smoooth_poster.png";
        link.href = dataUrl;
        link.click();
        resetPoster();
        pauseBtnRef.current.click();
      }).catch((error) => {
        console.error("Screenshot failed:", error);
        resetPoster();
        pauseBtnRef.current.click();
      });
    });

    function resetPoster() {
      controlsRef.current.style.display = "";
      smooothContainerRef.current.style.display = "";
      gsap.set([logoRef.current, posterRef.current, stickerRef.current, circleRef.current], { clearProps: "all" });
    }

    return () => {
      window.removeEventListener("resize", adjustRadius);
    };
  }, [randomizeVisuals]);

  return (
    <div id="poster" className="noise" ref={posterRef}>
      <a className="logo" href="https://gsap.com" target="_blank" rel="noopener" ref={logoRef}>
        <svg viewBox="0 0 100 40"><text x="0" y="30" fontSize="30">Logo</text></svg>
      </a>

      <div className="smoooth-container" ref={smooothContainerRef}>
        <div className="smoooth" ref={smooothRef}>
          {"Smoooth".split("").map((char, i) => (
            <div className="letter" key={i} data-letter={char}>{char}</div>
          ))}
        </div>
      </div>

      <div className="sticker flair" ref={stickerRef} />
      <CircleModel modelPath={currentModel} />

      <div className="controls" ref={controlsRef}>
        <button ref={pauseBtnRef} id="pause" className={paused ? "paused" : ""}>
          <span className="label" />
        </button>
        <button ref={screenshotBtnRef} id="screenshot">
          <span className="label" />
        </button>
        <button ref={rerollBtnRef} id="reroll">
          <span className="label">&#x21bb;</span>
        </button>
      </div>
    </div>
  );
}
