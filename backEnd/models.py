class Usuario:
    def __init__(self, nome, email, senha, id=None):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.id = id

    def salvar(self, conn):
        cur = conn.cursor()
        
        sql = "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s) RETURNING id;"
        valores = (self.nome, self.email, self.senha)
        
        try:
            cur.execute(sql, valores)
            self.id = cur.fetchone()[0]
        finally:
            cur.close()
        
        return self.id
    
    @classmethod
    def lerTodos(cls, conn):
        cur = conn.cursor()
        try:
            cur.execute("SELECT id, nome, email FROM usuarios ORDER BY id;")
            usuarios_no_banco = cur.fetchall()
        
            lista_formatada = []
            for u in usuarios_no_banco:
                lista_formatada.append({"id": u[0], "nome": u[1], "email": u[2]})
            return lista_formatada
        finally:
            cur.close()

    @classmethod
    def atualizar(cls, conn, id, dados_para_atualizar):
        if not dados_para_atualizar:
            return 0
        
        cur = conn.cursor()
        try:
            campos = []
            valores = []
            for chave, valor in dados_para_atualizar.items():
                campos.append(f"{chave} = %s")
                valores.append(valor)
            
            valores.append(id)
            sql = f"UPDATE usuarios SET {', '.join(campos)} WHERE id = %s;"
            
            cur.execute(sql, tuple(valores))
        finally:
            cur.close()

    @classmethod
    def deletar(cls, conn, id):
        cur = conn.cursor()
        delete = "DELETE FROM usuarios WHERE id = %s"
        
        try:
            cur.execute(delete, (id, ))
        finally:
            cur.close()

#class Produto:
    #def __init__(self, id_produto, preco, desconto, imagem, nome_produto, descricao):
        ##self.preco = preco
        #self.desconto = desconto
        #self.imagem = imagem
        #self.nome_produto = nome_produto
        #self.descricao = descricao

    #def salvar(self, conn):
        #ins = produtos_tabela.insert().values(id_produto=self.id_produto, preco=self.preco,imagem=self.imagem, nome_produto=self.nome_produto, descricao=self.descricao)
        #query = conn.execute(ins)
       # return query


    #@classmethod
    #def lerTodos(cls, conn):
       # sel = produtos_tabela.select()
       # result = conn.execute(sel)
       # return result.fetchall()