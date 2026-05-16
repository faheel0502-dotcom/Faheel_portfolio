import { useEffect, useState } from "react";
import "./styles/Career.css";

interface CareerItem {
  id: number;
  role: string;
  company: string;
  date_range: string;
  description: string;
}

const Career = () => {
  const [careerData, setCareerData] = useState<CareerItem[]>([
    {
      id: 1,
      role: "Full Stack Web Development Intern",
      company: "8 Queens Software Technologies Pvt. Ltd.",
      date_range: "Jun 2025 – Jul 2025",
      description: "Developed and implemented frontend interfaces using HTML, CSS, and JavaScript. Worked with relational databases and performed basic database design and querying."
    },
    {
      id: 2,
      role: "B.Tech Information Technology",
      company: "BSA Crescent Institute of Science and Technology",
      date_range: "Expected 2027",
      description: "Current CGPA: 7.77. Active in technical events: 3rd Place at HACK-ROOT Hackathon, 1st Place at IEEE Paper Presentation, Vice-President of TrailBlazers Coding Club."
    },
    {
      id: 3,
      role: "HSC (12th) & SSLC (10th)",
      company: "Gill Adarsh Matriculation Hr. Sec. School",
      date_range: "2021-2023",
      description: "Completed higher secondary education (81.6%) and secondary education under the Tamil Nadu State Board."
    }
  ]);

  useEffect(() => {
    fetch("/api/career")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCareerData(data);
        }
      })
      .catch(err => console.error("Error fetching career info", err));
  }, []);

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {careerData.map((item) => (
            <div className="career-info-box" key={item.id}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.company}</h5>
                </div>
                <h3>{item.date_range}</h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
