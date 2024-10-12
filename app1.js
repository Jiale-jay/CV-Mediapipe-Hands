const video = document.getElementById('video');
const output = document.getElementById('output');
const canvas = document.getElementById('canvas');
const snapshot = document.getElementById('snapshot');
const ctx = canvas.getContext('2d');

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
            if (gesture === 'shutter') {
                takeSnapshot();
            }
            output.innerText = `识别手势: ${gesture}`;
        } else {
            output.innerText = '未检测到手势';
        }
        requestAnimationFrame(detectHands);
    };
    detectHands();
}

function recognizeGesture(landmarks) {
    // 简单示例：如果拇指和食指接触，表示触发快门
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const distance = Math.sqrt(
        Math.pow(thumbTip[0] - indexTip[0], 2) +
        Math.pow(thumbTip[1] - indexTip[1], 2)
    );
    if (distance < 30) {  // 距离阈值，可根据实际情况调整
        return 'shutter';
    } else {
        return 'none';
    }
}

function takeSnapshot() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    snapshot.src = dataUrl;
}

main();