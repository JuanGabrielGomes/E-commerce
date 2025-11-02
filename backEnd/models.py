import connection as ConexaoDB
from connection import usuarios_tabela

class Usuario:
    def __init__(self, nome, email, senha):
        self.nome = nome
        self.email = email
        self.senha = senha

    def salvar(self, conn):
        ins = usuarios_tabela.insert().values(nome=self.nome, email=self.email, senha=self.senha)
        query = conn.execute(ins)
        return query
    
    def lerTodos(self, conn):
        sel = usuarios_tabela.select()        
        result = conn.execute(sel)        
        return result.fetchall()
    
    @classmethod
    def atualizar(cls, conn, id, dados_atualizados):
        updt = usuarios_tabela.update().where(usuarios_tabela.c.id == id).values(**dados_atualizados)
        query = conn.execute(updt)
        return query.rowcount

    @classmethod
    def deletar(cls, conn, id):
        delete = usuarios_tabela.delete().where(usuarios_tabela.c.id == id)
        query = conn.execute(delete)
        return query.rowcount
