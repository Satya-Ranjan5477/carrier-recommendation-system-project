from flask import Flask, render_template, request
from predict import predict_career


app = Flask(__name__)



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

    # MULTI SELECT VALUES
    skills = request.form.getlist('skills[]')
    interests = request.form.getlist('interests[]')

    career = predict_career(q, skills, interests)

    return render_template('result.html', career=career)


  




if __name__ == "__main__":
    app.run(debug=True)