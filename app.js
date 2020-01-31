var meir = {"0":-0.05274718627333641,"1":0.05712440609931946,"2":-0.019495340064167976,"3":-0.028943784534931183,"4":-0.09692692756652832,"5":0.04287099093198776,"6":0.013902341946959496,"7":-0.09310949593782425,"8":0.21618124842643738,"9":-0.1541455090045929,"10":0.1667192429304123,"11":0.024953700602054596,"12":-0.3000437915325165,"13":0.026041043922305107,"14":0.0022729940246790648,"15":0.15398289263248444,"16":-0.09742701053619385,"17":-0.14966827630996704,"18":-0.14940710365772247,"19":-0.04672057926654816,"20":0.028933480381965637,"21":0.08954406529664993,"22":0.08118871599435806,"23":0.09930573403835297,"24":-0.14987464249134064,"25":-0.3838758170604706,"26":-0.0924844965338707,"27":-0.08982173353433609,"28":0.046693190932273865,"29":-0.0676962360739708,"30":-0.04910219833254814,"31":0.006802850402891636,"32":-0.1520087569952011,"33":-0.022732699289917946,"34":0.07822035253047943,"35":0.0488458052277565,"36":-0.09547807276248932,"37":-0.10360945016145706,"38":0.25263461470603943,"39":0.039685193449258804,"40":-0.26725319027900696,"41":-0.05073755979537964,"42":0.10448382794857025,"43":0.2535857558250427,"44":0.17777138948440552,"45":0.05967268347740173,"46":0.10180460661649704,"47":-0.11639823764562607,"48":0.1165216863155365,"49":-0.3462418019771576,"50":0.09829764813184738,"51":0.11221202462911606,"52":0.07320145517587662,"53":0.0690879374742508,"54":0.07672138512134552,"55":-0.19734756648540497,"56":-0.045255936682224274,"57":0.13400256633758545,"58":-0.22359773516654968,"59":0.07558127492666245,"60":0.04985503479838371,"61":0.0012623071670532227,"62":-0.08530951291322708,"63":-0.03885546326637268,"64":0.21896995604038239,"65":0.14244745671749115,"66":-0.159965381026268,"67":-0.1558838188648224,"68":0.20920005440711975,"69":-0.2845214307308197,"70":-0.02128935232758522,"71":0.12724822759628296,"72":-0.09479265660047531,"73":-0.2543896436691284,"74":-0.24096158146858215,"75":-0.02874344401061535,"76":0.47018563747406006,"77":0.1868482530117035,"78":-0.044395722448825836,"79":0.03713538125157356,"80":-0.0822724997997284,"81":-0.01613844558596611,"82":0.012117081321775913,"83":0.08930259943008423,"84":-0.05741056799888611,"85":0.014282071962952614,"86":-0.030851665884256363,"87":0.09434326738119125,"88":0.26772820949554443,"89":-0.03348878026008606,"90":-0.02205006405711174,"91":0.26974785327911377,"92":0.045337874442338943,"93":0.0073297335766255856,"94":0.016751617193222046,"95":0.13409194350242615,"96":-0.11008024215698242,"97":-0.04527493566274643,"98":-0.14334999024868011,"99":-0.0018337222281843424,"100":-0.006806309800595045,"101":-0.012553387321531773,"102":0.06935594230890274,"103":0.0824083685874939,"104":-0.2301713526248932,"105":0.21906550228595734,"106":-0.04814404249191284,"107":-0.06518697738647461,"108":0.04373332858085632,"109":0.012493244372308254,"110":-0.12984147667884827,"111":-0.047304973006248474,"112":0.14789126813411713,"113":-0.2924036979675293,"114":0.1272396445274353,"115":0.17651312053203583,"116":0.04071955010294914,"117":0.16025182604789734,"118":0.024796800687909126,"119":0.05411164090037346,"120":0.06789522618055344,"121":-0.0703570693731308,"122":-0.24211357533931732,"123":-0.09219779819250107,"124":0.05127239227294922,"125":-0.06455589830875397,"126":0.028946571052074432,"127":0.006502926349639893};

console.log('app', new Date().toISOString());
var container = document.createElement('div');
container.style.position = "relative";
document.body.append(container);
var uploudImage = document.getElementById('uploudFile');

var video = document.getElementById('video');
video.style.position = "relative";
var faceMatcher;
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
    document.querySelector('.loading').className = "loading";
    start();
});

function startVideo() {
    navigator.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.log(err)
    );
}

function eventVideo(){
    video.addEventListener('play', () => {
        console.log('play');
        var interval;
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const displySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displySize);
        if(!interval)
        interval = setInterval(async () => {
            // if (canvas) canvas.remove();
            let detection = await faceapi.detectAllFaces(video
                , new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

                findBestAndApply(detection,faceMatcher,displySize,canvas);
           
        }, 4000)
    });
}

async function start() {
    let image;
    let canvas;
    const lables = await LoadImages();
    faceMatcher = new faceapi.FaceMatcher(lables, 0.8);
    document.querySelector('.loading').className += " hide";
    eventVideo();
    startVideo();
    document.body.append('loaded');
    eventUploudChange(image,canvas,faceMatcher);
}

function eventUploudChange(image,canvas,faceMatcher) {
    uploudImage.addEventListener('change', async () => {
        document.querySelector('.loading').className = "loading";
        if (image) image.remove();
        if (canvas) canvas.remove();

        if (uploudImage.files.length === 0) {
            document.querySelector('.loading').className = "loading hide";
            return;
        }
        image = await faceapi.bufferToImage(uploudImage.files[0]);
        image.width = 500;
        container.append(image);

        canvas = faceapi.createCanvas(image);
        container.append(canvas);
        const diplaySize = { width: image.width, height: image.height };
        faceapi.matchDimensions(canvas, diplaySize);
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        findBestAndApply(detections,faceMatcher,diplaySize,canvas);
       
    });
}
function findBestAndApply(detections,faceMatcher,diplaySize,canvas){
    const resizeDetections = faceapi.resizeResults(detections, diplaySize);
    const results = resizeDetections.map(m => {
        const find = faceMatcher.findBestMatch(m.descriptor);
        return find;
    });
    results.forEach((detection, i) => {
        if(detection.toString() !== 'unknown')
        alert('hello ' + detection.toString());
        // const box = resizeDetections[i].detection.box;
        // const drawBox = new faceapi.draw.DrawBox(box, { label: detection.toString() });
        // drawBox.draw(canvas);
    });
    document.querySelector('.loading').className = "loading hide";
}
function LoadImages() {
    const Lables = ['meir','yonit','avi','efi','naftali','ohad','shoshi','yossi'];
    return Promise.all(
        Lables.map(async (lable, index) => {
            const detections = [];
            const img = await faceapi.fetchImage(`/images/${lable}.jpg`)
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            detections.push(detection);
            console.log('detections', detections, new Date().toISOString());
            return new faceapi.LabeledFaceDescriptors(lable, detections.map(a=>a.descriptor));
        })
    );
}