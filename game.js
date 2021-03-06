//Copyright 2017 plasma-effect
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
var canvas;
var ctx;
function write_text(text, x, y, color, size) {
    if (size === void 0) { size = 1; }
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.fillText(text, 0, 0);
    ctx.restore();
}
function write_text_middle(text, x, y, color, size) {
    if (size === void 0) { size = 1; }
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
function write_rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
var level_string = ["初級", "中級", "上級", "？？？"];
var level_correction = [1, 3, 5, 10];
var level_color = ["blue", "yellow", "red", "black"];
var level_text_color = ["white", "black", "white", "white"];
var haikei;
var tori;
var ki;
var hito;
var hata;
var title;
var ufo;
var score;
var soten;
var count;
var rest;
var maxcount;
function addpoint(val) {
    soten += val * (Math.floor(count / 10) + 1);
    score += soten * (Math.floor(count / 10) + 1);
    ++count;
    maxcount = Math.max(maxcount, count);
    rest = 50;
}
function addbird(val) {
    for (var i = 0; i < toriobj.length; ++i) {
        if (toriobj[i] == null) {
            toriobj[i] = val;
            break;
        }
    }
}
function addwood(val) {
    for (var i = 0; i < woodobj.length; ++i) {
        if (woodobj[i] == null) {
            woodobj[i] = val;
            break;
        }
    }
}
function addbullet(x, y, speed, angle, size, color) {
    for (var i = 0; i < bulletobj.length; ++i) {
        if (bulletobj[i] == null) {
            bulletobj[i] = new bullet(x, y, speed * Math.cos(angle), speed * Math.sin(angle), size, color);
            break;
        }
    }
}
var person = /** @class */ (function () {
    function person() {
        this.x = 320 - 50;
        this.y = 50;
        this.time = 50;
    }
    person.prototype.main_loop = function () {
        if (this.time > 0) {
            --this.time;
        }
        else if (this.y != 50) {
            this.y -= 10;
        }
        else if (this.x > -100) {
            this.x -= 3;
        }
    };
    person.prototype.draw = function () {
        if (this.x > -100 && this.y + 250 > 0) {
            ctx.drawImage(hito, this.x, this.y);
        }
    };
    person.prototype.clicked = function (x, y) {
        if (this.y == 50 && this.x < x && x < (this.x + 100) && 50 < y && y < 300) {
            this.y = 40;
            addpoint(1000);
        }
    };
    return person;
}());
var flag = /** @class */ (function () {
    function flag() {
        this.x = 640;
    }
    flag.prototype.main_loop = function () {
        this.x -= 3;
        return this.x < 320 - 15;
    };
    flag.prototype.draw = function () {
        ctx.drawImage(hata, this.x, 50);
    };
    return flag;
}());
var wood = /** @class */ (function () {
    function wood() {
        this.x = 640;
        this.y = 0;
    }
    wood.prototype.main_loop = function () {
        if (this.y != 0) {
            this.y -= 10;
        }
        else {
            this.x -= 3;
        }
        return this.x + 170 < 0 || this.y + 300 < 0;
    };
    wood.prototype.draw = function () {
        ctx.drawImage(ki, this.x, this.y);
    };
    wood.prototype.clicked = function (x, y) {
        if (this.y == 0 && (this.x + 30) < x && x < (this.x + 170) && y < 300) {
            this.y = -10;
            addpoint(500);
        }
    };
    return wood;
}());
var bullet = /** @class */ (function () {
    function bullet(x, y, xspeed, yspeed, size, color) {
        this.x = x;
        this.y = y;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
        this.size = size;
        this.color = color;
    }
    bullet.prototype.main_loop = function () {
        this.x += this.xspeed;
        this.y += this.yspeed;
        return this.mode
            || this.x + this.size < 0 || 640 + this.size < this.x
            || this.y + this.size < 0 || 360 + this.size < this.y;
    };
    bullet.prototype.clicked = function (x, y) {
        if (this.mode) {
            return;
        }
        var v = x - this.x;
        var u = y - this.y;
        if (Math.abs(v) < this.size && Math.abs(u) < this.size) {
            addpoint(10);
            this.mode = true;
        }
    };
    bullet.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    };
    bullet.prototype.gameover = function () {
        var v = this.x - 320;
        var u = this.y - 290;
        var s = this.size + 10;
        return v * v + u * u < s * s;
    };
    return bullet;
}());
var birds;
(function (birds) {
    var basic_bird = /** @class */ (function () {
        function basic_bird(image, speed) {
            this.image = image;
            this.speed = speed;
            this.mode = false;
            this.x = 640;
            this.y = -125;
        }
        basic_bird.prototype.main_loop = function () {
            if (this.mode) {
                this.y -= 10;
                if (this.y < -120) {
                    return true;
                }
            }
            else {
                this.x -= this.speed;
                this.y += this.speed;
            }
            return false;
        };
        basic_bird.prototype.draw = function () {
            ctx.drawImage(this.image, this.x, this.y);
        };
        basic_bird.prototype.clicked = function (x, y) {
            if (!this.mode && this.x < x && x < (this.x + 120) && this.y < y && y < (this.y + 120)) {
                addpoint(100);
                this.mode = true;
            }
        };
        basic_bird.prototype.gameover = function () {
            return this.x <= 320;
        };
        return basic_bird;
    }());
    birds.basic_bird = basic_bird;
    var reverse_basic_bird = /** @class */ (function () {
        function reverse_basic_bird(image, speed) {
            this.image = image;
            this.speed = speed;
            this.mode = false;
            this.x = 0;
            this.y = -125;
        }
        reverse_basic_bird.prototype.main_loop = function () {
            if (this.mode) {
                this.y -= 10;
                if (this.y < -120) {
                    return true;
                }
            }
            else {
                this.x += this.speed;
                this.y += this.speed;
            }
            return false;
        };
        reverse_basic_bird.prototype.draw = function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, 0, 0);
            ctx.restore();
        };
        reverse_basic_bird.prototype.clicked = function (x, y) {
            if (!this.mode && (this.x - 120) < x && x < this.x && this.y < y && y < (this.y + 120)) {
                addpoint(100);
                this.mode = true;
            }
        };
        reverse_basic_bird.prototype.gameover = function () {
            return this.x >= 320;
        };
        return reverse_basic_bird;
    }());
    birds.reverse_basic_bird = reverse_basic_bird;
    var ufos = /** @class */ (function () {
        function ufos(x, y, speed) {
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.mode = false;
        }
        ufos.prototype.main_loop = function () {
            if (this.mode) {
                this.y -= 10;
            }
            else if (this.x == 320) {
                this.y += 3;
            }
            else {
                this.x += this.speed;
            }
            return this.y + 60 < 0;
        };
        ufos.prototype.clicked = function (x, y) {
            if (!this.mode && this.x - 30 < x && x < this.x + 30 && this.y - 30 < y && y < this.y + 30) {
                this.mode = true;
                addpoint(500);
            }
        };
        ufos.prototype.draw = function () {
            ctx.drawImage(ufo, this.x - 30, this.y - 30);
        };
        ufos.prototype.gameover = function () {
            return this.y > 290;
        };
        return ufos;
    }());
    birds.ufos = ufos;
    var bullet_bird = /** @class */ (function (_super) {
        __extends(bullet_bird, _super);
        function bullet_bird() {
            var _this = _super.call(this, tori, 3) || this;
            _this.time = 0;
            return _this;
        }
        bullet_bird.prototype.main_loop = function () {
            ++this.time;
            if (this.time == 50 && !this.mode) {
                this.time = 0;
                addbullet(this.x, this.y + 95, 2, 4 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 5 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 6 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 7 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 8 * Math.PI / 8, 15, "red");
            }
            return _super.prototype.main_loop.call(this);
        };
        return bullet_bird;
    }(basic_bird));
    birds.bullet_bird = bullet_bird;
    var reverse_bullet_bird = /** @class */ (function (_super) {
        __extends(reverse_bullet_bird, _super);
        function reverse_bullet_bird() {
            var _this = _super.call(this, tori, 3) || this;
            _this.time = 0;
            return _this;
        }
        reverse_bullet_bird.prototype.main_loop = function () {
            ++this.time;
            if (this.time == 50 && !this.mode) {
                this.time = 0;
                addbullet(this.x, this.y + 95, 2, 0 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 1 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 2 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 3 * Math.PI / 8, 15, "red");
                addbullet(this.x, this.y + 95, 2, 4 * Math.PI / 8, 15, "red");
            }
            return _super.prototype.main_loop.call(this);
        };
        return reverse_bullet_bird;
    }(reverse_basic_bird));
    birds.reverse_bullet_bird = reverse_bullet_bird;
})(birds || (birds = {}));
var stages;
(function (stages) {
    var easy = /** @class */ (function () {
        function easy() {
            this.time = 0;
        }
        easy.prototype.get_level = function () {
            return 0;
        };
        easy.prototype.main_loop = function () {
            ++this.time;
            switch (this.time) {
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
        };
        return easy;
    }());
    stages.easy = easy;
    var normal = /** @class */ (function () {
        function normal() {
            var _this = this;
            this.time = -100;
            this.wtime = 0;
            this.now_loop = function () {
                _this.first_loop(0);
            };
        }
        normal.prototype.main_loop = function () {
            ++this.time;
            ++this.wtime;
            if (this.wtime == 1500) {
                flagobj = new flag();
            }
            if (this.wtime < 1500) {
                this.now_loop();
                if (this.wtime % 100 == 0) {
                    addwood(new wood());
                }
            }
        };
        normal.prototype.first_loop = function (y) {
            var _this = this;
            if (this.time == 30) {
                if (y % 2 == 0)
                    addbird(new birds.ufos(650, 30 + 50 * y, -3));
                else
                    addbird(new birds.ufos(-10, 30 + 50 * y, 3));
                this.time = 0;
                this.now_loop = function () {
                    _this.second_loop(y);
                };
            }
        };
        normal.prototype.second_loop = function (y) {
            var _this = this;
            if (this.time == 70) {
                if (y % 2 == 0)
                    addbird(new birds.reverse_basic_bird(tori, 3));
                else
                    addbird(new birds.basic_bird(tori, 3));
                this.time = 0;
                this.now_loop = function () {
                    _this.first_loop((y + 1) % 4);
                };
            }
        };
        normal.prototype.get_level = function () {
            return 1;
        };
        return normal;
    }());
    stages.normal = normal;
    var hard = /** @class */ (function () {
        function hard() {
            this.time = -100;
        }
        hard.prototype.main_loop = function () {
            ++this.time;
            if (this.time < 2900) {
                var c = this.time % 160;
                if (c == 0) {
                    addbird(new birds.bullet_bird());
                }
                else if (c == 80) {
                    addbird(new birds.reverse_bullet_bird());
                }
                else if (c == 40 || c == 120) {
                    addwood(new wood());
                }
            }
            if (this.time == 3000) {
                flagobj = new flag();
            }
        };
        hard.prototype.get_level = function () {
            return 2;
        };
        return hard;
    }());
    stages.hard = hard;
})(stages || (stages = {}));
var hitoobj;
var toriobj;
var flagobj;
var stageobj;
var woodobj;
var bulletobj;
function load_image(name) {
    var ret = new Image();
    ret.src = name;
    return ret;
}
var mode_t;
(function (mode_t) {
    mode_t[mode_t["title"] = 0] = "title";
    mode_t[mode_t["game"] = 1] = "game";
    mode_t[mode_t["clear"] = 2] = "clear";
    mode_t[mode_t["gameover"] = 3] = "gameover";
})(mode_t || (mode_t = {}));
var mode;
function main_loop() {
    hitoobj.main_loop();
    stageobj.main_loop();
    for (var i = 0; i < toriobj.length; ++i) {
        if (toriobj[i] != null && toriobj[i].main_loop()) {
            toriobj[i] = null;
        }
    }
    for (var i = 0; i < woodobj.length; ++i) {
        if (woodobj[i] != null && woodobj[i].main_loop()) {
            woodobj[i] = null;
        }
    }
    for (var i = 0; i < bulletobj.length; ++i) {
        if (bulletobj[i] != null && bulletobj[i].main_loop()) {
            bulletobj[i] = null;
        }
    }
    if (flagobj != null && flagobj.main_loop()) {
        hit_bonus = level_correction[stageobj.get_level()] * maxcount * 1000;
        level_bonus = level_correction[stageobj.get_level()] * 10000;
        clear_time = 50;
        mode = mode_t.clear;
    }
    for (var i = 0; i < toriobj.length; ++i) {
        if (toriobj[i] != null && toriobj[i].gameover()) {
            clear_time = 50;
            mode = mode_t.gameover;
        }
    }
    for (var i = 0; i < bulletobj.length; ++i) {
        if (bulletobj[i] != null && bulletobj[i].gameover()) {
            clear_time = 50;
            mode = mode_t.gameover;
        }
    }
    if (rest > 0) {
        --rest;
    }
    else {
        soten -= Math.min(soten, 100);
    }
    if (soten == 0) {
        count = 0;
    }
    draw();
    ctx.beginPath();
    ctx.arc(320, 290, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}
function init(s) {
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
function draw() {
    hitoobj.draw();
    for (var i = 0; i < woodobj.length; ++i) {
        if (woodobj[i] != null) {
            woodobj[i].draw();
        }
    }
    for (var i = 0; i < toriobj.length; ++i) {
        if (toriobj[i] != null) {
            toriobj[i].draw();
        }
    }
    for (var i = 0; i < bulletobj.length; ++i) {
        if (bulletobj[i] != null) {
            bulletobj[i].draw();
        }
    }
    if (flagobj != null) {
        flagobj.draw();
    }
    ctx.fillStyle = "white";
    ctx.fillText("score:" + score, 0, 0);
    ctx.fillText("+" + soten, 0, 20);
    if (count > 2) {
        ctx.save();
        ctx.translate(0, 40);
        ctx.scale(2, 2);
        ctx.fillText(count + "Hits", 0, 0);
        ctx.restore();
    }
    if (rest > 0) {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 70, rest, 8);
    }
}
function title_loop() {
    ctx.drawImage(title, 0, 0);
    for (var i = 0; i < 3; ++i) {
        write_rect(30 + i * 160, 310, 100, 40, level_color[i]);
        write_text_middle(level_string[i], 80 + i * 160, 330, level_text_color[i], 1.5);
    }
}
function gameover_loop() {
    draw();
    write_text_middle("GAME OVER", 320, 180, "white", 5);
    if (clear_time == 0) {
        write_text_middle("タイトルに戻る", 320, 330, "white");
    }
    else {
        --clear_time;
    }
}
var hit_bonus;
var level_bonus;
var clear_time;
function clear_loop() {
    if (clear_time > 0) {
        --clear_time;
    }
    else if (hit_bonus != 0) {
        var d = Math.min(hit_bonus, 1000);
        hit_bonus -= d;
        score += d;
    }
    else if (level_bonus != 0) {
        var d = Math.min(level_bonus, 1000);
        level_bonus -= d;
        score += d;
    }
    draw();
    write_text_middle("GAME CLEAR!!", 320, 60, "black", 3);
    write_text("Hit Bonus:" + maxcount + " × " + 1000 + " × " + level_correction[stageobj.get_level()] + " = " + hit_bonus, 30, 100, "black", 1.5);
    write_text("Level Bonus:" + 10000 + " × " + level_correction[stageobj.get_level()] + " = " + level_bonus, 30, 140, "black", 1.5);
    if (hit_bonus == 0 && level_bonus == 0) {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 300, 320, 60);
        write_text_middle("Tweetする", 160, 330, "white", 2);
        write_text_middle("タイトルに戻る", 480, 330, "black", 2);
    }
}
function loop() {
    ctx.drawImage(haikei, 0, 0);
    if (mode == mode_t.title) {
        title_loop();
    }
    else if (mode == mode_t.game) {
        main_loop();
    }
    else if (mode == mode_t.clear) {
        clear_loop();
    }
    else if (mode == mode_t.gameover) {
        gameover_loop();
    }
}
function clicked(e) {
    var x = e.pageX - canvas.offsetLeft + window.pageXOffset;
    var y = e.pageY - canvas.offsetTop + window.pageYOffset;
    if (mode == mode_t.title) {
        if (310 < y && y < 350) {
            if (30 + 160 * 0 < x && x < 160 * 1 - 30) {
                init(new stages.easy());
            }
            if (30 + 160 * 1 < x && x < 160 * 2 - 30) {
                init(new stages.normal());
            }
            if (30 + 160 * 2 < x && x < 160 * 3 - 30) {
                init(new stages.hard());
            }
        }
    }
    else if (mode == mode_t.game) {
        hitoobj.clicked(x, y);
        for (var i = 0; i < toriobj.length; ++i) {
            if (toriobj[i] != null) {
                toriobj[i].clicked(x, y);
            }
        }
        for (var i = 0; i < woodobj.length; ++i) {
            if (woodobj[i] != null) {
                woodobj[i].clicked(x, y);
            }
        }
        for (var i = 0; i < bulletobj.length; ++i) {
            if (bulletobj[i] != null) {
                bulletobj[i].clicked(x, y);
            }
        }
    }
    else if (mode == mode_t.gameover) {
        if (clear_time == 0) {
            mode = mode_t.title;
        }
    }
    else if (mode == mode_t.clear) {
        if (hit_bonus == 0 && level_bonus == 0) {
            if (0 < x && x < 320 && 300 < y && y < 360) {
                var url = "http://plasma-effect.github.io/Aho22/main.html";
                var text = encodeURIComponent("「パターセイバー」難易度" + level_string[stageobj.get_level()] + "でscore:" + score + "点を獲得しました！");
                var tag = "putter_savior";
                window.open("https://twitter.com/intent/tweet?text=" + text + "&hashtags=" + tag + "&url=" + url);
            }
            else if (320 < x && x < 640 && 300 < y && y < 360) {
                mode = mode_t.title;
            }
        }
    }
}
window.onload = function () {
    canvas = document.getElementById("field");
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
    var i = 0;
    haikei.onload = tori.onload = hito.onload = ki.onload = hata.onload = title.onload = function () {
        ++i;
        if (i == 6) {
            setInterval(loop, 20);
        }
    };
};
//# sourceMappingURL=game.js.map