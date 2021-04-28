const content = `<form class = "inline">
    <div class="form-group">
        <label for="wallHeightTop">Top</label>
        <input type="text" name="wallHeightTop" placeholder="0">
    </div>
    <div class="form-group">
        <label for="wallHeightBottom">Bottom</label>
        <input type="text" name="wallHeightBottom" placeholder="0">
    </div>
</form>`

let d = new Dialog({
    title: 'Adjusting Wall Height',
    content: content,
    buttons: {
        all: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Adjust all walls',
            callback: (html) => {
                let top = html.find('[name="wallHeightTop"]').val()
                let bot = html.find('[name="wallHeightBottom"]').val()
                let walls = canvas.walls.placeables;
                if (walls.length) { adjustWalls(top, bot, walls); }
                else { ui.notifications.info(`There are no walls on the scene.`); }
            }
        },
        selected: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Adjust selected',
            callback: (html) => {
                let top = html.find('[name="wallHeightTop"]').val()
                let bot = html.find('[name="wallHeightBottom"]').val()
                let walls = canvas.walls.controlled;
                if (walls.length) { adjustWalls(top, bot, walls); }
                else { ui.notifications.info(`You have not selected any walls.`); }
            }
        },
        cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Cancel'
        }
    }
}).render(true);

function adjustWalls(top, bottom, walls) {
 if (!(isNaN(top) && isNaN(bottom))) {
    walls.forEach(w=> 
        w.data.flags.wallHeight = {
          wallHeightTop: +top,
          wallHeightBottom: +bottom})
 } else {
     throw new Error("Invalid values")
 }
}