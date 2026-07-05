import os
import json
import sqlite3
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for local development

DB_FILE = 'portfolio.db'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS portfolio_settings (
            id INTEGER PRIMARY KEY,
            data TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS unique_visitors (
            ip_hash TEXT PRIMARY KEY,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    
    # Check if empty, populate with default settings
    cursor.execute('SELECT COUNT(*) FROM portfolio_settings')
    if cursor.fetchone()[0] == 0:
        default_data = {
            "profile": {
                "name": "Aryan Joshi",
                "title": "Full Stack & Intelligent Agents Architect",
                "description": "Designing and building high-performance web solutions, advanced intelligent applications, and scalable backend infrastructures for forward-thinking clients.",
                "about": "I started programming over five years ago, driven by curiosity to build solutions that resolve real-world problems. Today, my focus lies at the intersection of modern front-end design systems, scalable backend architectures, and intelligent API implementations.",
                "avatar": "assets/images/avatar.png?v=original",
                "resume": "#"
            },
            "education": [
                {
                    "id": "1",
                    "title": "M.S. in Computer Science",
                    "date": "2020 - 2022",
                    "org": "State Tech University",
                    "desc": "Specialized in Intelligent Systems and Distributed Backend Architecture. Graduated with Honors."
                },
                {
                    "id": "2",
                    "title": "B.S. in Software Engineering",
                    "date": "2016 - 2020",
                    "org": "Tech Institute of Science",
                    "desc": "Acquired foundational training in Data Structures, Database Systems design, and Object-Oriented methodologies."
                }
            ],
            "experience": [
                {
                    "id": "1",
                    "title": "Senior Full Stack Engineer",
                    "date": "2024 - Present",
                    "org": "Vortex Digital Lab",
                    "desc": "Designing high-throughput API services, optimizing database latency, and guiding the transition from monoliths to next-gen edge architectures."
                },
                {
                    "id": "2",
                    "title": "Software Developer",
                    "date": "2022 - 2024",
                    "org": "WebSolutions Inc.",
                    "desc": "Successfully built and scaled 15+ clients dashboards, increasing application load speed and UI metrics."
                }
            ],
            "stats": {
                "username": "aryanjoshi458-rgb",
                "repos": 34,
                "followers": 120,
                "following": 84
            },
            "contact": {
                "email": "Aryan.Joshi.dev@gmail.com",
                "phone": "+1 (555) 019-2834",
                "location": "San Francisco, CA"
            },
            "projects": [
                {
                    "id": "1",
                    "title": "Neural Analytics Hub",
                    "category": "ai",
                    "desc": "Real-time business data processing platform powered by the Gemini API for natural language reports.",
                    "tech": "Next.js, FastAPI, Gemini API, ChartJS",
                    "features": "Natural language query interface, Automated reports builder, Real-time telemetry integration",
                    "image": "assets/images/project1.png?v=original",
                    "demo": "#",
                    "github": "#"
                },
                {
                    "id": "2",
                    "title": "Stripe-integrated SaaS Portal",
                    "category": "web",
                    "desc": "A premium customer management tool with dynamic billing subscription plans, and invoice exports.",
                    "tech": "React, Node.js, MongoDB, Stripe",
                    "features": "Stripe Billing API integration, Responsive admin panel, Secure user authentication",
                    "image": "assets/images/project1.png?v=original",
                    "demo": "#",
                    "github": "#"
                },
                {
                    "id": "3",
                    "title": "Git-Automate CLI",
                    "category": "tools",
                    "desc": "A lightweight command-line tool to automate git status auditing, auto-commit creation, and pull requests.",
                    "tech": "Node.js, Inquirer, OpenAI API",
                    "features": "Automated local git repository scan, AI-generated commit descriptions, Interactive shell menu",
                    "image": "assets/images/project1.png?v=original",
                    "demo": "#",
                    "github": "#"
                }
            ],
            "certs": [
                {
                    "id": "1",
                    "logo": "AWS",
                    "title": "AWS Certified Solutions Architect",
                    "provider": "Amazon Web Services",
                    "date": "Issued Jan 2025 • Expires Jan 2028",
                    "link": "#"
                },
                {
                    "id": "2",
                    "logo": "TFS",
                    "title": "TensorFlow Developer Certificate",
                    "provider": "TensorFlow / Google",
                    "date": "Issued Aug 2024 • No Expiration",
                    "link": "#"
                },
                {
                    "id": "3",
                    "logo": "MDB",
                    "title": "MongoDB Certified Developer",
                    "provider": "MongoDB University",
                    "date": "Issued May 2023 • No Expiration",
                    "link": "#"
                }
            ]
        }
        cursor.execute('INSERT INTO portfolio_settings (id, data) VALUES (1, ?)', (json.dumps(default_data),))
        conn.commit()
    conn.close()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# API Routes
@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT data FROM portfolio_settings WHERE id = 1')
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify(json.loads(row['data']))
    return jsonify({"error": "No data found"}), 404

@app.route('/api/portfolio', methods=['POST'])
def save_portfolio():
    conn = get_db()
    cursor = conn.cursor()
    new_data = request.json
    cursor.execute('UPDATE portfolio_settings SET data = ? WHERE id = 1', (json.dumps(new_data),))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Portfolio updated successfully"})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add a unique identifier to prevent overwriting
        name, ext = os.path.splitext(filename)
        import time
        unique_filename = f"{name}_{int(time.time())}{ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        url_path = f"/uploads/{unique_filename}"
        return jsonify({"success": True, "url": url_path})
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/messages', methods=['POST'])
def send_message():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({"error": "Missing required fields"}), 400
        
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    ''', (name, email, subject, message))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Message sent successfully"})

@app.route('/api/messages', methods=['GET'])
def get_messages():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email, subject, message, timestamp FROM contact_messages ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    conn.close()
    
    messages = []
    for r in rows:
        messages.append({
            "id": r['id'],
            "name": r['name'],
            "email": r['email'],
            "subject": r['subject'],
            "message": r['message'],
            "timestamp": r['timestamp']
        })
    return jsonify(messages)

@app.route('/api/messages/<int:msg_id>', methods=['DELETE'])
def delete_message(msg_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM contact_messages WHERE id = ?', (msg_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Message deleted successfully"})

@app.route('/api/visit', methods=['POST'])
def log_visit():
    import hashlib
    # Get remote client IP from headers, handling proxy hops
    ip = request.headers.get('X-Forwarded-For', request.remote_addr or '127.0.0.1')
    # If multiple proxies exist, take the first one (real client)
    if ',' in ip:
        ip = ip.split(',')[0].strip()
    else:
        ip = ip.strip()
        
    ip_hash = hashlib.sha256(ip.encode('utf-8')).hexdigest()
    
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT OR IGNORE INTO unique_visitors (ip_hash) VALUES (?)', (ip_hash,))
        conn.commit()
    except Exception as e:
        print("Visitor log error:", e)
    conn.close()
    return jsonify({"success": True})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM unique_visitors')
    visitors_count = cursor.fetchone()[0]
    cursor.execute('SELECT COUNT(*) FROM contact_messages')
    messages_count = cursor.fetchone()[0]
    conn.close()
    return jsonify({
        "unique_visitors": visitors_count,
        "total_messages": messages_count
    })


# Static File Routes
@app.route('/')
@app.route('/index.html')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/admin.html')
def serve_admin():
    return send_from_directory('.', 'admin.html')

@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory('assets', path)

@app.route('/uploads/<path:path>')
def serve_uploads(path):
    return send_from_directory('uploads', path)

if __name__ == '__main__':
    init_db()
    # Run the server on port 5000
    print("Starting Flask server on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
