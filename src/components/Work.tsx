import { useState, useCallback, useEffect } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  tools: string;
  image: string;
  github_link?: string;
  live_link?: string;
}

const Work = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 1,
      title: "Crescent Canteen",
      category: "College Food Ordering App",
      tools: "React.js, Node.js, MySQL",
      image: "/images/callhq.png",
      github_link: "https://github.com/faheel0502-dotcom/Crescent_Canteen",
      live_link: "#",
    },
    {
      id: 2,
      title: "Student Mart",
      category: "Student Marketplace Platform",
      tools: "React.js, Node.js, MySQL",
      image: "/images/whatsapp.png",
      github_link: "#",
      live_link: "#",
    },
    {
      id: 3,
      title: "Intellect Way",
      category: "Smart Traffic Navigation App",
      tools: "HTML, CSS, Node.js, Weather API",
      image: "/images/broki.png",
      github_link: "#",
      live_link: "#",
    },
    {
      id: 4,
      title: "Doted On",
      category: "Figma UI/UX Design",
      tools: "Figma, UI/UX",
      image: "/images/orrdr.png",
      github_link: "#",
      live_link: "#",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch("https://faheel-portfolio.vercel.app/api/projects")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(err => console.error("Error fetching projects info", err));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, projects.length]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, projects.length]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={project.id}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                        <div className="carousel-project-links" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                          {project.github_link && <a href={project.github_link} target="_blank" data-cursor="disable" style={{ display: 'inline-block', padding: '10px 20px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '30px', color: '#fff', textDecoration: 'none', fontSize: '14px', transition: '0.3s' }}>GitHub Repo</a>}
                          {project.live_link && <a href={project.live_link} target="_blank" data-cursor="disable" style={{ display: 'inline-block', padding: '10px 20px', background: '#fff', color: '#000', borderRadius: '30px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', transition: '0.3s' }}>Live Project</a>}
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.live_link || project.github_link}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((project, index) => (
              <button
                key={project.id}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
