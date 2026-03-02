import sqlite3

def migrate():
    conn = sqlite3.connect("tutoring.db")
    c = conn.cursor()

    try:
        c.execute("SELECT id, student_id, tutor_id, slot_id, status, calendar_event_id, meet_link, created_at, subject FROM bookings")
        old_bookings = c.fetchall()
    except sqlite3.OperationalError:
        print("Could not select existing bookings data. Maybe missing subject column? Trying without it.")
        c.execute("SELECT id, student_id, tutor_id, slot_id, status, calendar_event_id, meet_link, created_at FROM bookings")
        temp_bookings = c.fetchall()
        old_bookings = [(*row, "Unknown Subject") for row in temp_bookings]

    c.execute("DROP TABLE bookings")

    c.execute("""
    CREATE TABLE bookings (
        id VARCHAR NOT NULL, 
        student_id VARCHAR NOT NULL, 
        tutor_id VARCHAR NOT NULL, 
        subject VARCHAR(255) NOT NULL,
        slot_id VARCHAR NOT NULL, 
        status VARCHAR(20) NOT NULL, 
        calendar_event_id VARCHAR(255), 
        meet_link VARCHAR(500), 
        created_at DATETIME NOT NULL, 
        PRIMARY KEY (id), 
        FOREIGN KEY(student_id) REFERENCES users (id), 
        FOREIGN KEY(tutor_id) REFERENCES tutor_profiles (id), 
        FOREIGN KEY(slot_id) REFERENCES availability_slots (id)
    )
    """)

    for row in old_bookings:
        c.execute("""
            INSERT INTO bookings (id, student_id, tutor_id, slot_id, status, calendar_event_id, meet_link, created_at, subject)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, row)

    conn.commit()
    conn.close()
    print("Bookings table successfully migrated without topic_id.")

if __name__ == "__main__":
    migrate()
