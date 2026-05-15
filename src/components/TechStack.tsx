import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
// These are only the models that actually float in 3D (we keep these hardcoded for the 3D balls unless you upload images in the admin panel)
const techData = [
  { url: "/images/react2.webp", name: "React.js" },
  { url: "/images/next2.webp", name: "Next.js" },
  { url: "/images/node2.webp", name: "Node.js" },
  { url: "/images/express.webp", name: "Express.js" },
  { url: "/images/mongo.webp", name: "MongoDB" },
  { url: "/images/mysql.webp", name: "MySQL" },
  { url: "/images/typescript.webp", name: "TypeScript" },
  { url: "/images/javascript.webp", name: "JavaScript" },
];
const textures = techData.map((item) => textureLoader.load(item.url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  materialData: { material: THREE.MeshPhysicalMaterial; name: string };
  isActive: boolean;
  onClick: (name: string) => void;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  materialData,
  isActive,
  onClick,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={materialData.material}
        rotation={[0.3, 1, 1]}
        onClick={(e) => {
          e.stopPropagation();
          onClick(materialData.name);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [techCategories, setTechCategories] = useState<{ category: string, skills: string[] }[]>([]);

  useEffect(() => {
    // Fetch dynamic tech stack from MySQL Backend
    fetch("https://faheel-portfolio.vercel.app/api/techstack")
      .then(res => res.json())
      .then(data => {
        // Transform flat SQL rows into grouped categories
        const groupedData: any = {};
        data.forEach((item: any) => {
          if (!groupedData[item.category]) groupedData[item.category] = [];
          groupedData[item.category].push(item.name);
        });
        
        const formattedArray = Object.keys(groupedData).map(category => ({
          category,
          skills: groupedData[category]
        }));
        setTechCategories(formattedArray);
      })
      .catch(err => console.error("Error fetching tech stack", err));

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const materials = useMemo(() => {
    return textures.map(
      (texture, index) => ({
        material: new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        }),
        name: techData[index].name
      })
    );
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack {activeTech && <span style={{ color: "var(--accentColor)", fontSize: "0.8em", opacity: 0.8 }}> — {activeTech}</span>}</h2>

      <div className={`tech-dropdown ${activeTech ? "open" : ""}`}>
        <div className="dropdown-header">
          <h3>Full Stack Developer Profile</h3>
          <button className="close-btn" onClick={() => setActiveTech(null)}>✖</button>
        </div>
        <div className="dropdown-grid">
          {techCategories.map((group, i) => (
            <div key={i} className="tech-group">
              <h4>{group.category}</h4>
              <div className="tech-tags">
                {group.skills.map((skill, j) => (
                  <span key={j} className={skill === activeTech ? "active-skill tag" : "tag"}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              materialData={materials[Math.floor(Math.random() * materials.length)]}
              isActive={isActive}
              onClick={setActiveTech}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
