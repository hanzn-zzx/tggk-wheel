const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

// 奖品数组和颜色
const segments = ["同甘", "共苦", "你苦", "我苦"];
const segmentColors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"];

const numSegments = segments.length;
const anglePerSegment = (2 * Math.PI) / numSegments; // 每个奖品占据的角度
let currentAngle = 0; // 当前旋转的总角度
let spinning = false;
let animationFrame;
let maxRotationTime = 3000; // 最大旋转时间
let stopSpinningTimeout;

// 绘制转盘
function drawWheel() {
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    for (let i = 0; i < numSegments; i++) {
        const angle = currentAngle + i * anglePerSegment;
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + anglePerSegment);
        ctx.fillStyle = segmentColors[i];
        ctx.fill();
        ctx.save();

        // 绘制奖品名称
        ctx.translate(250, 250);
        ctx.rotate(angle + anglePerSegment / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 20px Arial";
        ctx.fillText(segments[i], 150, 10);
        ctx.restore();
    }
}

// 平滑旋转效果
let maxSpeed = 0;
let currentSpeed = 0;
let deceleration = 0.0002; 

// 开始旋转转盘
function spinWheel() {
    if (!spinning) {
        spinning = true;
        currentSpeed = Math.random() * 0.3 + 0.2; // 随机最大速度
        requestAnimationFrame(rotateWheel);

        // 设置在最大旋转时间后开始减速
        stopSpinningTimeout = setTimeout(() => {
            startDecelerating();
        }, maxRotationTime);
    }
}

// 开始减速
function startDecelerating() {
    deceleration = 0.002; // 设置一个合理的减速值
}

// 动态旋转转盘
function rotateWheel() {
    if (!spinning) return;

    if (currentSpeed > 0) {
        currentAngle += currentSpeed; // 增加旋转角度
        currentSpeed -= deceleration; // 逐渐减速
        if (currentSpeed < 0) currentSpeed = 0; // 防止负速度
    }

    drawWheel(); // 每次旋转时重新绘制转盘
    currentAngle = currentAngle % (2 * Math.PI); // 确保角度不超过 360 度

    if (currentSpeed > 0) {
        animationFrame = requestAnimationFrame(rotateWheel);
    } else {
        spinning = false;
        cancelAnimationFrame(animationFrame);
        clearTimeout(stopSpinningTimeout);
        calculateResult();
    }
}

// 计算中奖结果
function calculateResult() {
    // 获取最终停止时的角度，并确定指针指向的奖品
    const finalAngle = (2 * Math.PI - currentAngle) % (2 * Math.PI);
    const segmentIndex = Math.floor(finalAngle / anglePerSegment);
    alert(`本次大转盘抽取到: ${segments[segmentIndex]}!`);
}

// 绑定按钮事件
spinBtn.addEventListener("click", spinWheel);

// 初次绘制转盘
drawWheel();