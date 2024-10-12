# CV-Mediapipe-Hands
2D手势识别方法

Mediapipe Hands
https://openaccess.thecvf.com/content_CVPR_2020/papers/Xu_GHUM__GHUML_Generative_3D_Human_Shape_and_Articulated_Pose_CVPR_2020_paper.pdf
https://ai.googleblog.com/2019/08/on-device-real-time-hand-tracking-with.html
https://drive.google.com/file/d/1-rmIgTfuCbBPW_IFHkh3f0-U_lnGrWpg/view
https://google.github.io/mediapipe/solutions/hands
https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
Mediapipe Hands是Tensorflow.js内置的2D手势识别方法，提供了一个在web端进行轻量AI部署姿态估计的能力。我们需要你用Tf.js的Hands能力搭建一个简单的下游任务：相机手掌快门识别。
该任务是基于Hand Pose Estimation的Gesture Recognition任务，要求你识别数字手势，并且在web显示对应的数字。
该小模块有概率能够应用于行车摄像头检测“招手即来”Taxi服务的顾客，并通过该小模块提醒司机前方可能有乘客有乘车需求。
