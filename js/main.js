"use strict";

$('document').ready(function() {

    // Define Time Modes
    function oTimeMode(name, minute, second) {
        this.name = name;
        this.minute = minute;
        this.second = second;
    }

    var timeMode = [];
    timeMode[0] = new oTimeMode('Pomodoro Time', 25, 0);
    timeMode[1] = new oTimeMode('Short-Break Time', 5, 0);
    timeMode[2] = new oTimeMode('Long-Break Time', 15, 0);

    // Setup shortcut keys
    $(document).keypress(function(e) {
      if(e.charCode == 32) {
        startTimer();
      }
      if(e.charCode == 115) {
        stopTimer();
      }
    });

    function Timer(timeModeIndex, minute, second, isRunning, timeInterval) {
      this.timeModeIndex = timeModeIndex;
      this.minute = minute;
      this.second = second;
      this.isRunning = isRunning;
      this.timeInterval =  timeInterval;
    }

    var currTimer = new Timer(0, timeMode[0].minute, false, timeMode[0].second);

    function updateTimeMode() {
      for (let index in timeMode) {
          // Update Timer
          timeMode[index].minute = parseInt($('#timemode' + index).find('.timemode-minute').val(), 10) || 0;
          timeMode[index].second = parseInt($('#timemode' + index).find('.timemode-second').val(), 10) || 0;
      }
    }

    function changeTimeMode(index) {
        if (currTimer.isRunning) return;
        updateTimeMode();
        // Reselect timemode
        $('.selected-timemode').removeClass('selected-timemode');
        $('#timemode' + index).find('.timemode-name').addClass('selected-timemode');
        $('#minute').html(timeMode[index].minute);
        $('#second').html(timeMode[index].second);

        //currTimer
        currTimer.minute = timeMode[index].minute;
        currTimer.second = timeMode[index].second;
        currTimer.timeModeIndex = index;
    }

    // Write Setting-Area
    {
        $('.setting-wrapper th').html('Click the Timer-Mode you want to use then click Start');
        for (let index in timeMode) {
            let settingBody = $('.setting-wrapper tbody')
            let settingHTML = '';
            settingHTML += '<tr id="timemode' + index + '">';
            settingHTML += '<td><span class="timemode-name pomo-label">' + timeMode[index].name + '</span></td>';
            settingHTML += '<td><input class="timemode-minute pomo-inp" type="number" min="0" step="1" size="2" value="' + timeMode[index].minute + '"> m</td>';
            settingHTML += '<td><input class="timemode-second pomo-inp" type="number" min="0" step="1" size="2" type="number" value="' + timeMode[index].second + '"> s</td>';
            settingHTML += '</tr>';
            settingBody.append(settingHTML);
            $('#timemode' + index).find('.timemode-name').click(function() {
                changeTimeMode(index)
            });
        }

        $('#timemode0').find('.timemode-name').addClass('selected-timemode');
    }

    function loopTime() {
        if (currTimer.second > 0 || currTimer.minute > 0) {
            if (currTimer.second > 0) {
                currTimer.second--;
            } else {
                currTimer.minute--;
                currTimer.second = 59;
            }
            $('#minute').html(currTimer.minute);
            $('#second').html(currTimer.second);
        } else {
            clearInterval(currTimer.timeInterval);
            currTimer.isRunning = false;
            $('#minute').html('Time');
            $('#second').html('out!');
            document.getElementById('alarm-sound').play();
        }
    }

    function startTimer() {
      if (!currTimer.isRunning) {
        updateTimeMode();
        currTimer.minute = timeMode[currTimer.timeModeIndex].minute;
        currTimer.second = timeMode[currTimer.timeModeIndex].second;
        currTimer.isRunning = true;
        currTimer.timeInterval = setInterval(function(){loopTime()}, 1000);
      }
    }
    $('#start-btn').click(startTimer);

    function stopTimer() {
        clearInterval(currTimer.timeInterval);
        currTimer.isRunning = false;
    }
    $('#stop-btn').click(stopTimer);

});
