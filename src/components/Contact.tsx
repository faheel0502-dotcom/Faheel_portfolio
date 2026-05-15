import { useEffect, useState } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  const [profileData, setProfileData] = useState<any>({
    contact_linkedin_url: "https://www.linkedin.com/in/mohammed-faheel-318b6633b/",
    contact_linkedin_text: "LinkedIn — faheelm",
    contact_edu_1: "B.Tech Information Technology, BSA Crescent Institute — Expected 2027",
    contact_edu_2: "HSC, Gill Adarsh Matriculation Hr. Sec. School — 2021–2023",
    contact_github_url: "https://github.com/faheel0502",
    contact_designed_by: "Mohammed Faheel M",
    contact_year: "2026"
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfileData((prev: any) => ({ ...prev, ...data }));
      })
      .catch((err) => console.error("Error fetching contact info", err));
  }, []);

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href={profileData.contact_linkedin_url}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                {profileData.contact_linkedin_text}
              </a>
            </p>
            <h4>Education</h4>
            <p>{profileData.contact_edu_1}</p>
            <p>{profileData.contact_edu_2}</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={profileData.contact_github_url}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href={profileData.contact_linkedin_url}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{profileData.contact_designed_by}</span>
            </h2>
            <h5>
              <MdCopyright /> {profileData.contact_year}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
