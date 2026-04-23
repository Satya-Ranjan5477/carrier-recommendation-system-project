from flask import Flask, render_template, request,jsonify, session ,redirect, send_from_directory
from carrier_skill_catalog import REQUIRED_SKILLS_BY_CAREER
from predict import predict_career
from quiz_data import get_random_questions
from career_path_data import career_paths
from skill_gap import analyze_skill_gap
from dotenv import load_dotenv
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


load_dotenv()


app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")


def firebase_config():
    return {
      "apiKey": os.getenv("FIREBASE_API_KEY"),
      "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
      "projectId": os.getenv("FIREBASE_PROJECT_ID"),
      "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
      "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
      "appId": os.getenv("FIREBASE_APP_ID")
    }


@app.route("/")
def home():
    return render_template ('index.html')


@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect("/login")
    return render_template ('dashboard.html',firebase_config=firebase_config())


@app.route("/login")
def login():
    return render_template ('login.html',firebase_config=firebase_config())


@app.route("/register")
def register():
    return render_template ('register.html',firebase_config=firebase_config())


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
    traits = request.form.getlist('traits[]')
    


    career = predict_career(q, skills, interests,traits)
    skill_gap = analyze_skill_gap(
        predicted_career=career,
        user_skills=skills,
        required_skills_by_career=REQUIRED_SKILLS_BY_CAREER,
    )

    # ✅ store career in session
    normalized_traits = {trait.strip().lower() for trait in traits if isinstance(trait, str) and trait.strip()}
    trait_bonus = 0

    if 'analytical' in normalized_traits:
        trait_bonus += 5
    if 'problem solving' in normalized_traits:
        trait_bonus += 5
    if 'logical thinking' in normalized_traits:
        trait_bonus += 4
    if 'creativity' in normalized_traits:
        trait_bonus += 3
    if 'curiosity' in normalized_traits:
        trait_bonus += 2

    base_score = skill_gap.get('readiness_percentage', 0)
    readiness_score = min(base_score + trait_bonus, 100)
    skill_gap['readiness_score'] = readiness_score
    skill_gap['readiness_percentage'] = readiness_score
    total_skills = len(skill_gap.get('matched_skills', [])) + len(skill_gap.get('missing_skills', []))

    session['career'] = career
    session['skill_gap'] = skill_gap
    session['traits'] = traits
    session['interests'] = interests
    session['total_skills'] = total_skills

    return render_template('result.html', career=career, skill_gap=skill_gap, traits=traits, interests=interests, total_skills=total_skills)


@app.route('/result')
def result():
    if "user_id" not in session:
        return redirect("/login")
    career = session.get('career')
    skill_gap = session.get('skill_gap')
    traits = session.get('traits', [])
    interests = session.get('interests', [])
    total_skills = session.get('total_skills', 0)
    return render_template('result.html', career=career, skill_gap=skill_gap, traits=traits, interests=interests, total_skills=total_skills)

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
    selected_career = request.args.get("career") or session.get("career") or ""
    return render_template("career_path.html", selected_career=selected_career)
    

@app.route("/get-path/<career>")
def get_path(career):
    return jsonify(career_paths.get(career, {}))


@app.route("/set-user", methods=["POST"])
def set_user():
    data = request.json
    session["user_id"] = data["user_id"]
    return jsonify({"message": "Session set"})

@app.route("/resume")
def resume():
    if "user_id" not in session:
        return redirect("/login")
    career = session.get("career")
    return render_template('resume.html', career=career)
  

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")



'''if __name__ == "__main__":
    app.run(debug=True)'''
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)