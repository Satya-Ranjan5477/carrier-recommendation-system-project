from flask import Flask, render_template, request,jsonify, session ,redirect
from predict import predict_career
from quiz_data import get_random_questions
from career_path_data import career_paths


app = Flask(__name__)
app.secret_key = "secret123"


@app.route("/")
def home():
    return render_template ('index.html')


@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect("/login")
    return render_template ('dashboard.html')


@app.route("/login")
def login():
    return render_template ('login.html')


@app.route("/register")
def register():
    return render_template ('register.html')


@app.route('/form')
def form():
    if "user_id" not in session:
        return redirect("/login")
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
    if "user_id" not in session:
        return redirect("/login")
    career = session.get('career')
    return render_template('result.html', career=career)

@app.route("/quiz")
def quiz_page():
    if "user_id" not in session:
        return redirect("/login")
    career = request.args.get("career")
    return render_template("quiz.html", career=career)


@app.route("/get-quiz/<career>")
def get_quiz(career):
    return jsonify(get_random_questions(career))

    
@app.route("/career-path")
def career_path():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("career_path.html")


@app.route("/get-path/<career>")
def get_path(career):
    return jsonify(career_paths.get(career, {}))


@app.route("/set-user", methods=["POST"])
def set_user():
    data = request.json
    session["user_id"] = data["user_id"]
    return jsonify({"message": "Session set"})
  

@app.route("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}) 



if __name__ == "__main__":
    app.run(debug=True)