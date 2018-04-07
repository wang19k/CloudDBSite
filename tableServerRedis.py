from flask import Flask, request, session, url_for, redirect, \
     render_template, abort, g, flash, _app_ctx_stack, make_response, \
     redirect, Response
from flask_socketio import SocketIO, emit, send, join_room, leave_room, close_room, rooms, disconnect
import time
from threading import Lock
import redis as _redis
import json
import hashlib
import sys
import gevent
import ast
#gevent.monkey.patch_all()


app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
#socketio = SocketIO(app, async_mode=None)
#thread = None
#thread_lock = Lock()
# TODO when redis refreshes, so do I; make a LRU cache

# "DemoCloudDB:newline"
# "[465.5,134.5,468,134]" 
html_posts = []

def redis_link():
    return _redis.StrictRedis(host="clouddb.appinventor.mit.edu", port=6381, db=0,
                              password="private", ssl=True)
    #return _redis.Redis(host='localhost', port=6379, db=0)

def get_project_data():
    r = redis_link()
    keys = r.keys('*')
    print(keys)
    # html_posts = []
    for key in keys:
        key = key.decode("utf-8")
        print(key)
        # name, tag = key.split(":")
        # posts = r.zrange(key, 0, -1, withscores=True)
        # posts = r.get(key)
        #for i in range(len(posts)):
        postd = {"projectid": key, #name,
                 "tag": "TODO", #tag,
                 "value": "TODO", #posts.decode("utf-8"), #posts[i][0].decode("utf-8"),
                 "updated": str(int(round(time.time() * 1000))), #posts[i][1],
                 "type": "TODO"}#get_list_type(posts.decode("utf-8"))} #type(ast.literal_eval(posts))}
        html_posts.append(postd)
    return html_posts

def get_list_type(string):
    #print(ast.literal_eval(string))
    if string[0] == "[":
        return "List"
    else:
        return "String"

def event_stream():
    pubsub = redis_link().pubsub()
    pubsub.psubscribe("*")
    #pubsub.psubscribe("__keyspace@0__:*")
    while True:
        for message in pubsub.listen():
            print(message)
            channel = message['channel'].decode("utf-8")
            if "*" in channel:
                print("True")
            if "Player" in channel or "Space" in channel or "Paint" in channel or "Pong" in channel or "Magic" in channel or "magic" in channel or "space" in channel or "pong" in channel or "paint" in channel:
                data = message['data'].decode("utf-8")
                print(data)
                tag, value = ast.literal_eval(data)
                print(tag, value)
                chan_ind = channel.rfind("-") + 1
                postd = {"projectid": channel[chan_ind:],
                 "tag": tag,
                 "value": value,
                 "updated": str(int(round(time.time() * 1000))),
                 "type": str(type(value).__name__)}
                html_posts.append(postd)
                return 'data: %s\n\n' % json.dumps(postd)
                #yield 'data: %s\n\n' % message['data']

@app.route('/stream')
def stream():
    return Response(event_stream(),
                          mimetype="text/event-stream")

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
