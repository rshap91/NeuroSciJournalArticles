# Project4 NeuroJournals App
'''
Dropdown of 15 Topics
Field That returns a Random Article whose max topic is that topic

Two d3 Viz:
	- Barchart showing values for each topic relating to that article
	- Heatmap that maps wordcounts for each of the 25 words in each of 15 topics

'''
from sys import stderr, stdout
import numpy as np
import pandas as pd
import cPickle as pickle

from gensim.summarization import summarize, keywords

from flask_pymongo import PyMongo
#from flask.ext.pymongo import PyMongo

from flask import Flask, render_template, jsonify, request, redirect, send_from_directory, url_for





# --------------- DATABASE FUNCTIONS ------------------


#client = mongo.MongoClient()
# db = client.get_database('project4')
# journals = db.collection_names()


app = Flask('project4')
mongo = PyMongo(app)
#app.config['MONGO_DBNAME'] = 'project4'

db = None
journals = None
with app.app_context():
	db = mongo.db
	journals = mongo.db.collection_names()


print('DATABASE:', db)

# --------------- Components  & Topic Model ------------------

cdf = pd.read_csv('static/components_df_mini.csv', index_col = 0)

with open('static/nmf.pkl', 'rb') as f:
    nmf = pickle.load(f)

with open('static/cvectr.pkl') as f:
    cvectr = pickle.load(f)

topics = ['Coding_Latex', "Genetics", 'Psychiatric_Disorder', 'Attention', 'ImmuneSystem_Cancer',
        'Neurons', 'Animal_Experiments', 'Alzheimers_Dementia_Parkinson',  'Sleep',
        "Dependency", "Pain_MotorFunction", 'Stroke_Aneurysm_Damage', 'Developmental_Disorders', 
        'Brain_Mapping', 'Memory']




@app.route("/")
def index():
    """
    Homepage: serve our visualization page, index.html
    # does it know to look in templates??
    """
    return render_template("index.html")



@app.route('/summarize/', methods=['GET','POST'])
def summarizePage():
    if request.method == 'GET':
        return render_template('summarize.html')

    txt = request.get_json(force=True)['txt']

    cdf['count'] = [txt.count(w) for w in cdf.word.values]

    summary = summarize(txt)

    vectorized = cvectr.transform([txt])

    topic_transformed = nmf.transform(vectorized)
    topicDF = pd.DataFrame(topic_transformed, columns = topics)

    floatCols = topicDF.columns[topicDF.dtypes == 'float64']

    topicDF['Max_Topic_Name'] = topicDF[floatCols].apply(lambda row: row.sort_values(ascending = False)[:1].index[0], axis = 1)
    topicDF['Max_Topic_Val'] = topicDF[floatCols].apply(lambda row: row.sort_values(ascending = False)[0], axis = 1)



    rdic = {'result':topicDF.to_dict(), 'summary':summary, 'cdf':list(cdf.T.to_dict().values())}
    return jsonify(rdic)


@app.route("/explore/", methods=["GET","POST"])
def RandomDocument():
    if request.method == "GET":
        return render_template("TopicBreakDown.html")

    '''
    Retrieve a random document from our database that has a max_topic value matching the one from the ajax request
    '''
    # find all articles in all journals that have our max_topic
    all_matches = {}
    # request obj is implicit with ajax call
    jdata = request.get_json(force=True)
    topic = jdata['topic']
    print(topic)
    for jnl in journals:
        collec = db.get_collection(jnl)
        cur = collec.find({'Max_Topic_Name': topic}, {'_id':1})
        all_matches[jnl] = list(cur)
    
    # only use journals that have at least 1 article
    all_matches = {k:v for k,v in all_matches.items() if v}
    print(len(all_matches))
    # choose randomly from remainging journals
    rand_jnl = np.random.choice(list(all_matches.keys()))
    print(rand_jnl)
    # choose a random_id from our selections in this journal
    rand_id = np.random.choice(all_matches[rand_jnl])['_id']
    col = db.get_collection(rand_jnl)
    # retrieve it
    result = col.find({'_id': rand_id},{'_id':0})[0]
    txt = result['text']
    
    # use gensim to find keywords and summarize
    summary = summarize(txt.replace('\n', ' '), ratio = 0.1, split = True)
    try:
        if '===' in summary[0]:
            summary = summary[1:]
    except:
        summary = summarize(txt.replace('\n',' '), ratio = 0.25, split = True)
    summary = '\n\n'.join(summary)
    # count number of occurences of component words
    cdf['count'] = [txt.count(w) for w in cdf.word.values]
    
    results = {'journal': rand_jnl, 'result': result, 'summary':summary, 'cdf':list(cdf.T.to_dict().values())}
    return jsonify(results)

#--------- RUN WEB APP SERVER ------------#

# Start the app server
if __name__ == '__main__':
    app.run(host= '0.0.0.0', port = 8888, debug = True)

