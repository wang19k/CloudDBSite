from flask import Flask, request, session, url_for, redirect, \
     render_template, abort, g, flash, _app_ctx_stack, make_response, \
     redirect
from time import time
import redis as _redis
import json
import hashlib
import sys

app = Flask(__name__)

def redis_link():
    return _redis.StrictRedis(host='localhost', port=6379, db=0)

def get_project_data():
    r = redis_link()
    keys = r.keys('*')
    html_posts = []
    for key in keys:
    	posts = r.zrange(key, 0, -1, withscores=True)
    	for i in range(len(posts)):
    		postd = {"projectid": key, 
    		"tag": "High Score", 
    		"value": posts[i][0], 
    		"updated": posts[i][1],
    		"type": "Integer"}
    		html_posts.append(postd)
    #print(html_posts)
    return html_posts

@app.route('/')

@app.route('/index')
def timeline():
    return render_template('index.html',
                            project_data=get_project_data())

if __name__ == '__main__':
   app.run(debug=True)
