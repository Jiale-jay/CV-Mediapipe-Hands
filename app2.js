const video = document.getElementById('video');
const output = document.getElementById('output');

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
            const gesture = recognizeDigit(landmarks);
            output.innerText = `识别数字: ${gesture}`;
        } else {
            output.innerText = '未检测到手势';
        }
        requestAnimationFrame(detectHands);
    };
    detectHands();
}

function recognizeDigit(landmarks) {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const thumbFolded = isFingerFolded(thumbTip, landmarks[3]);
    const indexExtended = isFingerExtended(indexTip, landmarks[7]);
    const middleExtended = isFingerExtended(middleTip, landmarks[11]);
    const ringExtended = isFingerExtended(ringTip, landmarks[15]);
    const pinkyExtended = isFingerExtended(pinkyTip, landmarks[19]);

    if (!thumbFolded && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        return 1;  // 表示数字“1”
    } else if (!thumbFolded && indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
        return 2;  // 表示数字“2”
    } else if (!thumbFolded && indexExtended && middleExtended && ringExtended && !pinkyExtended) {
        return 3;  // 表示数字“3”
    } else if (thumbFolded && indexExtended && middleExtended && ringExtended && pinkyExtended) {
        return 4;  // 表示数字“4”
    } else if (!thumbFolded && indexExtended && middleExtended && ringExtended && pinkyExtended) {
        return 5;  // 表示数字“5”
    } else {
        return '未知手势';
    }
}

function isFingerExtended(tip, joint) {
    return tip[1] < joint[1];
}

function isFingerFolded(tip, joint) {
    return tip[1] > joint[1];
}

main();