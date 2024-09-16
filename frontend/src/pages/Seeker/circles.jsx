import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNodeJs,faJava, faReact, faGithub } from "@fortawesome/free-brands-svg-icons";
import OrbitingCircles from "@/components/magicui/orbiting-circles";

// Font Awesome icons for MERN stack
const IconMongoDB = () => <FontAwesomeIcon icon={faGithub} size="2x" />;
const IconExpress = () => <FontAwesomeIcon icon={faJava} size="2x" />;
const IconReact = () => <FontAwesomeIcon icon={faReact} size="2x" />;
const IconNode = () => <FontAwesomeIcon icon={faNodeJs} size="2x" />;

export default function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col bg-gray-50 items-center justify-center overflow-hidden ">
      

      {/* Inner Circles */}
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <IconMongoDB />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <IconExpress />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        reverse
      >
        <IconReact />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        delay={20}
        reverse
      >
        <IconNode />
      </OrbitingCircles>
    </div>
  );
}
