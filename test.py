from flask import Flask, jsonify, request

app = Flask(__name__)

# 一个简单的 GET 请求示例
@app.route('/task', methods=['GET'])
def get_content():
    # 这里可以根据需要生成内容
    content = [
        {"road-detection":"路面监控"},
        {"audio":"音频分类"},
        {"imu":"惯性轨迹感知"},
        {"edge-eye":"工业视觉纠偏"}
    ]
    return jsonify(content), 200

@app.route('/get_service_list', methods=['GET'])
def get_service_list():
    # 这里可以根据需要生成内容
    content = ["road-detection","audio","imu","edge-eye"]
    return jsonify(content), 200

@app.route('/install_state', methods=['GET'])
def install_state():
    # 这里可以根据需要生成内容
    content = {'state':'uninstall'}
    return jsonify(content), 200
@app.route('/node/get_video_info', methods=['GET'])
def get_video_info():
    # 这里可以根据需要生成内容
    content = [
        {
            "source_label": "car",
            "source_name": "交通监控摄像头",
            "source_type": "视频流",
            "camera_list":[
                {
                    "name": "摄像头1",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口",
                    "resolution": "1080p",
                    "fps":"25fps"
                },
                {
                    "name": "摄像头2",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口2",
                    "resolution": "1080p",
                    "fps":"15fps"
                }
            ]
        },
        {
            "source_label": "imu",
            "source_name": "交通监控摄像头",
            "source_type": "视频流",
            "camera_list":[
                {
                    "name": "摄像头1",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口",
                    "resolution": "1080p",
                    "fps":"25fps"

                },
                {
                    "name": "摄像头2",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口2",
                    "resolution": "1080p",
                    "fps":"15fps"
                }
            ]


        },
        {
            "source_label": "car",
            "source_name": "交通监控摄像头",
            "source_type": "视频流",
            "camera_list":[
                {
                    "name": "摄像头1",
                    "url": "rtsp/114.212.81.11/video1",
                    "describe":"某十字路口",
                    "resolution": "1080p",
                    "fps":"25fps"
                },
                {
                    "name": "摄像头2",
                    "url": "rtsp/114.212.81.11/video1",
                    "describe":"某十字路口2",
                    "resolution": "1080p",
                    "fps":"15fps"
                }
            ]
        },
        {
            "source_label": "imu",
            "source_name": "交通监控摄像头",
            "source_type": "视频流",
            "camera_list":[
                {
                    "name": "摄像头1",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口",
                    "resolution": "1080p",
                    "fps":"25fps"

                },
                {
                    "name": "摄像头2",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口2",
                    "resolution": "1080p",
                    "fps":"15fps"
                }
            ]


        }

    ]
    return jsonify(content), 200

@app.route('/query_state', methods=['GET'])
def query_state():
    # 这里可以根据需要生成内容
    content = {'state':'close','source_label':'car'}
    return jsonify(content), 200


@app.route('/get_execute_url/<service>', methods=['GET'])
def get_execute_url(service):
    # 这里可以根据需要生成内容
    content = [
        {
            "ip":"114.212.81.11",
            "hostname":"edge1",
            "cpu":"20%",
            "memory":"20%",
            "bandwidth":"1MB/s",
            "age":"10m",
        }
    ]
    return jsonify(content), 200

@app.route('/get_task_stage/<task>', methods=['GET'])
def get_task_stage(task):
    # 这里可以根据需要生成内容
    content = [
        {
            'stage_name':'face_detection',
            'image_list':[
                {
                    'image_name':'onecheck/face_detection:v1',
                    "url":"123123123"
                },
                {
                    'image_name':'onecheck/face_detection2:v2',
                    "url":"123123123"
                }
            ]
        },
        {
            'stage_name':'face_detection2',
            'image_list':[
                {
                    'image_name':'onecheck/face_detection:v2',
                    "url":"123123123"
                },
            ]
        },
    ]
    return jsonify(content), 200


@app.route('/install', methods=['POST'])
def post_content():

    # 这里可以根据用户输入进行处理
    # 假设我们简单地将输入返回给用户
    response = {
        'state': 'success',
        'msg': '成功'
    }
    return jsonify(response), 200
@app.route('/stop_query', methods=['POST'])
def stop_query():

    # 这里可以根据用户输入进行处理
    # 假设我们简单地将输入返回给用户
    response = {
        'state': 'success',
        'msg': '成功'
    }
    return jsonify(response), 200
@app.route('/query/submit_query', methods=['POST'])
def submit_query():

    # 这里可以根据用户输入进行处理
    # 假设我们简单地将输入返回给用户
    response = {
        'state': 'success',
        'msg': '成功'
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
