import "./Home.css";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import gsap from "gsap";

function Character({ visible }) {
  const group = useRef();
  const { scene } = useGLTF("/models/character.glb");

  // دوران تلقائي خفيف
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive
      object={scene}
      ref={group}
      scale={4}
      position={[0, -1, -3]}
      visible={visible}
    />
  );
}

function Door({ onOpen }) {
  const doorRef = useRef();
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    if (!opened) {
      gsap.to(doorRef.current.rotation, {
        y: -Math.PI / 2,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => onOpen(),
      });
      setOpened(true);
    }
  };

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={doorRef} onClick={handleClick} castShadow>
        <boxGeometry args={[2, 3.5, 0.2]} />
        <meshStandardMaterial color="#7b3f00" />
      </mesh>
    </group>
  );
}

function StoreInterior() {
  return (
    <group position={[0, 0, -2]}>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3e3e3e" />
      </mesh>

      {/* Shelves */}
      <mesh position={[-2, 0, -2]}>
        <boxGeometry args={[0.2, 1.5, 2]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>
      <mesh position={[2, 0, -2]}>
        <boxGeometry args={[0.2, 1.5, 2]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>
    </group>
  );
}

export default function Home() {
  const [doorOpened, setDoorOpened] = useState(false);

  const handleOpen = () => {
    setDoorOpened(true);

    // كلام بعد فتح الباب
    setTimeout(() => {
      const script = "أهلاً بك! أنا مساعدك الذكي، مستعد تبدأ الحكاية؟";
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = "ar-EG";
      utterance.rate = 1;

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel(); // يلغي أي كلام شغال
        window.speechSynthesis.speak(utterance);
      }
    }, 2000);
  };

  return (
    <div className="home-container">
      <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 5]} intensity={1.2} castShadow />

        <Suspense fallback={null}>
          {!doorOpened && <Door onOpen={handleOpen} />}
          {doorOpened && <StoreInterior />}
          {doorOpened && <Character visible={true} />}
        </Suspense>

        {/* <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 2.5}
        /> */}
        <Environment preset="city" />
      </Canvas>

      {!doorOpened && <h1 className="title">🚪 افتح باب الحكاية</h1>}
      {doorOpened && <UIOverlay />}
    </div>
  );
}

function UIOverlay() {
  return (
    <div className="ui-overlay">
      <div className="card" onClick={() => alert("تسجيل حساب")}>
        <div className="card-inner">
          <div className="card-front">🪪 إنشاء حساب</div>
          <div className="card-back">ابدأ الحكاية</div>
        </div>
      </div>
      <div className="card" onClick={() => alert("تسجيل دخول")}>
        <div className="card-inner">
          <div className="card-front">🔐 تسجيل دخول</div>
          <div className="card-back">ادخل الحكاية</div>
        </div>
      </div>
      <div className="card" onClick={() => alert("تحدث مع الشخصية")}>
        <div className="card-inner">
          <div className="card-front">💬 تحدث معنا</div>
          <div className="card-back">ابدأ الدردشة</div>
        </div>
      </div>
    </div>
  );
}
