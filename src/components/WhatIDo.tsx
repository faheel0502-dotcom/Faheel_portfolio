import { useEffect, useRef, useState } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  const [content, setContent] = useState({
    whatido_1_title: "FULL STACK DEVELOPMENT",
    whatido_1_subtitle: "Building Responsive Web Applications",
    whatido_1_desc: "I specialize in developing robust full-stack applications with real-time features, secure payment gateways, and scalable database architectures.",
    whatido_2_title: "BACKEND & INTEGRATIONS",
    whatido_2_subtitle: "Secure APIs & Payment Systems",
    whatido_2_desc: "Experienced in designing RESTful APIs, managing complex relational databases, and integrating third-party services like Razorpay for seamless user experiences."
  });

  useEffect(() => {
    fetch("https://faheel-portfolio.vercel.app/api/profile")
      .then(res => res.json())
      .then(data => {
        setContent(prev => ({
          ...prev,
          whatido_1_title: data.whatido_1_title || prev.whatido_1_title,
          whatido_1_subtitle: data.whatido_1_subtitle || prev.whatido_1_subtitle,
          whatido_1_desc: data.whatido_1_desc || prev.whatido_1_desc,
          whatido_2_title: data.whatido_2_title || prev.whatido_2_title,
          whatido_2_subtitle: data.whatido_2_subtitle || prev.whatido_2_subtitle,
          whatido_2_desc: data.whatido_2_desc || prev.whatido_2_desc,
        }));
      })
      .catch(err => console.error("Error fetching WhatIDo info", err));

    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>{content.whatido_1_title}</h3>
              <h4>{content.whatido_1_subtitle}</h4>
              <p>
                {content.whatido_1_desc}
              </p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">React.js</div>
                <div className="what-tags">Node.js</div>
                <div className="what-tags">Express.js</div>
                <div className="what-tags">Socket.IO</div>
                <div className="what-tags">Tailwind CSS</div>
                <div className="what-tags">Responsive UI</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>{content.whatido_2_title}</h3>
              <h4>{content.whatido_2_subtitle}</h4>
              <p>
                {content.whatido_2_desc}
              </p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">REST APIs</div>
                <div className="what-tags">MySQL</div>
                <div className="what-tags">Razorpay Integration</div>
                <div className="what-tags">Authentication</div>
                <div className="what-tags">Git &amp; GitHub</div>
                <div className="what-tags">Postman</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
