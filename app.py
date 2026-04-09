from flask import Flask, render_template, request,jsonify, session
from predict import predict_career
from quiz_data import get_random_questions


app = Flask(__name__)
app.secret_key = "secret123"


@app.route("/")
def home():
    return render_template ('index.html')


@app.route("/dashboard")
def dashboard():
    return render_template ('dashboard.html')


@app.route("/login")
def login():
    return render_template ('login.html')


@app.route("/register")
def register():
    return render_template ('register.html')


@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/predict', methods=['POST'])
def predict():
    q = request.form['qualification']
    skills = request.form.getlist('skills[]')
    interests = request.form.getlist('interests[]')

    career = predict_career(q, skills, interests)

    # ✅ store career in session
    session['career'] = career

    return render_template('result.html', career=career)


@app.route('/result')
def result():
    career = session.get('career')
    return render_template('result.html', career=career)

@app.route("/quiz")
def quiz_page():
    career = request.args.get("career")
    return render_template("quiz.html", career=career)


@app.route("/get-quiz/<career>")
def get_quiz(career):
    return jsonify(get_random_questions(career))
  




if __name__ == "__main__":
    app.run(debug=True)