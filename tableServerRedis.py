from flask import Flask, request, session, url_for, redirect, \
     render_template, abort, g, flash, _app_ctx_stack, make_response, \
     redirect, Response
from flask_socketio import SocketIO, emit, send, join_room, leave_room, close_room, rooms, disconnect
from time import time
from threading import Lock
import redis as _redis
import json
import hashlib
import sys
import gevent
#gevent.monkey.patch_all()


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
#socketio = SocketIO(app, async_mode=None)
#thread = None
#thread_lock = Lock()

def redis_link():
    return _redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
    # return _redis.Redis(host='localhost', port=6379, db=0)

def get_project_data():
    r = redis_link()
    keys = r.keys('*')
    html_posts = []
    for key in keys:
        print(key)
        key = key.decode("utf-8")
        name, tag = key.split("High")
        tag = "High " + tag
        posts = r.zrange(key, 0, -1, withscores=True)
        for i in range(len(posts)):
    	    postd = {"projectid": name, 
    	    "tag": tag, 
    	    "value": posts[i][0].decode("utf-8"), 
    	    "updated": posts[i][1],
    	    "type": "Integer"}
    	    html_posts.append(postd)
    return html_posts

def event_stream():
    pubsub = redis_link().pubsub()
    pubsub.psubscribe("__keyspace@0__:*")
    while True:
        for message in pubsub.listen():
            if message['data'] == b"zadd":
                print(message)
                return 'data: %s\n\n' % message['data']
                #yield 'data: %s\n\n' % message['data']

@app.route('/stream')
def stream():
    return Response(event_stream(),
                          mimetype="text/event-stream")
    

"""class RedisLiveData:
    def __init__(self, channel_name):
        self.channel_name = channel_name
        self.redis_conn = redis_link()
        pubsub = self.redis_conn.pubsub()
        gevent.spawn(self.sub, pubsub)
    def sub(self,pubsub):
        pubsub.subscribe(self.channel_name)
        for message in pubsub.listen():
            gevent.spawn(process_rcvd_mesg, message['data'])

def process_rcvd_mesg(mesg):
    print("Received new message %s " % mesg)

g = RedisLiveData("test_channel")"""

"""def exchangeData():
    Example of how to send server generated events to clients.
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        socketio.emit('exchangeData', {'refresh'})

@socketio.on('connect', namespace='/test')
def test_connect():
    exchangeData()
    #t_exchangeData = Thread(target=exchangeData).start() 

@socketio.on('my event', namespace='/test')                          # Decorator to catch an event called "my event":
def test_message(message):                        # test_message() is the event callback function.
    socketio.emit('my response', {'data': 'got it!'})"""

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
