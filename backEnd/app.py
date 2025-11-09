from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
import models
import connection as ConexaoDB

app = Flask(__name__)
bcrypt = Bcrypt(app)

@app.route('/usuarios', methods=['POST'])
def adicionar_usuarios():
    dados = request.get_json(silent=True)
    hash_senha = bcrypt.generate_password_hash(dados['senha']).decode('utf-8')
    novo_usuario = models.Usuario(dados['nome'], dados['email'], hash_senha)
    conn = None
    try:
        if not novo_usuario.nome or not novo_usuario.email or not novo_usuario.senha:
            return jsonify({'erro': 'Nome, email e senha são obrigatórios'}), 400
        if dados.get('id') is not None:
            return jsonify({'erro': 'ID não deve ser fornecido ao criar um novo usuário'}), 400
        conn = ConexaoDB.connect_db()
        query = novo_usuario.salvar(conn)
        ConexaoDB.commit_db(conn)

        return jsonify({'mensagem': 'Usuário adicionado com sucesso!'}), 201
    
    except Exception as e:
        ConexaoDB.rollback_db(conn)
        return jsonify({'erro': str(e)}), 500
    finally:
        ConexaoDB.close_db(conn)

@app.route('/usuarios', methods=['GET'])
def listar_usuarios():
    conn = None
    try:
        conn = ConexaoDB.connect_db()
        resultados = models.Usuario.lerTodos(conn)
        usuarios = [{'id': row.id, 'nome': row.nome, 'email': row.email} for row in resultados]

        return jsonify(usuarios), 200
    
    except Exception as e:
        ConexaoDB.rollback_db(conn)
        return jsonify({'erro': str(e)}), 500
    finally:
        ConexaoDB.close_db(conn)

@app.route('/usuarios/<int:id>', methods=["PUT"])
def atualizar_usuario(id):
    dados_atualizados = request.get_json(silent=True)
    conn = None
    try:
        conn = ConexaoDB.connect_db()
        query = models.Usuario.atualizar(conn, id, dados_atualizados)
        ConexaoDB.commit_db(conn)
        if query == 0:
            return jsonify({'erro': 'Usuário não encontrado'}), 404   
        return jsonify({"mensagem": "Usuário atualziado com sucesso!"}), 200
    except Exception as e:
        ConexaoDB.rollback_db(conn)
        return jsonify({'erro': str(e)}), 500
    finally:
        ConexaoDB.close_db(conn)

@app.route('/usuarios/<int:id>', methods=["DELETE"])
def deletar_usuario(id):
    conn = None
    try:
        conn = ConexaoDB.connect_db()
        query = models.Usuario.deletar(conn, id)
        ConexaoDB.commit_db(conn)
        if query == 0:
            return jsonify({'erro': 'Usuário não encontrado'}), 404   
        return jsonify({"mensagem": "Usuário deletado com sucesso!"}), 200
    except Exception as e:
        ConexaoDB.rollback_db(conn)
        return jsonify({'erro': str(e)}), 500
    finally:
        ConexaoDB.close_db(conn)

@app.route('/produtos', methods=['POST'])
def adicionar_produtos():
    dados = request.get_json(silent=True)
    novo_produto = models.Produto(dados.get('id_produto'), dados.get('preco'), dados.get('desconto'), dados.get('imagem'), dados.get('nome_produto'), dados.get('descricao'))
    conn = None
    try:
        for campo in ['id_produto', 'preco', 'imagem', 'nome_produto', 'descricao']:
            if not dados.get(campo):
                return jsonify({'erro': 'Todos os campos são obrigatorios'}), 400
        conn = ConexaoDB.connect_db()
        query = novo_produto.salvar(conn)
        ConexaoDB.commit_db(conn)
        return jsonify({'mensagem': 'Produto adicionado com sucesso!'}), 201
    except Exception as e:
        ConexaoDB.rollback_db(conn)
        return jsonify({'erro': str(e)}), 500
    finally:
        ConexaoDB.close_db(conn)

if __name__ == '__main__':
    app.run(debug=True)
