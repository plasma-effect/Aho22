var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

function write_text(text: string, x: number, y: number, color: string, size: number = 1)
{
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.fillText(text, 0, 0);
    ctx.restore();
}
function write_text_middle(text: string, x: number, y: number, color: string, size: number = 1)
{
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.fillText(text, 0, 0);
    ctx.restore();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
}
function write_rect(x: number, y: number, w: number, h: number, color: string)
{
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

var level_string = ["初級", "中級", "上級", "？？？"];
var level_correction = [1, 3, 5, 10];
var level_color = ["blue", "yellow", "red", "black"];
var level_text_color = ["white", "black", "white", "white"];

var haikei: HTMLImageElement
var tori: HTMLImageElement;
var ki: HTMLImageElement;
var hito: HTMLImageElement;
var hata: HTMLImageElement;
var title: HTMLImageElement;
var ufo: HTMLImageElement;

var score: number;
var soten: number;
var count: number;
var rest: number;
var maxcount: number;

function addpoint(val: number)
{
    soten += val * (Math.floor(count / 10) + 1);
    score += soten * (Math.floor(count / 10) + 1);
    ++count;
    maxcount = Math.max(maxcount, count);
    rest = 50;
}
function addbird(val: birds.bird)
{
    for (var i = 0; i < toriobj.length; ++i)
    {
        if (toriobj[i] == null)
        {
            toriobj[i] = val;
            break;
        }
    }
}
function addwood(val: wood)
{
    for (var i = 0; i < woodobj.length; ++i)
    {
        if (woodobj[i] == null)
        {
            woodobj[i] = val;
            break;
        }
    }
}
function addbullet(x: number, y: number, speed: number, angle: number, size: number, color: string)
{
    for (var i = 0; i < bulletobj.length; ++i)
    {
        if (bulletobj[i] == null)
        {
            bulletobj[i] = new bullet(x, y, speed * Math.cos(angle), speed * Math.sin(angle), size, color);
            break;
        }
    }
}

class person
{
    private x: number;
    private y: number;
    private time: number;
    public constructor()
    {
        this.x = 320 - 50;
        this.y = 50;
        this.time = 50;
    }
    public main_loop()
    {
        if (this.time > 0)
        {
            --this.time;
        }
        else if (this.y != 50)
        {
            this.y -= 10;
        }
        else if (this.x > -100)
        {
            this.x -= 3;
        }
    }

    public draw()
    {
        if (this.x > -100 && this.y + 250 > 0)
        {
            ctx.drawImage(hito, this.x, this.y);
        }
    }

    public clicked(x: number, y: number)
    {
        if (this.y == 50 && this.x < x && x < (this.x + 100) && 50 < y && y < 300)
        {
            this.y = 40;
            addpoint(1000);
        }
    }
}
class flag
{
    private x: number;
    public constructor()
    {
        this.x = 640;
    }

    public main_loop(): boolean
    {
        this.x -= 3;
        return this.x < 320 - 15;
    }

    public draw()
    {
        ctx.drawImage(hata, this.x, 50);
    }
    
}
class wood
{
    private x: number;
    private y: number;
    public constructor()
    {
        this.x = 640;
        this.y = 0;
    }

    public main_loop(): boolean
    {
        if (this.y != 0)
        {
            this.y -= 10;
        }
        else
        {
            this.x -= 3;
        }
        return this.x + 170 < 0 || this.y + 300 < 0;
    }

    public draw()
    {
        ctx.drawImage(ki, this.x, this.y);
    }

    public clicked(x: number, y: number)
    {
        if (this.y == 0 && (this.x + 30) < x && x < (this.x + 170) && y < 300)
        {
            this.y = -10;
            addpoint(500);
        }
    }
}
class bullet
{
    private mode: boolean;
    public constructor(private x: number, private y: number, private xspeed: number, private yspeed: number, private size: number, private color: string)
    {

    }

    public main_loop()
    {
        this.x += this.xspeed;
        this.y += this.yspeed;
        return this.mode
            || this.x + this.size < 0 || 640 + this.size < this.x
            || this.y + this.size < 0 || 360 + this.size < this.y;
    }

    public clicked(x: number, y: number)
    {
        if (this.mode)
        {
            return;
        }
        var v = x - this.x;
        var u = y - this.y;
        if (Math.abs(v) < this.size && Math.abs(u) < this.size)
        {
            addpoint(10);
            this.mode = true;
        }
    }

    public draw()
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    public gameover()
    {
        var v = this.x - 320;
        var u = this.y - 290;
        var s = this.size + 10;
        return v * v + u * u < s * s;
    }
}

namespace birds
{
    export interface bird
    {
        main_loop(): boolean;
        clicked(x: number, y: number);
        draw();
        gameover(): boolean;
    }

    export class basic_bird implements bird
    {
        protected mode: boolean;
        protected x: number;
        protected y: number;
        public constructor(private image: HTMLImageElement, private speed: number)
        {
            this.mode = false;
            this.x = 640;
            this.y = -125;
        }

        public main_loop(): boolean
        {
            if (this.mode)
            {
                this.y -= 10;
                if (this.y < -120)
                {
                    return true;
                }
            }
            else
            {
                this.x -= this.speed;
                this.y += this.speed;
            }
            return false;
        }

        public draw()
        {
            ctx.drawImage(this.image, this.x, this.y);
        }

        public clicked(x: number, y: number)
        {
            if (!this.mode && this.x < x && x < (this.x + 120) && this.y < y && y < (this.y + 120))
            {
                addpoint(100);
                this.mode = true;
            }
        }

        public gameover(): boolean
        {
            return this.x <= 320;
        }
    }

    export class reverse_basic_bird implements bird
    {
        protected mode: boolean;
        protected x: number;
        protected y: number;
        public constructor(private image: HTMLImageElement, private speed: number)
        {
            this.mode = false;
            this.x = 0;
            this.y = -125;
        }

        public main_loop(): boolean
        {
            if (this.mode)
            {
                this.y -= 10;
                if (this.y < -120)
                {
                    return true;
                }
            }
            else
            {
                this.x += this.speed;
                this.y += this.speed;
            }
            return false;
        }

        public draw()
        {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, 0, 0);
            ctx.restore();
        }

        public clicked(x: number, y: number)
        {
            if (!this.mode && (this.x - 120) < x && x < this.x && this.y < y && y < (this.y + 120))
            {
                addpoint(100);
                this.mode = true;
            }
        }

        public gameover(): boolean
        {
            return this.x >= 320;
        }
    }

    export class ufos implements bird
    {
        private mode: boolean;
        public constructor(private x: number, private y: number, private speed: number)
        {
            this.mode = false;
        }

        public main_loop(): boolean
        {
            if (this.mode)
            {
                this.y -= 10;
            }
            else if (this.x == 320)
            {
                this.y += 3;
            }
            else
            {
                this.x += this.speed;
            }
            return this.y + 60 < 0;
        }

        public clicked(x: number, y: number)
        {
            if (!this.mode && this.x - 30 < x && x < this.x + 30 && this.y - 30 < y && y < this.y + 30)
            {
                this.mode = true;
                addpoint(500);
            }
        }

        public draw()
        {
            ctx.drawImage(ufo, this.x - 30, this.y - 30);
        }

        public gameover(): boolean
        {
            return this.y > 290;
        }
    }

    export class bullet_bird extends basic_bird
    {
        private time: number;
        public constructor()
        {
            super(tori, 3);
            this.time = 0;
        }

        public main_loop()
        {
            ++this.time;
            if (this.time == 50 && !this.mode)
            {
                this.time = 0;
                addbullet(this.x, this.y + 95, 2, 4 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 5 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 6 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 7 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 8 * Math.PI / 8, 15, "red");
            }
            return super.main_loop();
        }
    }

    export class reverse_bullet_bird extends reverse_basic_bird
    {
        private time: number;
        public constructor()
        {
            super(tori, 3);
            this.time = 0;
        }

        public main_loop()
        {
            ++this.time;
            if (this.time == 50 && !this.mode)
            {
                this.time = 0;
                addbullet(this.x, this.y + 95, 2, 0 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 1 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 2 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 3 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 4 * Math.PI / 8, 15, "red");
            }
            return super.main_loop();
        }
    }

}

