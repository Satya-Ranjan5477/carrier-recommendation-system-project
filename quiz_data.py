import random

quiz_data = {

"Data Scientist": [
{"q":"What is data preprocessing?","opt":["Cleaning data","Deleting data","Ignoring data"],"ans":"Cleaning data"},
{"q":"Which library is used for analysis?","opt":["NumPy","Pandas","TensorFlow"],"ans":"Pandas"},
{"q":"What is overfitting?","opt":["Simple model","Complex model","No training"],"ans":"Complex model"},
{"q":"Supervised learning uses?","opt":["Labeled data","Unlabeled","No data"],"ans":"Labeled data"},
{"q":"Classification algorithm?","opt":["Linear Regression","Logistic Regression","Clustering"],"ans":"Logistic Regression"},
{"q":"Feature means?","opt":["Column","Row","Table"],"ans":"Column"},
{"q":"Dataset is?","opt":["Data collection","Single value","Graph"],"ans":"Data collection"},
{"q":"ML stands for?","opt":["Machine Learning","Manual Learning","None"],"ans":"Machine Learning"}
],

"Web Developer": [
{"q":"HTML stands for?","opt":["Hyper Text Markup Language","High Text Machine Language","None"],"ans":"Hyper Text Markup Language"},
{"q":"CSS is used for?","opt":["Structure","Styling","Database"],"ans":"Styling"},
{"q":"JavaScript is used for?","opt":["Logic","Design","Database"],"ans":"Logic"},
{"q":"Responsive means?","opt":["Mobile friendly","Slow","Static"],"ans":"Mobile friendly"},
{"q":"Bootstrap is?","opt":["Framework","Language","Database"],"ans":"Framework"},
{"q":"React is?","opt":["Library","Database","Tool"],"ans":"Library"},
{"q":"ID vs Class?","opt":["Same","ID unique","Class unique"],"ans":"ID unique"},
{"q":"API is?","opt":["Interface","Database","Server"],"ans":"Interface"}
],

"AI Engineer": [
{"q":"AI stands for?","opt":["Artificial Intelligence","Auto Input","None"],"ans":"Artificial Intelligence"},
{"q":"Neural network is?","opt":["Brain model","Database","UI"],"ans":"Brain model"},
{"q":"Deep learning is?","opt":["Subset of ML","Database","UI"],"ans":"Subset of ML"},
{"q":"TensorFlow is?","opt":["Library","Language","Tool"],"ans":"Library"},
{"q":"NLP is?","opt":["Language processing","Database","UI"],"ans":"Language processing"},
{"q":"Model training means?","opt":["Learning","Deleting","Ignoring"],"ans":"Learning"},
{"q":"Dataset is?","opt":["Data collection","Single value","None"],"ans":"Data collection"},
{"q":"Prediction means?","opt":["Future guess","Delete","Ignore"],"ans":"Future guess"}
],

"Cybersecurity Analyst": [
{"q":"Firewall is?","opt":["Security system","Database","UI"],"ans":"Security system"},
{"q":"Phishing is?","opt":["Attack","Game","Tool"],"ans":"Attack"},
{"q":"Encryption means?","opt":["Secure data","Delete data","Ignore"],"ans":"Secure data"},
{"q":"Penetration testing?","opt":["Testing security","Coding","Design"],"ans":"Testing security"},
{"q":"Malware is?","opt":["Virus","App","Tool"],"ans":"Virus"},
{"q":"VPN is?","opt":["Secure network","Database","UI"],"ans":"Secure network"},
{"q":"Linux used for?","opt":["Security","Design","Gaming"],"ans":"Security"},
{"q":"Ethical hacking is?","opt":["Legal hacking","Illegal","None"],"ans":"Legal hacking"}
],

"Cloud Engineer": [
{"q":"Cloud computing is?","opt":["Online storage","Offline","None"],"ans":"Online storage"},
{"q":"AWS is?","opt":["Cloud platform","Language","Tool"],"ans":"Cloud platform"},
{"q":"Docker is?","opt":["Container tool","Database","UI"],"ans":"Container tool"},
{"q":"Kubernetes is?","opt":["Container management","Coding","Design"],"ans":"Container management"},
{"q":"Virtualization is?","opt":["Virtual system","Real system","None"],"ans":"Virtual system"},
{"q":"Azure is?","opt":["Cloud platform","Game","Tool"],"ans":"Cloud platform"},
{"q":"GCP is?","opt":["Cloud","Database","UI"],"ans":"Cloud"},
{"q":"CI/CD is?","opt":["Automation","Manual","None"],"ans":"Automation"}
],

"UI/UX Designer": [
{"q":"UI means?","opt":["User Interface","User Input","None"],"ans":"User Interface"},
{"q":"UX means?","opt":["User Experience","User Extra","None"],"ans":"User Experience"},
{"q":"Wireframe is?","opt":["Layout","Code","Database"],"ans":"Layout"},
{"q":"Prototype is?","opt":["Model","Final","None"],"ans":"Model"},
{"q":"Figma is?","opt":["Design tool","Language","DB"],"ans":"Design tool"},
{"q":"User research is?","opt":["Study users","Ignore","None"],"ans":"Study users"},
{"q":"Typography is?","opt":["Text design","Image","Code"],"ans":"Text design"},
{"q":"Testing is?","opt":["Check design","Delete","Ignore"],"ans":"Check design"}
],

"Mobile App Developer": [
{"q":"Android SDK is?","opt":["Tool","DB","UI"],"ans":"Tool"},
{"q":"Flutter is?","opt":["Framework","Language","Tool"],"ans":"Framework"},
{"q":"API is?","opt":["Interface","Database","Server"],"ans":"Interface"},
{"q":"Debugging is?","opt":["Fix errors","Create app","Delete"],"ans":"Fix errors"},
{"q":"Kotlin is?","opt":["Language","DB","UI"],"ans":"Language"},
{"q":"Swift is?","opt":["Language","Tool","DB"],"ans":"Language"},
{"q":"React Native is?","opt":["Framework","Language","DB"],"ans":"Framework"},
{"q":"UI means?","opt":["Interface","Code","DB"],"ans":"Interface"}
],

"Game Developer": [
{"q":"Unity is?","opt":["Game engine","Language","DB"],"ans":"Game engine"},
{"q":"Unreal engine is?","opt":["Game engine","Tool","DB"],"ans":"Game engine"},
{"q":"2D game means?","opt":["Flat","3D","None"],"ans":"Flat"},
{"q":"Rendering is?","opt":["Display","Delete","Ignore"],"ans":"Display"},
{"q":"Physics in game?","opt":["Real movement","Fake","None"],"ans":"Real movement"},
{"q":"C# is?","opt":["Language","Tool","DB"],"ans":"Language"},
{"q":"Assets are?","opt":["Resources","Code","DB"],"ans":"Resources"},
{"q":"Animation is?","opt":["Movement","Stop","None"],"ans":"Movement"}
],

"DevOps Engineer": [
{"q":"DevOps is?","opt":["Development+Operations","Design","None"],"ans":"Development+Operations"},
{"q":"CI/CD is?","opt":["Automation","Manual","None"],"ans":"Automation"},
{"q":"Docker is?","opt":["Container","DB","UI"],"ans":"Container"},
{"q":"Jenkins is?","opt":["Tool","Language","DB"],"ans":"Tool"},
{"q":"Terraform is?","opt":["IaC tool","Game","DB"],"ans":"IaC tool"},
{"q":"Monitoring is?","opt":["Track system","Delete","Ignore"],"ans":"Track system"},
{"q":"Logging is?","opt":["Record data","Delete","Ignore"],"ans":"Record data"},
{"q":"AWS used for?","opt":["Cloud","Game","DB"],"ans":"Cloud"}
],

"Blockchain Developer": [
{"q":"Blockchain is?","opt":["Distributed ledger","DB","UI"],"ans":"Distributed ledger"},
{"q":"Smart contract is?","opt":["Auto contract","Manual","None"],"ans":"Auto contract"},
{"q":"Ethereum is?","opt":["Platform","Game","DB"],"ans":"Platform"},
{"q":"Web3 is?","opt":["Decentralized web","Normal web","None"],"ans":"Decentralized web"},
{"q":"Bitcoin is?","opt":["Crypto","Game","DB"],"ans":"Crypto"},
{"q":"Mining is?","opt":["Validation","Delete","Ignore"],"ans":"Validation"},
{"q":"Gas fee is?","opt":["Transaction fee","Free","None"],"ans":"Transaction fee"},
{"q":"DeFi is?","opt":["Finance","Game","DB"],"ans":"Finance"}
]
}

def get_random_questions(career):
    return random.sample(quiz_data.get(career, []), 7)