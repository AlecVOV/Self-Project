from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
import logging
import os

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'db.sqlite3')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        logging.error(f"Failed to create database: {str(e)}")

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return '<Task %r>' % self.id

#Route to add a new task
@app.route('/add', methods=['POST'])
def add():
    content = request.form['content']
    new_task = Todo(content=content)
    try:
        db.session.add(new_task)
        db.session.commit()
        return redirect('/')
    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        return 'There was an issue adding your task'
    
#Route to delete a task
@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)
    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was a problem deleting that task'
    

#Route to display all tasks
@app.route('/')
def index():
    To_do_list = Todo.query.all()
    return render_template('index.html', To_do_list=To_do_list)

    


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)