namespace stages
{
    export interface stage
    {
        main_loop();
        get_level(): number;
    }

    export class easy implements stage
    {
        private time: number;
        public constructor()
        {
            this.time = 0;
        }

        public get_level()
        {
            return 0;
        }

        public main_loop()
        {
            ++this.time;
            switch (this.time)
            {
                case 80:
                    addbird(new birds.basic_bird(tori, 2));
                    addwood(new wood());
                    break;
                case 160:
                    addbird(new birds.reverse_basic_bird(tori, 2));
                    addwood(new wood());
                    break;
                case 240:
                    addbird(new birds.basic_bird(tori, 2));
                    addwood(new wood());
                    break;
                case 320:
                    addbird(new birds.reverse_basic_bird(tori, 2));
                    addwood(new wood());
                    break;
                case 400:
                    addbird(new birds.basic_bird(tori, 2));
                    addwood(new wood());
                    break;
                case 480:
                    addbird(new birds.reverse_basic_bird(tori, 2));
                    addwood(new wood());
                    break;
                case 560:
                    flagobj = new flag();
                    break;
            }
        }
    }

    export class normal implements stage
    {
        private time: number;
        private wtime: number;

        private now_loop: () => void;

        public constructor()
        {
            this.time = -100;
            this.wtime = 0;
            this.now_loop = () =>
            {
                this.first_loop(0);
            };
        }

