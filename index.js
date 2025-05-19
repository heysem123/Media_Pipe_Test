import { ObjectDetector, FilesetResolver} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest';

const runningMode = "IMAGE";
let objectDetector;

odInit();

const uploadFotoButton = document.getElementById("image_input");
const body = document.body;
var uploadedImage;
var canvas = document.getElementById("image_display");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = "green";

uploadFotoButton.addEventListener("change", (event) => {
  const fileUploaded = event.target.files[0];
  if (fileUploaded) {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      uploadedImage = fileReader.result;

      var img = new Image();
      img.src = uploadedImage;

      img.onload = function() {
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
        const objectDetectButton = document.createElement("button");
        objectDetectButton.setAttribute("id", "ob_detect");
        objectDetectButton.innerText = "Detect Object";
        body.appendChild(objectDetectButton);


        objectDetectButton.addEventListener("click", () => {
          if (!objectDetector) {
            alert("Object Detector is still loading. Please try again.");
            return;
            }
            const detectionResult = objectDetector.detect(img);
            ctx.strokeStyle = "green";
            detectionResult.detections.forEach(detection => {
              const boundry = detection.boundingBox
              ctx.strokeRect(boundry.originX, boundry.originY, boundry.width, boundry.height )
              ctx.fillText(detection.categories[0].categoryName,boundry.originX, boundry.originY);
              console.log(detection.categories[0].categoryName);
            });

            console.log(detectionResult);
    });
    }

    });
    fileReader.readAsDataURL(fileUploaded);
  }
});


async function odInit() {
  const vision = await FilesetResolver.forVisionTasks(
    // path/to/wasm/root
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  objectDetector = await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
    },
    scoreThreshold: 0.5,
    runningMode: runningMode,
  });
}
