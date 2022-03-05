from flask import Flask 
from flask_socketio import SocketIO, send
from setInterval import setInterval
from ros_wrapper import emitter
import rospy
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app, cors_allowed_origins='*')

args = [socketio]
interval = setInterval(emitter, 2, args, False)

@socketio.on('start')
def handleStart(message):
    dimensions = json.loads(message)
    interval.start(dimensions)

@socketio.on('stop')
def handleStop(message):
    print(message)
    interval.stop()


if __name__ == '__main__':
    # rospy.init_node("laser_scan_crane")
    socketio.run(app)