        public main_loop()
        {
            ++this.time;
            ++this.wtime;
            if (this.wtime == 1500)
            {
                flagobj = new flag();
            }
            if (this.wtime < 1500)
            {
                this.now_loop();
                if (this.wtime % 100 == 0)
                {
                    addwood(new wood());
                }
            }
        }

        public first_loop(y: number)
        {
            if (this.time == 30)
            {
                if (y % 2 == 0)
                    addbird(new birds.ufos(650, 30 + 50 * y, -3));
                else
                    addbird(new birds.ufos(-10, 30 + 50 * y, 3));
                this.time = 0;
                this.now_loop = () =>
                {
                    this.second_loop(y);
                };
            }
        }

        public second_loop(y: number)
        {
            if (this.time == 70)
            {
                if (y % 2 == 0)
                    addbird(new birds.reverse_basic_bird(tori, 3));
                else
                    addbird(new birds.basic_bird(tori, 3));
                this.time = 0;
                this.now_loop = () =>
                {
                    this.first_loop((y + 1) % 4);
                }
            }
        }

        public get_level()
        {
            return 1;
        }
    }

    export class hard implements stage
    {
        private time: number;
        public constructor()
        {
            this.time = -100;
        }
        public main_loop()
        {
            ++this.time;
            if (this.time < 2900)
            {
                var c = this.time % 160;
                if (c == 0)
                {
                    addbird(new birds.bullet_bird());
                }
                else if (c == 80)
                {
                    addbird(new birds.reverse_bullet_bird());
                }
                else if (c == 40 || c == 120)
                {
                    addwood(new wood());
                }
            }
            if (this.time == 3000)
            {
                flagobj = new flag();
            }
        }

        public get_level()
        {
            return 2;
        }
    }
}

var hitoobj: person;
var toriobj: birds.bird[];
var flagobj: flag;
var stageobj: stages.stage;
var woodobj: wood[];
var bulletobj: bullet[];

function load_image(name: string): HTMLImageElement
{
    var ret = new Image();
    ret.src = name;
    return ret;
}

enum mode_t
{
    title,
    game,
    clear,
    gameover
}
var mode: mode_t

