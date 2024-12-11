import {
  OrbitControls,
  Scroll,
  ScrollControls,
  useTexture,
  Stars,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import Cosmonaut from "./3d-Models/Cosmonaut.jsx";
import Asteroids from "./3d-Models/Asteroids.jsx";
import Spaceship from "./3d-Models/Spaceship.jsx";
import Astronaut from "./3d-Models/Astronaut.jsx";

const degToRad = (degrees) => degrees * (Math.PI / 180);

const InfoPanel = ({ info, position }) => {
  if (!info) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "300px",
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255,255,255,0.1)",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <h2>{info.name}</h2>
      <p>{info.description}</p>
      <ul>
        {info.facts.map((fact, index) => (
          <li key={index}>{fact}</li>
        ))}
      </ul>
    </div>
  );
};

const Sun = ({ onPlanetClick }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const sunTexture = useTexture({
    map: "/textures/sun_map.jpg",
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        const { clientX, clientY } = e.nativeEvent;
        onPlanetClick(PLANET_INFO.sun, [clientX, clientY]);
      }}
      onPointerOver={(e) => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = "auto";
      }}
    >
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial {...sunTexture} emissive="#FDB813" />
      <meshStandardMaterial
        {...sunTexture}
        emissive="#FDB813"
        emissiveIntensity={2}
        emissiveMap={sunTexture.map}
        color="#FDB813"
      />
    </mesh>
  );
};

const ORBITAL_SPEEDS = {
  mercury: 0.004,
  venus: 0.0035,
  earth: 0.003,
  mars: 0.0024,
  jupiter: 0.0013,
  saturn: 0.000969,
  uranus: 0.000681,
  neptune: 0.000543,
};

const ORBITAL_COLORS = {
  mercury: "#A0522D",
  venus: "#DEB887",
  earth: "#4169E1",
  mars: "#CD5C5C",
  jupiter: "#DAA520",
  saturn: "#F4A460",
  uranus: "#87CEEB",
  neptune: "#1E90FF",
};

const RotatingPlanet = ({
  position,
  size,
  texture,
  rotationSpeed = 0.02,
  children,
  planetInfo,
  onPlanetClick,
  orbitalSpeed,
  orbitalRadius,
}) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }

    // Update orbital position
    setAngle((prev) => prev + orbitalSpeed);
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * orbitalRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitalRadius;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            const { clientX, clientY } = e.nativeEvent;
            onPlanetClick(planetInfo, [clientX, clientY]);
          }}
          onPointerOver={(e) => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial {...texture} metalness={0.2} roughness={0.8} />
          {children}
        </mesh>
      </group>
    </group>
  );
};

const PLANET_INFO = {
  sun: {
    name: "The Sun",
    description: "The star at the center of our Solar System",
    facts: [
      "Surface Temperature: 5,500°C",
      "Age: 4.6 billion years",
      "Type: Yellow Dwarf Star",
      "Mass: 333,000 x Earth",
    ],
  },
  mercury: {
    name: "Mercury",
    description: "The smallest and innermost planet in the Solar System",
    facts: [
      "Distance from Sun: 57.9 million km",
      "Surface Temperature: -180°C to 430°C",
      "Day length: 176 Earth days",
    ],
  },
  venus: {
    name: "Venus",
    description:
      "The second planet from the Sun and Earth's closest planetary neighbor",
    facts: [
      "Surface Temperature: 462°C",
      "Similar in size to Earth",
      "Rotates backwards compared to most planets",
    ],
  },
  earth: {
    name: "Earth",
    description: "Our home planet and the only known planet with life",
    facts: [
      "Average Temperature: 15°C",
      "Only planet with liquid water on surface",
      "Has one natural satellite: the Moon",
    ],
  },
  mars: {
    name: "Mars",
    description: "The fourth planet from the Sun, known as the Red Planet",
    facts: [
      "Surface Temperature: -63°C",
      "Has the largest volcano in the solar system",
      "Two small moons: Phobos and Deimos",
    ],
  },
  jupiter: {
    name: "Jupiter",
    description: "The largest planet in our Solar System",
    facts: [
      "Great Red Spot is a giant storm",
      "Has at least 79 moons",
      "Mass is more than twice that of all other planets combined",
    ],
  },
  saturn: {
    name: "Saturn",
    description: "The sixth planet from the Sun, famous for its rings",
    facts: [
      "Rings are made mostly of ice and rock",
      "Has 82 confirmed moons",
      "Would float in a giant bathtub (less dense than water)",
    ],
  },
  uranus: {
    name: "Uranus",
    description: "The seventh planet from the Sun",
    facts: [
      "Rotates on its side",
      "Has 27 known moons",
      "The coldest planetary atmosphere in the Solar System",
    ],
  },
  neptune: {
    name: "Neptune",
    description: "The eighth and most distant planet from the Sun",
    facts: [
      "The windiest planet",
      "Has 14 known moons",
      "Takes 165 Earth years to orbit the Sun",
    ],
  },
};

