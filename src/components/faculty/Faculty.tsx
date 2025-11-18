"use client"
import React, { JSX, useMemo, useState } from "react";

type FacultyMember = {
    id: string;
    name: string;
    title: string;
    department: string;
    bio: string;
    email?: string;
    photoUrl?: string;
};

const SAMPLE_DATA: FacultyMember[] = [
    {
        id: "f1",
        name: "Er Nikhil Raj",
        title: "Civil Engineer",
        department: "Diploma & B-Tech in Civil Engineering",
        bio:
            "3 years of experience teaching in AutoCad, Revit, Staad Pro, Sketchup etc & also workshop.",
        email: "ananya.sharma@nexgentech.edu",
       
        photoUrl:"/company/nikhil-raj.jpg"
    },
    {
        id: "f2",
        name: "Mr. Rohit Sen",
        title: "Senior Lecturer",
        department: "Information Technology",
        bio:
            "Passionate about modern web technologies and developer experience. Runs hands-on workshops on React and TypeScript.",
        email: "rohit.sen@nexgentech.edu",
    },
    {
        id: "f3",
        name: "Ms. Pooja Iyer",
        title: "Assistant Professor",
        department: "Electronics",
        bio:
            "Industry background in embedded systems and IoT. Focus on lab-driven learning and practical projects.",
        
    },
    {
        id: "f4",
        name: "Dr. Sandeep Kulkarni",
        title: "Professor",
        department: "Computer Science",
        bio:
            "Researcher in machine learning with multiple publications. Mentors capstone projects and internships.",
        email: "sandeep.k@nexgentech.edu",
    },
];

