from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.ext.declarative import declarative_base

url = 'sqlite:///hello.db'
engine = create_engine(url, echo=False)
metadata = MetaData(bind=engine, reflect=True)
Base = declarative_base(engine)

class TT_user(Base):
    __tablename__ = "user"
    __table_args__ = {"autoload": True}