const Mercury = ({ onPlanetClick }) => {
  const texture = useTexture({
    map: "/textures/mercury_map.jpg",
  });

  return (
    <RotatingPlanet
      size={0.4}
      texture={texture}
      rotationSpeed={0.01}
      planetInfo={PLANET_INFO.mercury}
      onPlanetClick={onPlanetClick}
      orbitalSpeed={ORBITAL_SPEEDS.mercury}
      orbitalRadius={4}
    />
  );
};

const Venus = ({ onPlanetClick }) => {
  const texture = useTexture({
    map: "/textures/venus_map.jpg",
  });

  return (
    <RotatingPlanet
      size={0.9}
      texture={texture}
      rotationSpeed={0.008}
      planetInfo={PLANET_INFO.venus}
      onPlanetClick={onPlanetClick}
      orbitalSpeed={ORBITAL_SPEEDS.venus}
      orbitalRadius={7}
    />
  );
};

const EarthMoonSystem = ({ onPlanetClick }) => {
  const groupRef = useRef();
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);
  const earthTexture = useTexture({
    map: "/textures/earth_daymap.jpg",
  });
  const moonTexture = useTexture({
    map: "/textures/moon_map.jpg",
  });

  useFrame(() => {
    setAngle((prev) => prev + ORBITAL_SPEEDS.earth);
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * 10;
      groupRef.current.position.z = Math.sin(angle) * 10;
    }
  });

  return (
    <group ref={groupRef}>
      <RotatingPlanet
        size={1}
        texture={earthTexture}
        rotationSpeed={0.02}
        planetInfo={PLANET_INFO.earth}
        onPlanetClick={onPlanetClick}
        orbitalSpeed={0}
        orbitalRadius={0}
      >
        <group rotation={[degToRad(5), 0, 0]}>
          <mesh position={[2, 0, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial {...moonTexture} />
          </mesh>
        </group>
      </RotatingPlanet>
    </group>
  );
};

const Mars = ({ onPlanetClick }) => {
  const texture = useTexture({
    map: "/textures/mars_map.jpg",
  });

  return (
    <RotatingPlanet
      size={0.5}
      texture={texture}
      rotationSpeed={0.018}
      planetInfo={PLANET_INFO.mars}
      onPlanetClick={onPlanetClick}
      orbitalSpeed={ORBITAL_SPEEDS.mars}
      orbitalRadius={13}
    />
  );
};

const Jupiter = ({ onPlanetClick }) => {
  const texture = useTexture({
    map: "/textures/jupiter_map.jpg",
  });

  return (
    <RotatingPlanet
      size={2}
      texture={texture}
      rotationSpeed={0.04}
      planetInfo={PLANET_INFO.jupiter}
      onPlanetClick={onPlanetClick}
      orbitalSpeed={ORBITAL_SPEEDS.jupiter}
      orbitalRadius={17}
    />
  );
};

const Saturn = ({ onPlanetClick }) => {
  const texture = useTexture({
    map: "/textures/saturn_map.jpg",
  });

  return (
    <RotatingPlanet
      size={1.8}
      texture={texture}
      rotationSpeed={0.038}
      planetInfo={PLANET_INFO.saturn}
      onPlanetClick={onPlanetClick}
      orbitalSpeed={ORBITAL_SPEEDS.saturn}
      orbitalRadius={22}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 3.5, 32]} />
        <meshStandardMaterial
          map={useTexture("/textures/saturn_rings.jpg")}
          transparent
          opacity={0.8}
        />
      </mesh>
    </RotatingPlanet>
  );
};

const Uranus = ({ onPlanetClick }) => {
  const texture = useTexture({
    map: "/textures/uranus_map.jpg",
  });

  return (
    <RotatingPlanet
      size={1.2}
      texture={texture}
      rotationSpeed={0.03}
      planetInfo={PLANET_INFO.uranus}
      onPlanetClick={onPlanetClick}
      orbitalSpeed={ORBITAL_SPEEDS.uranus}
      orbitalRadius={26}
    />
  );
};