export default function Faculty(): JSX.Element {
    const [query, setQuery] = useState("");
    const [department, setDepartment] = useState("All");
    const [sortBy, setSortBy] = useState<"name" | "dept">("name");
    const [selected, setSelected] = useState<FacultyMember | null>(null);

    const departments = useMemo(() => {
        const setDept = new Set(SAMPLE_DATA.map((f) => f.department));
        return ["All", ...Array.from(setDept).sort()];
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return SAMPLE_DATA.filter((f) => {
            if (department !== "All" && f.department !== department) return false;
            if (!q) return true;
            return (
                f.name.toLowerCase().includes(q) ||
                f.title.toLowerCase().includes(q) 
                
            );
        }).sort((a, b) =>
            sortBy === "name"
                ? a.name.localeCompare(b.name)
                : a.department.localeCompare(b.department)
        );
    }, [query, department, sortBy]);

    function initials(name: string) {
        return name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    return (
        <div className="faculty-root">
            <header className="faculty-header">
                <div>
                    <h1>Nexgen Learning Institute of Technology</h1>
                    <p className="muted">Faculty — Training & Academic Team</p>
                </div>
                <div className="controls">
                    <input
                        aria-label="Search faculty"
                        placeholder="Search by name, title or subject..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        aria-label="Filter by department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        {departments.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label="Sort faculty"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "name" | "dept")}
                    >
                        <option value="name">Sort: Name</option>
                        <option value="dept">Sort: Department</option>
                    </select>
                </div>
            </header>

            <main className="faculty-main">
                <section className="grid">
                    {filtered.map((f) => (
                        <article className="card" key={f.id}>
                            <div className="avatar">
                                {f.photoUrl ? (
                                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                    <img src={f.photoUrl} alt={`Photo of ${f.name}`} />
                                ) : (
                                    <div className="initials">{initials(f.name)}</div>
                                )}
                            </div>

                            <div className="meta">
                                <h3 className="name">{f.name}</h3>
                                <p className="title">{f.title}</p>
                                <p className="dept">{f.department}</p>

                                
                                <div className="card-actions">
                                    <button
                                        className="btn ghost"
                                        onClick={() => setSelected(f)}
                                        aria-label={`View profile of ${f.name}`}
                                    >
                                        View profile
                                    </button>
                                    <div className="contacts">
                                        {f.email && (
                                            <a href={`mailto:${f.email}`} title={f.email}>
                                                ✉
                                            </a>
                                        )}
                                        
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                <aside className="details">
                    {selected ? (
                        <div className="detail-card">
                            <div className="detail-header">
                                <div className="large-avatar">
                                    {selected.photoUrl ? (
                                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                        <img src={selected.photoUrl} alt={selected.name} />
                                    ) : (
                                        <div className="initials-large">{initials(selected.name)}</div>
                                    )}
                                </div>
                                <div>
                                    <h2>{selected.name}</h2>
                                    <p className="title">{selected.title}</p>
                                    <p className="dept">{selected.department}</p>
                                </div>
                            </div>

                            <section className="bio">
                                <h4>About</h4>
                                <p>{selected.bio}</p>
                            </section>

                            <section className="contact-info">
                                <h4>Contact</h4>
                                <ul>
                                    {selected.email && (
                                        <li>
                                            Email: <a href={`mailto:${selected.email}`}>{selected.email}</a>
                                        </li>
                                    )}
                                    
                                </ul>
                            </section>

                            <div className="detail-actions">
                                <button className="btn" onClick={() => setSelected(null)}>
                                    Close
                                </button>
                                <a
                                    className="btn primary"
                                    href={`mailto:${selected.email ?? ""}`}
                                    onClick={(e) => {
                                        if (!selected.email) e.preventDefault();
                                    }}
                                >
                                    Message
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="empty">
                            <p>Select a faculty card to see more details.</p>
                        </div>
                    )}
                </aside>
            </main>

            <style>{`
                .faculty-root {
                    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
                    color: #222;
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .faculty-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 18px;
                }
                .faculty-header h1 {
                    margin: 0;
                    font-size: 20px;
                }
                .muted {
                    margin: 4px 0 0;
                    color: #666;
                    font-size: 13px;
                }
                .controls {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                .controls input {
                    padding: 8px 10px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    min-width: 260px;
                }
                .controls select {
                    padding: 8px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    background: white;
                }

                .faculty-main {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 20px;
                }

                .grid {
                    display: grid;
                    gap: 12px;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                }

                .card {
                    display: flex;
                    gap: 12px;
                    background: #fff;
                    border: 1px solid #eee;
                    padding: 12px;
                    border-radius: 10px;
                    align-items: center;
                    transition: box-shadow .15s;
                }
                .card:hover {
                    box-shadow: 0 6px 16px rgba(20,20,40,0.06);
                }
                .avatar {
                    width: 64px;
                    height: 64px;
                    flex: 0 0 64px;
                    border-radius: 10px;
                    background: linear-gradient(135deg,#f3f6ff,#eef9ff);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .avatar img { width: 100%; height: 100%; object-fit: cover; }
                .initials {
                    font-weight: 700;
                    color: #1f3a8a;
                    font-size: 18px;
                }
                .meta { flex: 1; min-width: 0; }
                .name { margin: 0; font-size: 16px; }
                .title { margin: 4px 0 0; color: #555; font-size: 13px; }
                .dept { margin: 6px 0 0; font-size: 12px; color: #888; }

                .subjects { margin-top: 8px; display:flex; gap:6px; flex-wrap:wrap; }
                .tag {
                    background: #f1f5f9;
                    color: #0f172a;
                    padding: 4px 8px;
                    border-radius: 999px;
                    font-size: 12px;
                }

                .card-actions {
                    margin-top: 10px;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:8px;
                }

                .btn {
                    padding: 8px 10px;
                    border-radius: 8px;
                    border: 1px solid #d0d7de;
                    background: white;
                    cursor: pointer;
                    font-size: 13px;
                }
                .btn.primary {
                    background: #0b74ff;
                    color: white;
                    border-color: transparent;
                }
                .btn.ghost {
                    background: transparent;
                }
                .contacts a {
                    margin-left: 8px;
                    color: #333;
                    text-decoration: none;
                    font-size: 16px;
                }

                .details {
                    min-height: 200px;
                }
                .detail-card {
                    background: #fff;
                    border: 1px solid #eee;
                    padding: 16px;
                    border-radius: 10px;
                }
                .detail-header {
                    display:flex;
                    gap: 12px;
                    align-items: center;
                }
                .large-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 12px;
                    background: linear-gradient(135deg,#eef2ff,#f7f8ff);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    overflow:hidden;
                }
                .large-avatar img { width:100%; height:100%; object-fit:cover; }
                .initials-large { font-size: 22px; font-weight:700; color:#123b9a; }

                .bio, .contact-info { margin-top: 12px; }
                .bio h4, .contact-info h4 { margin: 0 0 6px 0; font-size: 13px; color:#333; }
                .detail-actions { margin-top: 12px; display:flex; gap:8px; }

                .empty {
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    height:100%;
                    color:#666;
                    background:#fbfbfb;
                    border:1px dashed #eee;
                    border-radius:10px;
                    padding:20px;
                }

                @media (max-width: 880px) {
                    .faculty-main {
                        grid-template-columns: 1fr;
                    }
                    .details {
                        order: 2;
                    }
                }
            `}</style>
        </div>
    );
}
