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


app = Flask(__name__)
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'secret_xxx' # TODO
)

#html_posts = []

def redis_link(token):
    return _redis.StrictRedis(host="clouddb.appinventor.mit.edu", port=6381, db=0,
                              password=token, ssl=True)
    # return _redis.Redis(host='localhost', port=6379, db=0)

def get_project_data():
    token = session['password']
    try:
        r = redis_link(token)
    except:
        # Not a valid token
        print("invalid token")
        return redirect('/login')
    try:
        projectid = session['key']
    except:
        return
    keys = r.keys(projectid+':*')
    print(keys)
    html_posts = []
    for key in keys:
        key = key.decode("utf-8")
        print(key)
        value = r.get(key).decode("utf-8")
        # posts = r.zrange(key, 0, -1, withscores=True)
        #for i in range(len(posts)):
        postd = {"projectid": projectid,
                 "tag": key.split(":")[1],
                 "value": value, #posts.decode("utf-8"), #posts[i][0].decode("utf-8"),
                 "updated": str(int(round(time.time() * 1000))), #posts[i][1],
                 "type": str(type(value).__name__)}
        html_posts.append(postd)
    return html_posts

def event_stream():
    token = session['password']
    try:
        r = redis_link(token)
    except:
        # Not a valid token
        print("invalid token")
        return redirect('/login')
    pubsub = r.pubsub()
    #pubsub.psubscribe("*")
    try:
        projectid = session['key']
    except:
        return
    pubsub.subscribe(projectid)
    while True:
        message = pubsub.get_message(ignore_subscribe_messages=True)
        print(message)
        if message is not None:
            #for message in pubsub.listen():
                #print(message)
            channel = message['channel'].decode("utf-8")
            if projectid in channel:
                print(message['data'])
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
                # html_posts.append(postd)
                return 'data: %s\n\n' % json.dumps(postd)
        else:
            time.sleep(.001)
            #yield 'data: %s\n\n' % message['data']

@app.route('/')
def home():
    # Default goes to the log version.
    # First checks if the user has "logged in" with their token.
    if 'password' not in session:
        return redirect('/login')
    return render_template('index.html', project_data = get_project_data())

@app.route('/index')
@app.route('/index.html')
def timeline():
    """Sends the user to the log version of the page."""
    # First checks if the user has "logged in" with their token,
    if 'password' not in session:
        return redirect('/login')
    return render_template('index.html', project_data = get_project_data())

@app.route('/cloud')
@app.route('/cloud.html')
def cloud():
    """Sends the user to the cloud version of the page."""
    # Also checks if the user has "logged in" with their token.
    if 'password' not in session:
        return redirect('/login')
    return render_template('cloud.html', project_data = get_project_data())

@app.route('/login.html', methods=['POST', 'GET'])
@app.route('/login', methods=['POST', 'GET'])
def login():
    """Renders the login page. When the user clicks submit, checks for valid
        token and projectID and stores them in the session. The token is used
        to open a valid redis link."""
    error = None
    if request.method == 'POST':
        #session['user'] = request.form['username']
        # username = request.form['username']
        token = request.form['token']
        projectid = request.form['projectid']
        # for AUTH Token for Redis Server
        #session['password'] = request.form['token']
        if token == "" or projectid == "":
            error = 'Missing Fields'
            flash('Missing Fields')
        else:
            session['password'] = token
            session['key'] = projectid
            print(token, projectid)
            return redirect(request.form["next"])
    return render_template('login.html', error=error)

@app.route('/stream')
def stream():
    return Response(event_stream(),
                          mimetype="text/event-stream")

if __name__ == '__main__':
    app.run()
    #socketio.run(app, debug=True)
