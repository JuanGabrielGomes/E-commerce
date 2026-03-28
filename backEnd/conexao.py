import psycopg2

senha_do_banco = "usuario"
ip_da_vm = "192.168.1.8"
nome_do_banco = "ecommerce"


def connect_db():
    try:
        conn = psycopg2.connect(database = nome_do_banco, user = "usuario", host= ip_da_vm, password = senha_do_banco, port = 5432)
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None
    
def close_db(conn):
    if conn:
        conn.close()

def commit_db(conn):
    if conn:
        conn.commit()

def rollback_db(conn):
    conn.rollback()