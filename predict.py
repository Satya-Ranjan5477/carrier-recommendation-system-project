import joblib
import numpy as np

model = joblib.load("model.pkl")
le_q = joblib.load("le_q.pkl")
le_c = joblib.load("le_c.pkl")
mlb_skills = joblib.load("mlb_skills.pkl")
mlb_interests = joblib.load("mlb_interests.pkl")

def normalize_list(lst):
    return [x.strip().lower() for x in lst]

def predict_career(q, skills, interests):

    q = le_q.transform([q])[0]

    skills_encoded = mlb_skills.transform([skills])
    interests_encoded = mlb_interests.transform([interests])

    X = np.hstack(([q], skills_encoded[0], interests_encoded[0])).reshape(1, -1)

    pred = model.predict(X)
    return le_c.inverse_transform(pred)[0]

    skills_n = normalize_list(skills)
    interests_n = normalize_list(interests)

    raw_keywords = career_keywords.get(career, {})

    keywords = {
       "skills": normalize_list(raw_keywords.get("skills", [])),
       "interests": normalize_list(raw_keywords.get("interests", [])),
    }


    return career