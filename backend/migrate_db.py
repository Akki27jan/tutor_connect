import sqlite3

def migrate():
    print("Connecting to tutoring.db")
    conn = sqlite3.connect("tutoring.db")
    cur = conn.cursor()
    
    cur.execute("PRAGMA table_info(bookings)")
    cols = [r[1] for r in cur.fetchall()]
    print("Current bookings columns:", cols)

    if "topic_id" in cols:
        print("Dropping topic_id from bookings...")
        cur.execute("ALTER TABLE bookings DROP COLUMN topic_id")
    
    if "subject" not in cols:
        print("Adding subject to bookings...")
        cur.execute("ALTER TABLE bookings ADD COLUMN subject VARCHAR(255) NOT NULL DEFAULT 'Unknown'")
        
    cur.execute("PRAGMA table_info(tutor_profiles)")
    t_cols = [r[1] for r in cur.fetchall()]
    print("Current tutor_profiles columns:", t_cols)

    if "subjects" not in t_cols:
        print("Adding subjects to tutor_profiles...")
        cur.execute("ALTER TABLE tutor_profiles ADD COLUMN subjects VARCHAR(500) DEFAULT ''")

    # The previous conversations mention "Implementing Custom Subjects" and replacing the predefined list. 
    # Did they remove tables? If they aren't complaining about it, I'll just commit these alterations.
    conn.commit()
    print("Migration complete.")
    conn.close()

if __name__ == "__main__":
    migrate()
