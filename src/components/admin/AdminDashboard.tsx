import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tech_stack");
  const [techData, setTechData] = useState([]);
  const [careerData, setCareerData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [profileData, setProfileData] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState("");
  
  // Example form states
  const [newTech, setNewTech] = useState({ name: "", category: "", url: "" });
  const [newCareer, setNewCareer] = useState({ role: "", company: "", date_range: "", description: "", sort_order: 0 });
  const [newProject, setNewProject] = useState({ title: "", category: "", tools: "", image: "", link: "", sort_order: 0 });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    } else {
      fetchTechData();
      fetchProfileData();
      fetchCareerData();
      fetchProjectsData();
    }
  }, [navigate]);

  const fetchTechData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/techstack");
      const data = await res.json();
      setTechData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfileData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile");
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCareerData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/career");
      const data = await res.json();
      setCareerData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjectsData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      setProjectsData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTech = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/admin/techstack", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newTech),
      });
      if (res.ok) {
        setNewTech({ name: "", category: "", url: "" });
        fetchTechData();
        setSuccessMessage("Tech added successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/admin/career", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newCareer),
      });
      if (res.ok) {
        setNewCareer({ role: "", company: "", date_range: "", description: "", sort_order: 0 });
        fetchCareerData();
        setSuccessMessage("Career item added!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCareer = async (id: number) => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/career/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchCareerData();
        setSuccessMessage("Career item deleted!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/admin/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        setNewProject({ title: "", category: "", tools: "", image: "", link: "", sort_order: 0 });
        fetchProjectsData();
        setSuccessMessage("Project added!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchProjectsData();
        setSuccessMessage("Project deleted!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent, section: string, content: string) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ section, content }),
      });
      if (res.ok) {
        setSuccessMessage("Updated successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
        fetchProfileData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "tech_stack" ? "active" : ""} onClick={() => setActiveTab("tech_stack")}>Tech Stack</li>
          <li className={activeTab === "landing_page" ? "active" : ""} onClick={() => setActiveTab("landing_page")}>Landing Page Text</li>
          <li className={activeTab === "about_me" ? "active" : ""} onClick={() => setActiveTab("about_me")}>About Me Text</li>
          <li className={activeTab === "what_i_do" ? "active" : ""} onClick={() => setActiveTab("what_i_do")}>What I Do Text</li>
          <li className={activeTab === "experience" ? "active" : ""} onClick={() => setActiveTab("experience")}>Experience</li>
          <li className={activeTab === "projects" ? "active" : ""} onClick={() => setActiveTab("projects")}>Projects</li>
          <li className={activeTab === "contact" ? "active" : ""} onClick={() => setActiveTab("contact")}>Contact & Footer</li>
        </ul>
        <button className="admin-btn logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="admin-content">
        {successMessage && <div className="admin-success-toast" style={{ background: 'var(--accentColor)', color: '#000', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{successMessage}</div>}

        {activeTab === "tech_stack" && (
          <div>
            <h1>Manage Tech Stack</h1>
            <div className="admin-card">
              <h3>Add New Technology</h3>
              <form onSubmit={handleAddTech} className="admin-form">
                <input type="text" placeholder="Technology Name (e.g. React)" value={newTech.name} onChange={(e) => setNewTech({...newTech, name: e.target.value})} required />
                <input type="text" placeholder="Category (e.g. Frontend)" value={newTech.category} onChange={(e) => setNewTech({...newTech, category: e.target.value})} required />
                <button type="submit" className="admin-btn">Add</button>
              </form>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {techData.length > 0 ? techData.map((tech: any) => (
                    <tr key={tech.id}>
                      <td>{tech.id}</td>
                      <td>{tech.name}</td>
                      <td>{tech.category}</td>
                      <td>
                        <button className="admin-btn-small">Edit</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4}>No data found. Currently fetching from frontend array.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "landing_page" && (
          <div>
            <h1>Manage Landing Page Text</h1>
            
            <div className="admin-card">
              <h3>Landing Introduction</h3>
              <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px' }}>
                Note: The Landing Page is split into individual words to preserve the 3D staggered animations and cinematic typography.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="admin-input-group">
                  <label>Greeting</label>
                  <input type="text" value={profileData.landing_greeting || ""} onChange={(e) => setProfileData({...profileData, landing_greeting: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "landing_greeting", profileData.landing_greeting)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>First Name</label>
                  <input type="text" value={profileData.landing_name_first || ""} onChange={(e) => setProfileData({...profileData, landing_name_first: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "landing_name_first", profileData.landing_name_first)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Last Name</label>
                  <input type="text" value={profileData.landing_name_last || ""} onChange={(e) => setProfileData({...profileData, landing_name_last: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "landing_name_last", profileData.landing_name_last)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Role Prefix</label>
                  <input type="text" value={profileData.landing_role_prefix || ""} onChange={(e) => setProfileData({...profileData, landing_role_prefix: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "landing_role_prefix", profileData.landing_role_prefix)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Role Line 1</label>
                  <input type="text" value={profileData.landing_role_1 || ""} onChange={(e) => setProfileData({...profileData, landing_role_1: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "landing_role_1", profileData.landing_role_1)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Role Line 2</label>
                  <input type="text" value={profileData.landing_role_2 || ""} onChange={(e) => setProfileData({...profileData, landing_role_2: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "landing_role_2", profileData.landing_role_2)}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about_me" && (
          <div>
            <h1>Manage About Me Text</h1>
            <div className="admin-card">
              <h3>About Me Paragraph</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="admin-input-group">
                  <label>Description</label>
                  <textarea style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(0, 0, 0, 0.2)', color: '#fff', fontSize: '16px', lineHeight: '1.5' }} rows={8} value={profileData.about_text || ""} onChange={(e) => setProfileData({...profileData, about_text: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "about_text", profileData.about_text)}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "what_i_do" && (
          <div>
            <h1>Manage What I Do Text</h1>
            <div className="admin-card">
              <h3>What I Do - Section 1</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="admin-input-group">
                  <label>Title</label>
                  <input type="text" value={profileData.whatido_1_title || ""} onChange={(e) => setProfileData({...profileData, whatido_1_title: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "whatido_1_title", profileData.whatido_1_title)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Subtitle</label>
                  <input type="text" value={profileData.whatido_1_subtitle || ""} onChange={(e) => setProfileData({...profileData, whatido_1_subtitle: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "whatido_1_subtitle", profileData.whatido_1_subtitle)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Description</label>
                  <textarea style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(0, 0, 0, 0.2)', color: '#fff', fontSize: '16px' }} rows={4} value={profileData.whatido_1_desc || ""} onChange={(e) => setProfileData({...profileData, whatido_1_desc: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "whatido_1_desc", profileData.whatido_1_desc)}>Save</button>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h3>What I Do - Section 2</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="admin-input-group">
                  <label>Title</label>
                  <input type="text" value={profileData.whatido_2_title || ""} onChange={(e) => setProfileData({...profileData, whatido_2_title: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "whatido_2_title", profileData.whatido_2_title)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Subtitle</label>
                  <input type="text" value={profileData.whatido_2_subtitle || ""} onChange={(e) => setProfileData({...profileData, whatido_2_subtitle: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "whatido_2_subtitle", profileData.whatido_2_subtitle)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Description</label>
                  <textarea style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(0, 0, 0, 0.2)', color: '#fff', fontSize: '16px' }} rows={4} value={profileData.whatido_2_desc || ""} onChange={(e) => setProfileData({...profileData, whatido_2_desc: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "whatido_2_desc", profileData.whatido_2_desc)}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "experience" && (
          <div>
            <h1>Manage Experience & Education</h1>
            <div className="admin-card">
              <h3>Add New Experience</h3>
              <form onSubmit={handleAddCareer} className="admin-form" style={{ flexWrap: 'wrap' }}>
                <input style={{ width: '48%', flexGrow: 0 }} type="text" placeholder="Role / Degree (e.g. B.Tech IT)" value={newCareer.role} onChange={(e) => setNewCareer({...newCareer, role: e.target.value})} required />
                <input style={{ width: '48%', flexGrow: 0 }} type="text" placeholder="Company / Institution" value={newCareer.company} onChange={(e) => setNewCareer({...newCareer, company: e.target.value})} required />
                <input style={{ width: '48%', flexGrow: 0 }} type="text" placeholder="Date Range (e.g. 2023 - Present)" value={newCareer.date_range} onChange={(e) => setNewCareer({...newCareer, date_range: e.target.value})} required />
                <input style={{ width: '48%', flexGrow: 0 }} type="number" placeholder="Sort Order (e.g. 1)" value={newCareer.sort_order} onChange={(e) => setNewCareer({...newCareer, sort_order: parseInt(e.target.value)})} />
                <textarea style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(0, 0, 0, 0.2)', color: '#fff', fontSize: '16px' }} placeholder="Description" rows={3} value={newCareer.description} onChange={(e) => setNewCareer({...newCareer, description: e.target.value})} required />
                <button type="submit" className="admin-btn">Add Item</button>
              </form>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {careerData.map((item: any) => (
                    <tr key={item.id}>
                      <td>{item.sort_order}</td>
                      <td>{item.role}</td>
                      <td>{item.company}</td>
                      <td>{item.date_range}</td>
                      <td>
                        <button className="admin-btn-small" style={{ borderColor: 'red', color: 'red' }} onClick={() => handleDeleteCareer(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {careerData.length === 0 && (
                    <tr><td colSpan={5}>No career history found. Add some above!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            <h1>Manage Projects</h1>
            <div className="admin-card">
              <h3>Add New Project</h3>
              <form onSubmit={handleAddProject} className="admin-form" style={{ flexWrap: 'wrap' }}>
                <input style={{ width: '48%', flexGrow: 0 }} type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} required />
                <input style={{ width: '48%', flexGrow: 0 }} type="text" placeholder="Category (e.g. College Food Ordering App)" value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})} required />
                <input style={{ width: '48%', flexGrow: 0 }} type="text" placeholder="Tools (e.g. React, Node.js)" value={newProject.tools} onChange={(e) => setNewProject({...newProject, tools: e.target.value})} required />
                <input style={{ width: '48%', flexGrow: 0 }} type="text" placeholder="Image URL (e.g. /images/callhq.png)" value={newProject.image} onChange={(e) => setNewProject({...newProject, image: e.target.value})} required />
                <input style={{ width: '48%', flexGrow: 0 }} type="text" placeholder="Live Link / GitHub Repo" value={newProject.link} onChange={(e) => setNewProject({...newProject, link: e.target.value})} required />
                <input style={{ width: '48%', flexGrow: 0 }} type="number" placeholder="Sort Order" value={newProject.sort_order} onChange={(e) => setNewProject({...newProject, sort_order: parseInt(e.target.value)})} />
                <button type="submit" className="admin-btn" style={{ width: '100%' }}>Add Project</button>
              </form>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsData.map((project: any) => (
                    <tr key={project.id}>
                      <td>{project.sort_order}</td>
                      <td><img src={project.image} alt={project.title} style={{ width: '50px', borderRadius: '5px' }} /></td>
                      <td>{project.title}</td>
                      <td>{project.category}</td>
                      <td>
                        <button className="admin-btn-small" style={{ borderColor: 'red', color: 'red' }} onClick={() => handleDeleteProject(project.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {projectsData.length === 0 && (
                    <tr><td colSpan={5}>No projects found. Add some above!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div>
            <h1>Manage Contact & Footer</h1>
            <div className="admin-card">
              <h3>Contact Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="admin-input-group">
                  <label>LinkedIn URL</label>
                  <input type="text" value={profileData.contact_linkedin_url || ""} onChange={(e) => setProfileData({...profileData, contact_linkedin_url: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "contact_linkedin_url", profileData.contact_linkedin_url)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>LinkedIn Display Text</label>
                  <input type="text" value={profileData.contact_linkedin_text || ""} onChange={(e) => setProfileData({...profileData, contact_linkedin_text: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "contact_linkedin_text", profileData.contact_linkedin_text)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>GitHub URL</label>
                  <input type="text" value={profileData.contact_github_url || ""} onChange={(e) => setProfileData({...profileData, contact_github_url: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "contact_github_url", profileData.contact_github_url)}>Save</button>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h3>Education Info (Contact Section)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="admin-input-group">
                  <label>Education Line 1</label>
                  <input type="text" value={profileData.contact_edu_1 || ""} onChange={(e) => setProfileData({...profileData, contact_edu_1: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "contact_edu_1", profileData.contact_edu_1)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Education Line 2</label>
                  <input type="text" value={profileData.contact_edu_2 || ""} onChange={(e) => setProfileData({...profileData, contact_edu_2: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "contact_edu_2", profileData.contact_edu_2)}>Save</button>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h3>Footer Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="admin-input-group">
                  <label>Designed By Text</label>
                  <input type="text" value={profileData.contact_designed_by || ""} onChange={(e) => setProfileData({...profileData, contact_designed_by: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "contact_designed_by", profileData.contact_designed_by)}>Save</button>
                </div>
                <div className="admin-input-group">
                  <label>Copyright Year</label>
                  <input type="text" value={profileData.contact_year || ""} onChange={(e) => setProfileData({...profileData, contact_year: e.target.value})} />
                  <button className="admin-btn-small" style={{marginTop: '5px'}} onClick={(e) => handleProfileUpdate(e, "contact_year", profileData.contact_year)}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
