import { PropsWithChildren, useEffect, useState } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  const [content, setContent] = useState({
    landing_greeting: "Hello! I'm",
    landing_name_first: "MOHAMMED",
    landing_name_last: "FAHEEL M",
    landing_role_prefix: "B.Tech IT Student &",
    landing_role_1: "Software",
    landing_role_2: "Developer"
  });

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        setContent(prev => ({
          ...prev,
          landing_greeting: data.landing_greeting || prev.landing_greeting,
          landing_name_first: data.landing_name_first || prev.landing_name_first,
          landing_name_last: data.landing_name_last || prev.landing_name_last,
          landing_role_prefix: data.landing_role_prefix || prev.landing_role_prefix,
          landing_role_1: data.landing_role_1 || prev.landing_role_1,
          landing_role_2: data.landing_role_2 || prev.landing_role_2,
        }));
      })
      .catch(err => console.error("Error fetching landing info", err));
  }, []);

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>{content.landing_greeting}</h2>
            <h1>
              {content.landing_name_first}
              <br />
              <span>{content.landing_name_last}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>{content.landing_role_prefix}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{content.landing_role_1}</div>
              <div className="landing-h2-2">{content.landing_role_2}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{content.landing_role_2}</div>
              <div className="landing-h2-info-1">{content.landing_role_1}</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
