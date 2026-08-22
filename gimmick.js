const GIMMICK = {
    playDuration: 1800,
    restDuration: 300,

    scrambleInterval: 1200,

    paywallInterval: 2400,
    paywallPayChance: 0.5,

    greenDuration: 900,
    redDuration: 300,

    lavaRiseSpeed: 0.05,
};

function updateRest() {
    if (state.resting) {
        state.restTime--;
        if (state.restTime <= 0) {
            state.resting = false;
            state.playTime = GIMMICK.playDuration;
        }
        return true;
    }

    state.playTime--;
    if (state.playTime <= 0) {
        state.resting = true;
        state.restTime = GIMMICK.restDuration;
    }
    return false;
}

function updateControlScramble() {
    if (state.counter > GIMMICK.scrambleInterval) {
        state.changeControls = !state.changeControls;
        state.counter = 0;
    }
    state.counter++;
}

function updatePaywall() {
    if (state.time > GIMMICK.paywallInterval) {
        state.time = 0;
        alert("pay up");
        if (Math.random() < GIMMICK.paywallPayChance) {
            alert("ty");
        } else {
            alert("you didn't pay");
            death();
        }
    }
    state.time++;
}

function updateRedLight() {
    if (state.redLight) {
        state.redLightTimer--;
        if (state.redLightTimer <= 0) {
            state.redLight = false;
            state.greenLightTimer = GIMMICK.greenDuration;
            state.redLightTimer = GIMMICK.redDuration;
        }
    } else {
        state.greenLightTimer--;
        if (state.greenLightTimer <= 0) {
            state.redLight = true;
            state.greenLightTimer = GIMMICK.greenDuration;
            state.redLightTimer = GIMMICK.redDuration;
        }
    }
}

function updateLava() {
    state.lavaHeight -= GIMMICK.lavaRiseSpeed;
}

function resetLava() {
    state.lavaHeight = WORLD_HEIGHT;
}
