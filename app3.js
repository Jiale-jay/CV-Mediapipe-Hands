const video = document.getElementById('video');
const output = document.getElementById('output');

let wavingDetectedCount = 0;
const wavingThreshold = 5;  // 设置检测到招手手势的次数阈值

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function main() {
    await setupCamera();
    const model = await handpose.load();
    
    const detectHands = async () => {
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            const landmarks = predictions[0].landmarks;
            const gesture = recognizeGesture(landmarks);
            if (gesture === 'waving') {
                wavingDetectedCount++;
                if (wavingDetectedCount > wavingThreshold) {
                    output.innerText = '检测到招手手势！可能有乘客需要乘车';
                }
            } else {
                wavingDetectedCount = 0;
                output.innerText = `识别手势: ${gesture}`;
            }
        } else {
            output.innerText = '未检测到手势';
        }
        requestAnimationFrame(detectHands);
    };
    detectHands();
}

function recognizeGesture(landmarks) {
    // 简单示例：如果所有手指伸直，表示招手手势
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const thumbExtended = isFingerExtended(thumbTip, landmarks[3]);
    const indexExtended = isFingerExtended(indexTip, landmarks[7]);
    const middleExtended = isFingerExtended(middleTip, landmarks[11]);
    const ringExtended = isFingerExtended(ringTip, landmarks[15]);
    const pinkyExtended = isFingerExtended(pinkyTip, landmarks[19]);

    if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
        return 'waving';  // 表示招手手势
    } else {
        return 'none';
    }
}

function isFingerExtended(tip, joint) {
    return tip[1] < joint[1];
}

main();