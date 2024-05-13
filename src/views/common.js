export const KEY_RTSS = "rtss"
export const KEY_QSS = "qss"

export const QSS_INFO_KEY_QID = "query_id"
export const QSS_INFO_KEY_TID = "task_id"
export const QSS_INFO_KEY_FPS = "fps"
export const QSS_INFO_KEY_RESOL = "resol"
export const QSS_INFO_KEY_SERVMAP = "serv_map"
export const QSS_INFO_KEY_RESULT = "task_result"
export const QSS_INFO_KEY_QUERY_CTX = "query_ctx"
export const QSS_SNIFF_KEY_SERV_DELAY = "serv_delay"
export const QSS_SNIFF_KEY_TRANS_DELAY = "trans_delay"
export const QSS_SNIFF_KEY_QUEUE_DELAY = "queue_delay"
export const QSS_SNIFF_KEY_OBJ_COUNT = "n_obj"
export const QSS_SNIFF_KEY_TOTAL_DELAY = "tot_delay"

export const RESULT_KEY_ZH = {
    "black": "黑色车",
    "grey": "灰色车",
    "white": "白色车",
    "other": "其他色车",
    "total": "总人数",
    "up": "抬头人数"
}

const static_qss = {
    [QSS_INFO_KEY_QID]: 'ABCD-12',
    [QSS_INFO_KEY_TID]: 'task-id',

    [QSS_INFO_KEY_FPS]: 10,
    [QSS_INFO_KEY_RESOL]: 'DVCHD_720p(4:3)',
    [QSS_INFO_KEY_SERVMAP]: {
        'car_detection_yolov5': 'node1',
        'iic_service': 'node0'
    },

    [QSS_INFO_KEY_RESULT]: {
        'black': 1,
        'grey': 1,
        'white': 2,
        'other': 3
    },

    [QSS_INFO_KEY_QUERY_CTX]: {
        [QSS_SNIFF_KEY_SERV_DELAY]: {
            'car_detection_yolov5': 0.11212,
            'iic_service': 0.5556
        },
        [QSS_SNIFF_KEY_TRANS_DELAY]: {
            'car_detection_yolov5': 0.11212,
            'iic_service': 0.5556
        },
        [QSS_SNIFF_KEY_QUEUE_DELAY]: {
            'car_detection_yolov5': 0.11212,
            'iic_service': 0.5556
        },
        [QSS_SNIFF_KEY_OBJ_COUNT]: 7,
        [QSS_SNIFF_KEY_TOTAL_DELAY]: 0.33636
    }
}

export const RTSS_INFO_KEY_RTSS_ID = "rtss_id"
export const RTSS_INFO_KEY_NID = "node_id"
export const RTSS_INFO_KEY_CPU = "cpu%"
export const RTSS_INFO_KEY_MEM = "mem%"
export const RTSS_INFO_KEY_UPLINK = "uplink(KBps)"
export const RTSS_INFO_KEY_DWLINK = "dwlink(KBps)"
export const RTSS_INFO_KEY_UPBW = "upbw(KBps)"
export const RTSS_INFO_KEY_DWBW = "dwbw(KBps)"

const static_rtss = {
    [RTSS_INFO_KEY_RTSS_ID]: 'node1-1708908682',
    [RTSS_INFO_KEY_NID]: 'node1',
    [RTSS_INFO_KEY_CPU]: 26.45,
    [RTSS_INFO_KEY_MEM]: 62.6,
    [RTSS_INFO_KEY_UPLINK]: 1234,
    [RTSS_INFO_KEY_DWLINK]: 1234,
    [RTSS_INFO_KEY_UPBW]: {
        'node0': 2345
    },
    [RTSS_INFO_KEY_DWBW]: {
        'node0': 5678
    }
}

export const STATIC_RESULT = {
    [KEY_QSS]: {
        'abcd': [static_qss, static_qss, static_qss, static_qss]
    },
    [KEY_RTSS]: {
        'node0': [static_rtss, static_rtss, static_rtss],
        'node1': [static_rtss, static_rtss, static_rtss, static_rtss, static_rtss, static_rtss]
    }
}

export const CTX_RESP_KEY_CTX = "ctx_dict"
export const CTX_KEY_ID = "ctx_id"
export const CTX_KEY_AVG_BIAS = "avg_bias"
export const CTX_KEY_PID_PARAM = "pid_param"

