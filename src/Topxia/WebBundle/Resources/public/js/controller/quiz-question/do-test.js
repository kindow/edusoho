define(function(require, exports, module) {

    exports.run = function() {

        // setInterval("", 50);

        var changeAnswers = {};

        $('*[data-type]').each(function(index){
            var name = $(this).attr('name');

            $(this).on('change', function(){
                // var name = $(this).attr('name');

                var values = [];
                //choice
                if ($(this).data('type') == 'choice') {

                    $('input[name='+name+']:checked').each(function(){
                        values.push($(this).val());
                    });

                }
                //determine
                if ($(this).data('type') == 'determine') {

                    $('input[name='+name+']:checked').each(function(){
                        values.push($(this).val());
                    });

                }
                //fill
                if ($(this).data('type') == 'fill') {

                    $('input[name='+name+']').each(function(){
                        values.push($(this).val());
                    });

                }
                //essay
                if ($(this).data('type') == 'essay') {
                    if ($(this).val() != "") {
                        values.push($(this).val());
                    }     

                }

                changeAnswers[name] = values;


                if (values.length > 0) {
                    $('a[href="#question' + name + '"]').addClass('done');
                } else {
                    $('a[href="#question' + name + '"]').removeClass('done');
                }


            });

        });

        $('.panel-footer').on('click', 'a.btn', function(){
            id = $(this).parents('.panel').attr('id');
            btn = $('.answerCard .panel-body [href="#'+id+'"]');
            if (btn.css('border-left-width') == '1px') {
                btn.addClass('have-pro');
            } else {
                btn.removeClass('have-pro');
            }
        });

        $('body').on('click', '#postPaper, #finishPaper', function(){

            $.post($(this).data('url'), {data:changeAnswers}, function(){
                changeAnswers = {};
            });

        });

        $('.choice').on('click', 'ul li', function(){
            $input = $(this).parents('div.choice').find('.panel-footer label').eq($(this).index()).find('input');
            isChecked = $input.prop("checked");
            $input.prop("checked", !isChecked).change();
            
        });



        var deadline = $('#time_show').data('time');

        var timer = timerShow(function(){
                deadline--;
                $('#time_show').text(formatTime(deadline));

                if (deadline == 0) {
                    $.post($('#finishPaper').data('url'), {data:changeAnswers}, function(){
                        changeAnswers = {};
                    });
                }

            }, 1000, true);

        $('#pause').on('click', function(){
            timer.pause();
        });

        $('div#modal').on('hidden.bs.modal',function(){
            timer.play();
        });

    };




    function timerShow(func, time, autostart) {
        this.set = function(func, time, autostart) {
            this.init = true;
            if(typeof func == 'object') {
                var paramList = ['autostart', 'time'];
                for(var arg in paramList) {
                    if(func[paramList[arg]] != undefined) {
                        eval(paramList[arg] + " = func[paramList[arg]]");
                    }
                };
                func = func.action;
            }
            if(typeof func == 'function') {this.action = func;}
            if(!isNaN(time)) {this.intervalTime = time;}
            if(autostart && !this.isActive) {
                this.isActive = true;
                this.setTimer();
            }
            return this;
        };
        this.once = function(time) {
            var timer = this;
            if(isNaN(time)) {
                time = 0;
            }
            window.setTimeout(function() {timer.action();}, time);
            return this;
        };
        this.play = function(reset) {
            if(!this.isActive) {
                if(reset) {this.setTimer();}
                else {this.setTimer(this.remaining);}
                this.isActive = true;
            }
            return this;
        };
        this.pause = function() {
            if(this.isActive) {
                this.isActive = false;
                this.remaining -= new Date() - this.last;
                this.clearTimer();
            }
            return this;
        };
        this.stop = function() {
            this.isActive = false;
            this.remaining = this.intervalTime;
            this.clearTimer();
            return this;
        };
        this.toggle = function(reset) {
            if(this.isActive) {this.pause();}
            else if(reset) {this.play(true);}
            else {this.play();}
            return this;
        };
        this.reset = function() {
            this.isActive = false;
            this.play(true);
            return this;
        };
        this.clearTimer = function() {
            window.clearTimeout(this.timeoutObject);
        };
        this.setTimer = function(time) {
            var timer = this;
            if(typeof this.action != 'function') {return;}
            if(isNaN(time)) {time = this.intervalTime;}
            this.remaining = time;
            this.last = new Date();
            this.clearTimer();
            this.timeoutObject = window.setTimeout(function() {timer.go();}, time);
        };
        this.go = function() {
            if(this.isActive) {
                this.action();
                this.setTimer();
            }
        };

        if(this.init) {
            return new $.timer(func, time, autostart);
        } else {
            this.set(func, time, autostart);
            return this;
        }
    };

    function formatTime(time) {
        // time = time / 10;
        var hour = parseInt(time / 3600),
        min = parseInt(time / 60) - hour * 60,
        sec = time - (min * 60) - hour * 3600;
        return (hour > 0 ? pad(hour, 2) : "00") + ":" + (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
    };
    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {str = '0' + str;}
        return str;
    };


});

