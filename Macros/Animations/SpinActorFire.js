//folder 01 is the directory path to the assets
// let folder01 = "modules/JB2A_DnD5e/Library/2nd_Level/Scorching_Ray/";
//anFile30 points to the file corresponding to 30ft, anFile60 for 60ft and anFile90 for 90ft
// let anFile30 = `${folder01}ScorchingRay_01_Regular_Orange_30ft_1600x400.webm`;
// let anFile60 = `${folder01}ScorchingRay_01_Regular_Orange_60ft_2800x400.webm`;
// let anFile90 = `${folder01}ScorchingRay_01_Regular_Orange_90ft_4000x400.webm`;

//How this macro is set up for Fire Bolt
let folder01 = "modules/jb2a_patreon/Library/Cantrip/Fire_Bolt/";
let anFile30 = `${folder01}FireBolt_01_Regular_Orange_30ft_1600x400.webm`;
let anFile60 = `${folder01}FireBolt_01_Regular_Orange_60ft_2800x400.webm`;
let anFile90 = `${folder01}FireBolt_01_Regular_Orange_90ft_4000x400.webm`;


if(game.user.targets.size == 0) ui.notifications.error('You must target at least one token');
if(canvas.tokens.controlled.length == 0) ui.notifications.error("Please select your token");
///Check if Module dependencies are installed or returns an error to the user
if (!canvas.fxmaster) ui.notifications.error("This macro depends on the FXMaster module. Make sure it is installed and enabled");

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function Cast() {
    var tk = canvas.tokens.controlled[0];
    //var targets = canvas.tokens.placeables.filter(t=>t.name=="TOKEN NAMES");
    //The one below is for cluster targetting selected groups
    var targets = Array.from(game.user.targets);
    var targetsX = targets.map(t=>t.x).sort();
    var targetsY = targets.map(t=>t.y).sort();
    let centre = [ targetsX.reduce((a, b) => a + b, 0)/targetsX.length, 
    targetsY.reduce((a, b) => a + b, 0)/targetsY.length ];
    let closest = targets.sort( (a,b) => 
    (Math.abs(centre[0] - a.x) + Math.abs(centre[1] - a.y)) -
    (Math.abs(centre[0] - b.x) + Math.abs(centre[1] - b.y)) )[0];
    
    let ray = new Ray(tk.center, closest.center);
    let rotDeg = Math.floor(ray.normAngle * 57.3)+90;
    let anDeg = -(ray.angle * 57.3);
    let anDist = ray.distance;
    
    let anFile = anFile30;
    let anFileSize = 1200;
    let anchorX = 0.125;
    switch(true){
     case (anDist<=1200):
        anFileSize = 1200;
        anFile = anFile30;
        anchorX = 0.125;
        break;
     case (anDist>2400):
        anFileSize = 3600;
        anFile = anFile90;
        anchorX = 0.05;
        break;
     default:
        anFileSize = 2400;
        anFile = anFile60;
        anchorX = 0.071;
        break;
    }
    
    let anScale = anDist / anFileSize;
    let anScaleY = anDist <= 600 ? 0.6 : anScale;

    let spellAnim = 
                    {
                     file: anFile,
                      position: tk.center,
                      anchor: {
                       x: anchorX,
                       y: 0.5
                      },
                      angle: anDeg,
                      scale: {
                       x: anScale,
                       y: anScaleY
                      }
                    }; 
    
    
    await rotate(tk, rotDeg);
    for (let i=0; i<6; i++) { 
        boom(spellAnim); 
        await wait (150);
    }
}
    
async function boom(animation) {
    canvas.fxmaster.playVideo(animation);
    game.socket.emit('module.fxmaster', animation);
}
async function rotate(tk, targetAngle) {
    let currentAngle = tk.data.rotation
    let direction = (((currentAngle - targetAngle + 360) % 360) > 180 ? 1 : -1);
    while (tk.data.rotation != targetAngle) {
        tk.update({ rotation: ((tk.data.rotation + direction + 360) % 360)})
        await wait (100);
    }
}
Cast ()