export const CTX_KEY_SIMPLE_DC_LAT_SERIES = "lat_series"
export const CTX_KEY_AIMD_LAT_SERIES = "chunk_avg_tot_delay_series"
export const CTX_KEYS_LIST_LAT_SERIES = [CTX_KEY_SIMPLE_DC_LAT_SERIES, CTX_KEY_AIMD_LAT_SERIES];

export const CTX_KEY_AVG_NOBJ = "avg_nobj"

export const CTX_KEY_AVG_SERV_INPUT_SZ_DICT = "avg_serv_input_sz_dict"
export const CTX_KEY_AVG_EDGE_BW_KBps = "avg_edge_bw_KBps"

const static_sched_ctx = {
    [CTX_KEY_ID]: 's-s-id',
    [CTX_KEY_AVG_BIAS]: [-0.234, -0.034, 0.234],
    
    [CTX_KEY_AIMD_LAT_SERIES]: [0.434, 0.234, 0.434],
    [CTX_KEY_SIMPLE_DC_LAT_SERIES]: [0.434, 0.234, 0.434],
    
    [CTX_KEY_AVG_NOBJ]: 5.14,
    'avg_obj_sz': 511.1,
    'avg_frame_sz': 1515.1,
    [CTX_KEY_AVG_EDGE_BW_KBps]: 51655.55,
    [CTX_KEY_AVG_SERV_INPUT_SZ_DICT]: {
        'car_detection_yolov5': 23.456,
        'iic_service': 1.012
    }
}

export const STATIC_SCHED_CTX = {
    [CTX_RESP_KEY_CTX]: {
        "6XEDL": [static_sched_ctx, static_sched_ctx, static_sched_ctx, static_sched_ctx]
    }
}

export const STATIC_SUBMITED_JOB_DICT = {
    'OMIHR': {
        'job_id': 'OMIHR',
        'selectedIp': 'OMIHR',
        'type': '会议室人脸检测视频', 
        'selectedVideoId': 'v0', 
        'mode': 'latency',
        'scheduler_name': '分级具身智能方法',
        'delay_constraint': 0.2,
        'acc_constraint': 0.8
    },
    // 'MBAX5': {
    //     'job_id': 'MBAX5',
    //     'selectedIp': 'MBAX5',
    //     'type': '双车道车流视频（快速路）', 
    //     'selectedVideoId': 'v3', 
    //     'mode': 'latency',
    //     'scheduler_name': '建模控制方法',
    //     'delay_constraint': 0.2,
    //     'acc_constraint': 0.8
    // }
}

export const DAG_KEY_NAME = "name";
export const DAG_KEY_DAG = "dag";

export const STATIC_DAG_DICT = {
    "static_pipe0": {
        [DAG_KEY_NAME]: "车流分类(pipe0)",
        [DAG_KEY_DAG]: {
            "car_detection_yolov5": ["iic_service"],
            "iic_service": []
        }
    },
    "static_pipe1": {
        [DAG_KEY_NAME]: "人脸姿态估计(pipe1)",
        [DAG_KEY_DAG]: {
            "face_detection": ["face_alignment"],
            "face_alignment": []
        }
    }
};

export const STATIC_SCHEDULER_DICT = {
    "SimpleDC(test)": {
        "classname": "SimpleDCLatFirstPID",
        "modulepath": "control_plane.scheduler_func.kb_pid.simple_DC_lat_first_pid",
        "description": "建模控制方法(test)",
    },
    "DRL+AIMD(test)": {
        "classname": "AIMDPlanner",
        "modulepath": "control_plane.scheduler_func.aimd.provider",
        "description": "分级具身智能方法(test)"
    }
};

export const STATIC_NODE_VIDEO_INFO = {
    "192.168.56.102:7000": {
        "0": {
            "description": "高架桥车流视频"
        },
        "1": {
            "description": "双车道车流视频（公交站附近）"
        },
        "3":{
            "description": "双车道车流视频（快速路）"
        },
    },
    "192.168.56.102:8000": {
        "0": {
            "description": "会议室人脸检测视频"
        },
        "1": {
            "description": "课堂人脸检测视频"
        }
    },
    "192.168.56.102:9000": {
        "0": {
            "description": "traffic flow"
        },
        "1": {
            "description": "people indoor"
        }
    },
};