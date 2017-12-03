from flask import Flask, request, session, url_for, redirect, \
     render_template, abort, g, flash, _app_ctx_stack, make_response, \
     redirect
from flask_socketio import SocketIO, emit, send, join_room, leave_room, close_room, rooms, disconnect
from time import time
from threading import Lock
import redis as _redis
import json
import hashlib
import sys


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
#socketio = SocketIO(app)
#thread = None
#thread_lock = Lock()

def redis_link():
    return _redis.StrictRedis(host='localhost', port=6379, db=0)

def get_project_data():
    r = redis_link()
    keys = r.keys('*')
    html_posts = []
    for key in keys:
        name, tag = key.split("High")
        tag = "High " + tag
    	posts = r.zrange(key, 0, -1, withscores=True)
    	for i in range(len(posts)):
    		postd = {"projectid": name, 
    		"tag": tag, 
    		"value": posts[i][0], 
    		"updated": posts[i][1],
    		"type": "Integer"}
    		html_posts.append(postd)
    return html_posts

"""@socketio.on('ping')
def ping_pong():
    emit('pong')


@socketio.on('connect')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
    emit('my_response', {'data': 'Connected', 'count': 0})


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected', request.sid)"""

@app.route('/')

@app.route('/index')
def timeline():
    return render_template('index.html',
                            project_data=get_project_data())

@app.route('/cloud')
def cloud():
    return render_template('cloud.html',
                            project_data=get_project_data())

if __name__ == '__main__':
    app.run(debug=True)
    #socketio.run(app, debug=True)
