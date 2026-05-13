from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import time
from typing import List, Dict, Any, Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(__file__)
REG_FILE = os.path.join(BASE_DIR, "registrations.json")
COURSE_FILE = os.path.join(BASE_DIR, "courses.json")

# Initialize Files
def init_files():
    if not os.path.exists(REG_FILE):
        with open(REG_FILE, "w") as f: json.dump([], f)
    if not os.path.exists(COURSE_FILE):
        # Initial courses if file doesn't exist
        initial_courses = [
            {"id": "c16", "title": "Python Programming", "category": "Programming", "code": "PRG-003", "fee": 6500, "duration": "3 Months", "active": True},
            {"id": "c21", "title": "Web Development", "category": "Programming", "code": "PRG-008", "fee": 12000, "duration": "4 Months", "active": True}
        ]
        with open(COURSE_FILE, "w") as f: json.dump(initial_courses, f, indent=2)

init_files()

# Helper Functions
def read_json(path):
    with open(path, "r") as f: return json.load(f)

def write_json(path, data):
    with open(path, "w") as f: json.dump(data, f, indent=2)

# --- REGISTRATION ENDPOINTS ---
@app.get("/api/registrations")
async def get_registrations():
    return read_json(REG_FILE)

@app.post("/api/registrations")
async def create_registration(reg: Dict[Any, Any]):
    data = read_json(REG_FILE)
    reg["id"] = int(time.time() * 1000)
    reg["registeredAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    data.append(reg)
    write_json(REG_FILE, data)
    return reg

@app.patch("/api/registrations/{reg_id}")
async def update_registration(reg_id: int, updates: Dict[Any, Any]):
    data = read_json(REG_FILE)
    for reg in data:
        if reg.get("id") == reg_id:
            reg.update(updates)
            write_json(REG_FILE, data)
            return reg
    raise HTTPException(status_code=404, detail="Student not found")

# --- COURSE ENDPOINTS ---
@app.get("/api/courses")
async def get_courses():
    return read_json(COURSE_FILE)

@app.post("/api/courses")
async def add_course(course: Dict[Any, Any]):
    data = read_json(COURSE_FILE)
    course["id"] = f"c{int(time.time())}"
    data.append(course)
    write_json(COURSE_FILE, data)
    return course

@app.put("/api/courses/{course_id}")
async def edit_course(course_id: str, updates: Dict[Any, Any]):
    data = read_json(COURSE_FILE)
    for i, c in enumerate(data):
        if c["id"] == course_id:
            data[i].update(updates)
            write_json(COURSE_FILE, data)
            return data[i]
    raise HTTPException(status_code=404, detail="Course not found")

@app.delete("/api/courses/{course_id}")
async def delete_course(course_id: str):
    data = read_json(COURSE_FILE)
    new_data = [c for c in data if c["id"] != course_id]
    write_json(COURSE_FILE, new_data)
    return {"message": "Deleted"}

# --- VERIFICATION ENDPOINT ---
@app.get("/api/verify/{unique_id}")
async def verify_student(unique_id: str):
    data = read_json(REG_FILE)
    for reg in data:
        if reg.get("uniqueId") == unique_id:
            return {
                "valid": True,
                "name": reg.get("fullName") or reg.get("name"),
                "course": reg.get("courseName"),
                "status": reg.get("status"),
                "photo": reg.get("photoUrl")
            }
    return {"valid": False}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
