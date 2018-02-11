from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.ext.declarative import declarative_base

url = 'sqlite:///user.db'
engine = create_engine(url, echo=False)
metadata = MetaData(bind=engine, reflect=True)
Base = declarative_base(engine)

class Account(Base):
    __tablename__ = "account"
    __table_args__ = {"autoload": True}