function main_loop()
{
    hitoobj.main_loop();
    stageobj.main_loop();
    for (var i = 0; i < toriobj.length; ++i)
    {
        if (toriobj[i] != null && toriobj[i].main_loop())
        {
            toriobj[i] = null;
        }
    }
    for (var i = 0; i < woodobj.length; ++i)
    {
        if (woodobj[i] != null && woodobj[i].main_loop())
        {
            woodobj[i] = null;
        }
    }
    for (var i = 0; i < bulletobj.length; ++i)
    {
        if (bulletobj[i] != null && bulletobj[i].main_loop())
        {
            bulletobj[i] = null;
        }
    }
    if (flagobj != null && flagobj.main_loop())
    {
        hit_bonus = level_correction[stageobj.get_level()] * maxcount * 1000;
        level_bonus = level_correction[stageobj.get_level()] * 10000;
        clear_time = 50;
        mode = mode_t.clear;
    }
    for (var i = 0; i < toriobj.length; ++i)
    {
        if (toriobj[i] != null && toriobj[i].gameover())
        {
            clear_time = 50;
            mode = mode_t.gameover;
        }
    }
    for (var i = 0; i < bulletobj.length; ++i)
    {
        if (bulletobj[i] != null && bulletobj[i].gameover())
        {
            clear_time = 50;
            mode = mode_t.gameover;
        }
    }
    if (rest > 0)
    {
        --rest;
    }
    else
    {
        soten -= Math.min(soten, 100);
    }
    if (soten == 0)
    {
        count = 0;
    }
    draw();
    ctx.beginPath();
    ctx.arc(320, 290, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}

function init(s: stages.stage)
{
    hitoobj = new person();
    stageobj = s;
    toriobj = new Array(16);
    woodobj = new Array(8);
    bulletobj = new Array(64);
    flagobj = null;
    score = 0;
    soten = 0;
    count = 0;
    rest = 0;
    maxcount = 0;
    mode = mode_t.game;
}

function draw()
{
    hitoobj.draw();
    for (var i = 0; i < woodobj.length; ++i)
    {
        if (woodobj[i] != null)
        {
            woodobj[i].draw();
        }
    }
    for (var i = 0; i < toriobj.length; ++i)
    {
        if (toriobj[i] != null)
        {
            toriobj[i].draw();
        }
    }
    for (var i = 0; i < bulletobj.length; ++i)
    {
        if (bulletobj[i] != null)
        {
            bulletobj[i].draw();
        }
    }
    if (flagobj != null)
    {
        flagobj.draw();
    }
    ctx.fillStyle = "white";
    ctx.fillText("score:" + score, 0, 0);
    ctx.fillText("+" + soten, 0, 20);
    if (count > 2)
    {
        ctx.save();
        ctx.translate(0, 40);
        ctx.scale(2, 2);
        ctx.fillText(count + "Hits", 0, 0);
        ctx.restore();
    }
    if (rest > 0)
    {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 70, rest, 8);
    }
}

function title_loop()
{
    ctx.drawImage(title, 0, 0);
    
    for (var i = 0; i < 3; ++i)
    {
        write_rect(30 + i * 160, 310, 100, 40, level_color[i]);
        write_text_middle(level_string[i], 80 + i * 160, 330, level_text_color[i], 1.5);
    }
}

function gameover_loop()
{
    draw();
    write_text_middle("GAME OVER", 320, 180, "white", 5);
    if (clear_time == 0)
    {
        write_text_middle("タイトルに戻る", 320, 330, "white");
    }
    else
    {
        --clear_time;
    }
}

