import sys
print("starting", file=sys.stderr)
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class TestModel(Base):
    __tablename__ = 'test_table'
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

engine = create_engine('sqlite:///:memory:', echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

t = TestModel()
session.add(t)
session.commit()
session.refresh(t)
print("Type of created_at:", type(t.created_at), repr(t.created_at), file=sys.stderr)