const Neptune = ({ onPlanetClick }) => {
  const texture = useTexture({
    map: "/textures/neptune_map.jpg",
  });

  return (
    <RotatingPlanet
      size={1.2}
      texture={texture}
      rotationSpeed={0.032}
      planetInfo={PLANET_INFO.neptune}
      onPlanetClick={onPlanetClick}
      orbitalSpeed={ORBITAL_SPEEDS.neptune}
      orbitalRadius={30}
    />
  );
};

const OrbitalRing = ({ radius, color }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.02, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={2} />
    </mesh>
  );
};

const App = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [infoPosition, setInfoPosition] = useState([0, 0]);

  const handlePlanetClick = (planetInfo, position) => {
    setSelectedPlanet(planetInfo);
    setInfoPosition(position);
  };

  const handleCanvasClick = () => {
    setSelectedPlanet(null);
  };

  return (
    <div>
      <InfoPanel info={selectedPlanet} position={infoPosition} />
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "black" }}
        onClick={handleCanvasClick}
        camera={{ position: [0, 20, 35], fov: 60 }}
        raycaster={{
          computeOffsets: (e) => ({
            offsetX: e.clientX,
            offsetY: e.clientY,
          }),
        }}
      >
        <color attach="background" args={["#000008"]} />

        {/* Enhanced Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight
          position={[0, 0, 0]}
          intensity={5}
          color="#FDB813"
          distance={100}
          decay={1}
        />
        <directionalLight
          position={[-10, 5, -10]}
          intensity={0.8}
          color="#ffffff"
        />
        <hemisphereLight
          skyColor="#ffffff"
          groundColor="#000000"
          intensity={0.3}
        />

        {/* Environment */}
        <Stars
          count={5000}
          depth={100}
          radius={150}
          factor={6}
          saturation={0}
          fade
        />

        <OrbitControls
          enableRotate
          enableZoom
          enableDamping
          autoRotate
          enablePan={true}
          autoRotateSpeed={0.05}
          maxDistance={55}
          minDistance={-4}
        />

        <ScrollControls pages={1} damping={2}>
          <Scroll html>
            <div style={{ position: "absolute", top: "0", left: "30vw" }}>
              <pre>Explore the Solar System</pre>
            </div>
          </Scroll>

          <Scroll>
            <Text
              fontSize={0.2}
              color="white"
              position={[-5, 2.5, 5.5]}
              rotation={[0, Math.PI / 4, 0]}
              anchorX="right"
            >
              Hi!
            </Text>
            <Text
              fontSize={0.2}
              color="white"
              position={[-5, 2.2, 5.5]}
              rotation={[0, Math.PI / 4, 0]}
              anchorX="right"
            >
              I am Mohan Sai
            </Text>
            <Text
              fontSize={0.2}
              color="white"
              position={[-5, 1.9, 5.5]}
              rotation={[0, Math.PI / 4, 0]}
              anchorX="right"
            >
              I am here to explore Solar System
            </Text>

            <Text
              fontSize={0.15}
              color="white"
              position={[6, 0.5, -7]}
              rotation={[0, Math.PI / 4, 0]}
              anchorX="center"
            >
              Hi!
            </Text>
            <Text
              fontSize={0.15}
              color="white"
              position={[6, 0.2, -7]}
              rotation={[0, Math.PI / 4, 0]}
              anchorX="center"
            >
              I am Mohan&apos;s assistant
            </Text>

            <Astronaut />
            <Cosmonaut />
            <Spaceship />
            <Asteroids />
            <Sun onPlanetClick={handlePlanetClick} />
            <OrbitalRing radius={4} color={ORBITAL_COLORS.mercury} />
            <OrbitalRing radius={7} color={ORBITAL_COLORS.venus} />
            <OrbitalRing radius={10} color={ORBITAL_COLORS.earth} />
            <OrbitalRing radius={13} color={ORBITAL_COLORS.mars} />
            <OrbitalRing radius={17} color={ORBITAL_COLORS.jupiter} />
            <OrbitalRing radius={22} color={ORBITAL_COLORS.saturn} />
            <OrbitalRing radius={26} color={ORBITAL_COLORS.uranus} />
            <OrbitalRing radius={30} color={ORBITAL_COLORS.neptune} />
            <Mercury onPlanetClick={handlePlanetClick} />
            <Venus onPlanetClick={handlePlanetClick} />
            <EarthMoonSystem onPlanetClick={handlePlanetClick} />
            <Mars onPlanetClick={handlePlanetClick} />
            <Jupiter onPlanetClick={handlePlanetClick} />
            <Saturn onPlanetClick={handlePlanetClick} />
            <Uranus onPlanetClick={handlePlanetClick} />
            <Neptune onPlanetClick={handlePlanetClick} />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default App;
