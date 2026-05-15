import { useEffect, useState } from "react";
import "./styles/About.css";

const About = () => {
  const [aboutText, setAboutText] = useState("I am a motivated 3rd-year B.Tech IT student at BSA Crescent Institute of Science and Technology. I specialize in full stack web development with hands-on experience in React.js, Node.js, and the MEAN stack. I combine technical expertise with leadership skills to craft dynamic web applications. From front-end engineering to database design, I bridge the gap to ensure that concepts are brought to life with flawless execution.");

  useEffect(() => {
    fetch("https://faheel-portfolio.vercel.app/api/profile")
      .then(res => res.json())
      .then(data => {
        if (data.about_text) {
          setAboutText(data.about_text);
        }
      })
      .catch(err => console.error("Error fetching about info", err));
  }, []);

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          {aboutText}
        </p>
      </div>
    </div>
  );
};

export default About;
