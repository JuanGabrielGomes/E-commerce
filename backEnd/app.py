from flask import Flask, request, jsonify
import models
import connection as ConexaoDB

app = Flask(__name__)

@app.route('/usuarios', methods=['POST'])
def adicionar_usuarios():
    dados = request.get_json()
    novo_usuario = models.Usuario(dados['nome'], dados['email'], dados['senha'])
    conn = None
    try:
        conn = ConexaoDB.connect_db()
        query = novo_usuario.salvar(conn)
        ConexaoDB.commit_db(conn)
        novo_id = query.inserted_primary_key[0]

        return jsonify({'mensagem': 'Usuário adicionado com sucesso!', 'id': novo_id}), 201
    
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
        usuario_model = models.Usuario(None, None, None)
        resultados = usuario_model.lerTodos(conn)
        usuarios = [{'id': row.id, 'nome': row.nome, 'email': row.email} for row in resultados]

        return jsonify(usuarios), 200
    
    except Exception as e:
        ConexaoDB.rollback_db(conn)
        return jsonify({'erro': str(e)}), 500
    finally:
        ConexaoDB.close_db(conn)

if __name__ == '__main__':
    app.run(debug=True)
