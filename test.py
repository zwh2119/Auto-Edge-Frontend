from flask import Flask, jsonify, request

app = Flask(__name__)

# 一个简单的 GET 请求示例
@app.route('/task', methods=['GET'])
def get_content():
    # 这里可以根据需要生成内容
    content = {
        "road-detection":"路面监控",
        "audio":"音频分类",
        "imu":"惯性轨迹感知",
        "edge-eye":"工业视觉纠偏"
    }
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
        'state': 'fail',
        'msg': '失败'
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
