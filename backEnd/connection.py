from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float

senha_do_banco = "usuario"
ip_da_vm = "192.168.0.50"
nome_do_banco = "ecommerce"

string_de_conexao = f"postgresql+psycopg2://usuario:{senha_do_banco}@{ip_da_vm}/{nome_do_banco}"

engine = create_engine(string_de_conexao, echo=True)

meta = MetaData()

usuarios_tabela = Table('usuarios', meta, Column('id', Integer, primary_key=True), Column('nome', String), Column('email', String), Column('senha', String(128)))
produtos_tabela = Table('produtos', meta, Column('id_produto', Integer, primary_key=True), Column('preco', Float), Column('desconto', Float), Column('imagem', String), Column('nome_produto', String), Column('descricao', String))

def connect_db():
    try:
        connection = engine.connect()
        return connection
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        raise e

def close_db(connection):
    if connection:
        connection.close()

def commit_db(connection):
    if connection:
        connection.commit()

def rollback_db(connection):
    if connection:
        connection.rollback()