var hit_bonus: number;
var level_bonus: number;
var clear_time: number;
function clear_loop()
{
    if (clear_time > 0)
    {
        --clear_time;
    }
    else if (hit_bonus != 0)
    {
        var d = Math.min(hit_bonus, 1000);
        hit_bonus -= d;
        score += d;
    }
    else if (level_bonus != 0)
    {
        var d = Math.min(level_bonus, 1000);
        level_bonus -= d;
        score += d;
    }
    draw();
    write_text_middle("GAME CLEAR!!", 320, 60, "black", 3);
    write_text("Hit Bonus:" + maxcount + " × " + 1000 + " × " + level_correction[stageobj.get_level()] + " = " + hit_bonus, 30, 100, "black", 1.5);
    write_text("Level Bonus:" + 10000 + " × " + level_correction[stageobj.get_level()] + " = " + level_bonus, 30, 140, "black", 1.5);
    if (hit_bonus == 0 && level_bonus == 0)
    {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 300, 320, 60);
        write_text_middle("Tweetする", 160, 330, "white", 2);
        write_text_middle("タイトルに戻る", 480, 330, "black", 2);
    }
}

function loop()
{
    ctx.drawImage(haikei, 0, 0);
    if (mode == mode_t.title)
    {
        title_loop();
    }
    else if (mode == mode_t.game)
    {
        main_loop();
    }
    else if (mode == mode_t.clear)
    {
        clear_loop();
    }
    else if (mode == mode_t.gameover)
    {
        gameover_loop();
    }
}

function clicked(e: MouseEvent)
{
    var x = e.pageX - canvas.offsetLeft + window.pageXOffset;
    var y = e.pageY - canvas.offsetTop + window.pageYOffset;
    console.log("(" + x + "," + y + ")");
    if (mode == mode_t.title)
    {
        if (310 < y && y < 350)
        {
            if (30 + 160 * 0 < x && x < 160 * 1 - 30)
            {
                init(new stages.easy());
            }
            if (30 + 160 * 1 < x && x < 160 * 2 - 30)
            {
                init(new stages.normal());
            }
            if (30 + 160 * 2 < x && x < 160 * 3 - 30)
            {
                init(new stages.hard());
            }

        }
    }
    else if (mode == mode_t.game)
    {
        hitoobj.clicked(x, y);
        for (var i = 0; i < toriobj.length; ++i)
        {
            if (toriobj[i] != null)
            {
                toriobj[i].clicked(x, y);
            }
        }
        for (var i = 0; i < woodobj.length; ++i)
        {
            if (woodobj[i] != null)
            {
                woodobj[i].clicked(x, y);
            }
        }
        for (var i = 0; i < bulletobj.length; ++i)
        {
            if (bulletobj[i] != null)
            {
                bulletobj[i].clicked(x, y);
            }
        }

    }
    else if (mode == mode_t.gameover)
    {
        if (clear_time == 0)
        {
            mode = mode_t.title;
        }
    }
    else if (mode == mode_t.clear)
    {
        if (hit_bonus == 0 && level_bonus == 0)
        {
            if (0 < x && x < 320 && 300 < y && y < 360)
            {
                var url = "http://plasma-effect.github.io/Aho22/main.html";
                var text = encodeURIComponent("「パターセイバー」難易度" + level_string[stageobj.get_level()] + "でscore" + score + "点を獲得しました！");
                var tag = "putter_savior";
                window.open("https://twitter.com/intent/tweet?text=" + text + "&hashtags=" + tag + "&url=" + url);
            }
            else if (320 < x && x < 640 && 300 < y && y < 360)
            {
                mode = mode_t.title;
            }
        }
    }
}

window.onload = () =>
{
    canvas = <HTMLCanvasElement>document.getElementById("field");
    canvas.onclick = clicked;
    ctx = canvas.getContext("2d");
    ctx.font = "20px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    haikei = load_image("data/haikei.png");
    tori = load_image("data/tori.png");
    hito = load_image("data/hito.png");
    ki = load_image("data/ki.png");
    hata = load_image("data/hata.png");
    title = load_image("data/title.png");
    ufo = load_image("data/ufo.png");
    mode = mode_t.title;
    haikei.onload = () =>
    {
        tori.onload = () =>
        {
            hito.onload = () =>
            {
                ki.onload = () =>
                {
                    hata.onload = () =>
                    {
                        title.onload = () =>
                        {
                            setInterval(loop, 20);
                        }
                    }
                }
            }
        }
    }
}