from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String

senha_do_banco = "usuario"
ip_da_vm = "192.168.0.50"
nome_do_banco = "ecommerce"

string_de_conexao = f"postgresql+psycopg2://usuario:{senha_do_banco}@{ip_da_vm}/{nome_do_banco}"

engine = create_engine(string_de_conexao, echo=True)

meta = MetaData()

usuarios_tabela = Table('usuarios', meta, Column('id', Integer, primary_key=True), Column('nome', String), Column('email', String), Column('senha', String))

def connect_db():
    connection = engine.connect()

    return connection

def close_db(connection):
    if connection:
        connection.close()

def commit_db(connection):
    if connection:
        connection.commit()

def rollback_db(connection):
    if connection:
        connection.rollback()